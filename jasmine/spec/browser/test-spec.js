(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
describe('Inverted index class', () => {
  const InvertedIndex = require('../../src/inverted-index');
  const book = require('../../public/books/books.json');
  
  const indexFile = new InvertedIndex();

  describe('Read book data', () => {
    it('Assert that JSON file is not empty', () => {
      expect(book).not.toEqual({});
    });

    it('Should return false if the number of keys of the book object is not exactly 2', () => {
      const Book1 = {title: 'new title', content1 : 'A new content1', content2 : 'A new content2'};
      const Book2 = book;
      Book2[1] = {content: 'content'};
      expect(indexFile.createIndex(Book1)).toBeFalsy();
      expect(indexFile.createIndex(Book2)).toBeFalsy();
    });
  });

  describe('Populate Index', () => {
    const indexObject = indexFile.createIndex(book);
    it('Should create an index', () => {
      expect(indexObject).toBeTruthy();
    });

    it('Should map string keys to the appropriate json object', () => {
      const getTheIndex = indexFile.getIndex();
      expect(getTheIndex['alice']).toEqual(['Alice in Wonderland']);
      expect(getTheIndex['a']).toEqual(['Alice in Wonderland','The Lord of the Rings: The Fellowship of the Ring.']);
      expect(getTheIndex['unusual']).toEqual(['The Lord of the Rings: The Fellowship of the Ring.']);
    });

    it('Should return false if no index is created', () => {
      const noIndex = new InvertedIndex();
      expect(noIndex.getIndex()).toBeFalsy();
    });
  });

  describe('Search index', () => {
    it('Should return an array of the indices of the correct objects that contain the words in the search query', () => {
      expect(indexFile.searchIndex('alice')).toEqual({alice : [0]});
      expect(indexFile.searchIndex('of')).toEqual({alice : [0], of : [0,1]});
      expect(indexFile.searchIndex('alliance')).toEqual({alice : [0], of : [0,1], alliance : [1]});
    });
  })

  describe('mergeObjects method', () => {
    const obj1 = { title: '1', content: ['2', '3'] };

    const obj2 = { title: '4',content: ['4'] };

    const result = { title: '1', content: ['2', '3', '4'] };

    let merge = indexFile.mergeObjects(obj1, obj2);
  
    it('should merge the content of two objects', () => {
      expect(merge['content']).toEqual(result['content']);
    });

    it('should return false if the arguments are not objects', () => {
      expect(indexFile.mergeObjects('arg1', 'arg2')).toBeFalsy();
    });

  });

  describe('filter method', () => {
    it('should take a string and return an array of filtered text in lower case', () => {
      expect(indexFile.filter('This$ i_s t£ext, to BE Te:steD')).toEqual(['this', 'is', 'text', 'to', 'be', 'tested']);
    });

    it('should return false if the argument to be filtered is not a string', () => {
      expect(indexFile.filter(['one, two'])).toBeFalsy();
    });
  });

  describe('generateUniqueArray method', () => {
    it('should return an array of unique contents of the array argument', () => {
      expect(indexFile.generateUniqueArray([1, 1, 2, 2, 'yes', 'yes'])).toEqual([1, 2, 'yes']);
    });

    it('should return false if the argument specified is not an array', () => {
      expect(indexFile.generateUniqueArray('12345')).toBeFalsy();
    });
  });

  describe('getStory method', () => {
    let theStoryFile = { title: 'story title', content: 'story content' };
    let newIndex = new InvertedIndex();
    newIndex.createIndex(theStoryFile);

    it('should return an object of all the titles and stories', () => {
      expect(newIndex.getStory()).toEqual({ titles: ['story title'], stories: ['story content'] });
    });

  });

});
},{"../../public/books/books.json":2,"../../src/inverted-index":3}],2:[function(require,module,exports){
module.exports=[
  {
    "title": "Alice in Wonderland",
    "text": "Alice falls into a rabbit hole and enters a world full of imagination."
  },

  {
    "title": "The Lord of the Rings: The Fellowship of the Ring.",
    "text": "An unusual alliance of man, elf, dwarf, wizard and hobbit seek to destroy a powerful ring."
  }
]

},{}],3:[function(require,module,exports){

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
	* @param {string}
  * @returns {object}
	**/

  createIndex(thisObject) {

    if (Object.keys(thisObject).length <= 0){
      return false;
    }

    let objectIndex = {};

    // Check if the data is a single json object(one content) and resolve
    if (!Array.isArray(thisObject)) {
      if (Object.keys(thisObject).length !== 2){
        return false;
      }

      let objectTitle = thisObject[Object.keys(thisObject)[0]],
        objectContent = thisObject[Object.keys(thisObject)[1]];  

      this.titles.push(objectTitle);
      this.stories.push(objectContent);

      let wordsInText = `${objectTitle} ${objectContent}`;
      wordsInText = this.generateUniqueArray(this.filter(wordsInText));

      for (let word of wordsInText) {
        objectIndex[word] = [objectTitle];
      }

    } else {
      let dataLength = thisObject.length;
      for (let i = 0; i < dataLength; i++) {
        if (Object.keys(thisObject[i]).length !== 2){
          return false;
        }
        let objectTitle = thisObject[i][Object.keys(thisObject[i])[0]],
          objectContent = thisObject[i][Object.keys(thisObject[i])[1]];

        this.titles.push(objectTitle);
        this.stories.push(objectContent);

        let wordsInText = `${objectTitle} ${objectContent}`;
        console.log(wordsInText);
        wordsInText = this.generateUniqueArray(this.filter(wordsInText));
        if(wordsInText){
          for (let word of wordsInText) {
            if (objectIndex[word]){
              objectIndex[word] = objectIndex[word].concat([objectTitle]);
            }
            else{
              objectIndex[word] = [objectTitle];
            }
          }
        }
      }
    }
    this.indexes = this.mergeObjects(this.indexes, objectIndex);
    return true;
  }


  /**
      * Method to filter out special characters and create a string out of the words specified
      * @param {string}
      * @returns {array}
      */

  filter(aString) {

    if ((typeof aString) !== 'string'){
      return false;
    }

    return aString.replace(/[.,\/#!$£%\^&\*;:'{}=\-_`~()]/g, '').toLowerCase().split(' ');
  }


  /**
  * Method to merge two objects.
  * @param {object} {object}
  * @returns {object}
  */
  mergeObjects(dest, src) {
    if ((typeof dest !== 'object') || (typeof src !== 'object')){
      return false;
    }
    let makeUnique = this.generateUniqueArray;
    Object.keys(src).forEach(function(key) {
      if (dest[key]){
        dest[key] = makeUnique(dest[key].concat(src[key]));
      }   
      else {
        dest[key] = src[key];
      }
    });
    return dest;
  }


  /**
    * Method to generate unique array items from the array specified.
    * @param {array}
    * @returns {array}
    */
  generateUniqueArray(thisArray) {
    if (!Array.isArray(thisArray)){
      return false;
    }
    let uniqueArray = [];
    thisArray.forEach((value) => {
      let index = uniqueArray.indexOf(value);
      if (index === -1){
        uniqueArray.push(value);
      }
    });
    return uniqueArray;
  }


  /**
    * getStory method to return an array of titles and corresponding stories
    * @param {}
    * @returns {object}
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
   * @returns {object}
   */

  getIndex() {
    // Check if an index has been created
    if (!Object.keys(this.indexes)[0]){
      return false;
    }

    return this.indexes;
  }


  /**
   * searchIndex method to search for index
   * @param {string}
   * @returns {object}
   */

  searchIndex(term, criteria = null) {
    let docPosition = [];
    if (this.indexes[term]) {
      if ((criteria === null) || (criteria === undefined)) {
        for (let title of this.indexes[term]) {
          docPosition.push(this.titles.indexOf(title));
        }
        this.searchResult[term] = docPosition;
        return this.searchResult;
      } else {
        if (this.indexes[term].indexOf(criteria) !== -1) {
          docPosition.push(this.indexes[term].indexOf(criteria));
          this.searchResult[term] = docPosition;
          return this.searchResult;
        }
      }
    }
    else{
      return false;
    }
  }
}
module.exports = InvertedIndex;
},{}]},{},[1]);
