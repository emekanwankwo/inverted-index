(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
describe('Inverted index class', () => {
  let InvertedIndex = require('../../src/inverted-index');
  let indexFile = new InvertedIndex();

  describe('Read book data', () => {

    let emptyFile = {};
    let emptyJson = indexFile.createIndex(emptyFile);
    it('Should return false if json file is empty', () => {
      expect(emptyJson).toBeFalsy();
    });

    let wrongFormat1 = [ { 'text': 'Some may trust in' }, { 'title': 'Travis' } ];
    let wrongFormat2 = { 'title': 'Some may trust in', 'text1': 'Travis', 'text2': 'CI' };

    it('Should return false if json object is not formatted to have only two keys', () => {
      expect(indexFile.createIndex(wrongFormat1)).toBeFalsy();
      expect(indexFile.createIndex(wrongFormat2)).toBeFalsy();
    });

  });

  describe('Populate Index', () => {
    let obj = {
      'a': ['doc1', 'doc2'],
      'b': ['doc2', 'doc3']
    };

    let singleJsonFile = {
      'a': 'single title',
      'b': 'single content'
    };

    let multipleJsonArray = [{
      'a': 'multiple title1',
      'b': 'multiple content1'
    }, {
      'c': 'multiple title2',
      'd': 'multiple content2'
    }
    ];

    let createSingle = indexFile.createIndex(singleJsonFile);
    let createMultiple = indexFile.createIndex(multipleJsonArray);

    it('should return an object which indexes each word in a single or multiple JSON object to an array of the titles they appear in.', () => {
      expect(JSON.stringify(createSingle)).toBe(JSON.stringify({
        'single': ['single title'],
        'title': ['single title'],
        'content': ['single title']
      }));

      expect(JSON.stringify(createMultiple)).toBe(JSON.stringify({
        'multiple': ['multiple title1', 'multiple title2'],
        'title1': ['multiple title1'],
        'content1': ['multiple title1'],
        'title2': ['multiple title2'],
        'content2': ['multiple title2'],
      }));
    });

    indexFile.createIndex(obj);
    let theData = indexFile.getIndex(obj);
    it('should return an object that stores arrays of words and titles', () => {
      expect(JSON.stringify(theData)).toBe(JSON.stringify({
        words: ['a', 'b'],
        titles: ['doc1', 'doc2', 'doc3']
      }));
    });

    let emptyFile = {};
    let emptyIndex = indexFile.getIndex(emptyFile);
    it('should return false if an empty object argument is passed in', () => {
      expect(emptyIndex).toBeFalsy();
    });

  });

  describe('Search Index', () => {
    let newSearchIndex = new InvertedIndex();
    let theFile = {
      'a': 'the title',
      'b': 'movie content'
    };
    newSearchIndex.createIndex(theFile);
    it('Should return an object with the search term as key and an array of the documents as value if term exists and return false otherwise', () => {
      expect(JSON.stringify(newSearchIndex.searchIndex('movie'))).toBe(JSON.stringify({movie : [0]}));
      expect(JSON.stringify(newSearchIndex.searchIndex('content', 'the title'))).toBe(JSON.stringify({movie : [0], content : [0]}));
      expect(newSearchIndex.searchIndex('fruit')).toBeFalsy();
    });
  });

  describe('mergeObjects method', () => {
    let obj1 = {
      'a': '1',
      'b': ['2', '3']
    };

    let obj2 = {
      'c': '4',
      'b': ['4']
    };

    let result = {
      a: '1',
      b: ['2', '3', '4'],
      c: '4'
    };
    let merge = indexFile.mergeObjects(obj1, obj2);
    it('should merge the content of two objects', () => {
      expect(JSON.stringify(merge)).toBe(JSON.stringify(result));
    });

    let invalidObject = indexFile.mergeObjects('arg1', 'arg2');
    it('should return false if the arguments are not objects', () => {
      expect(invalidObject).toBeFalsy();
    });

  });

  describe('filterWord method', () => {
    let stringWord = indexFile.filterWord('This$ i_s t£ext, to BE Te:steD');
    it('should take a string and return an array of filtered text in lower case', () => {
      expect(JSON.stringify(stringWord)).toBe(JSON.stringify(['this', 'is', 'text', 'to', 'be', 'tested']));
    });

    let notString = indexFile.filterWord(['one, two']);
    it('should return false if the argument to be filtered is not a string', () => {
      expect(notString).toBeFalsy();
    });

  });

  describe('generateUniqueArray method', () => {
    let generate = indexFile.generateUniqueArray([1, 1, 2, 2, 'yes', 'yes']);
    it('should return an array of unique contents of the array argument', () => {
      expect(JSON.stringify(generate)).toBe(JSON.stringify([1, 2, 'yes']));
    });

    let invalidArray = indexFile.generateUniqueArray('12345');
    it('should return false if the argument specified is not an array', () => {
      expect(invalidArray).toBeFalsy();
    });

  });

  describe('getStory method', () => {
    let theStoryFile = {
      'x': 'story title',
      'y': 'story content'
    };
    let newIndex = new InvertedIndex();
    newIndex.createIndex(theStoryFile);
    let theStory = newIndex.getStory();
    it('should return an object of all the titles and stories', () => {
      expect(JSON.stringify(theStory)).toBe(JSON.stringify({
        titles: ['story title'],
        stories: ['story content']
      }));
    });
  });

});
},{"../../src/inverted-index":2}],2:[function(require,module,exports){

/**** Inverted Index Application to index, sort and search words in a string ******/

class InvertedIndex {

  /**
   @constructor
   */
  constructor() {
    this.stories = [];
    this.titles = [];
    this.indexes = {};
    this.searchResult = {};
  }

  /**
	* Creates an Index of the file at the path specified
	* @Params {string}
  * @Returns {}
	**/

  createIndex(data) {

    if(Object.keys(data).length <= 0)
      return false;

    let objectIndex = {};

    // Check if the data is a single json object(one content) and resolve
    if (!Array.isArray(data)) {
      let objectTitle = data[Object.keys(data)[0]],
        objectContent = data[Object.keys(data)[1]];
        if(Object.keys(data).length !== 2)
          return false;

      this.titles.push(objectTitle);
      this.stories.push(objectContent);

      let wordsInText = `${objectTitle} ${objectContent}`;
      wordsInText = this.generateUniqueArray(this.filterWord(wordsInText));

      for (let word of wordsInText)
        objectIndex[word] = [objectTitle];
        // try {
        //   objectIndex[word] = [objectTitle];
        // } catch (e) {
        //   throw Error('Could not create index');
        // }
    } else {
      let dataLength = data.length;
      for (let i = 0; i < dataLength; i++) {
        let objectTitle = data[i][Object.keys(data[i])[0]],
          objectContent = data[i][Object.keys(data[i])[1]];
          if(Object.keys(data[i]).length !== 2)
            return false;

        this.titles.push(objectTitle);
        this.stories.push(objectContent);

        let wordsInText = `${objectTitle} ${objectContent}`;
        wordsInText = this.generateUniqueArray(this.filterWord(wordsInText));

        for (let word of wordsInText) {
          // try {
            if (objectIndex[word])
              objectIndex[word] = objectIndex[word].concat([objectTitle]);
            else
              objectIndex[word] = [objectTitle];
          // } catch (e) {
          //   throw Error('Could not create index');
          // }
        }
      }
    }
    this.indexes = this.mergeObjects(this.indexes, objectIndex);
    return objectIndex;
  }


  /**
      * Method to filter out special characters and create a string out of the words specified
      * @Params {string}
      * @Returns {array}
      */

  filterWord(word) {
    if((typeof word) !== 'string')
      return false;
    return word.replace(/[.,\/#!$£%\^&\*;:'{}=\-_`~()]/g, '').toLowerCase().split(' ');
  }


  /**
  * Method to merge two objects.
  * @Params {object} {object}
  * @Returns {object}
  */
  mergeObjects(dest, src) {
    if((typeof dest !== 'object') || (typeof src !== 'object'))
      return false;
    let makeUnique = this.generateUniqueArray;
    Object.keys(src).forEach(function(key) {
      if (dest[key]) {
        dest[key] = makeUnique(dest[key].concat(src[key]));
      }
      else
        dest[key] = src[key];
    });
    return dest;
  }


  /**
    * Method to generate unique array items from the array specified.
    * @Params {array}
    * @Returns {array}
    */
  generateUniqueArray(data) {
    if(!Array.isArray(data))
      return false;
    let uniqueArray = [];
    data.forEach((value) => {
      let index = uniqueArray.indexOf(value);
      if (index === -1)
        uniqueArray.push(value);
    });
    return uniqueArray;
  }


  /**
    * getStory method to return an array of titles and corresponding stories
    * @Params {}
    * @Returns {object}
    */

  getStory() {
    return {
      titles: this.generateUniqueArray(this.titles),
      stories: this.stories
    };
  }


  /**
   * getIndex Method to get the index of an element
   * @param {object}
   * @Returns {object}
   */

  getIndex(data) {
    if (Object.keys(data).length <= 0)
      return false;
    let terms = [];
    let columns = [];
    terms = Object.keys(data);
    for (let term of terms)
      columns = columns.concat(data[term]);
    columns = this.generateUniqueArray(columns);

    return {
      words: terms,
      titles: columns
    };
  }


  /**
   * searchIndex method to search for index
   * @Params {string}
   * @Returns {object}
   */

  searchIndex(term, criteria = null) {
    let docPosition = [];
    if (this.indexes[term]) {
      if ((criteria === null) || (criteria === undefined)){
        for(let title of this.indexes[term]){
          docPosition.push(this.titles.indexOf(title));
        }
        this.searchResult[term] = docPosition;
        return this.searchResult;
      }
      else {
        if (this.indexes[term].indexOf(criteria) !== -1){
          docPosition.push(this.indexes[term].indexOf(criteria));
          this.searchResult[term] = docPosition;
          return this.searchResult;
        }
      }
    }
    else
      return false;
  }
}
module.exports = InvertedIndex;
},{}]},{},[1]);
