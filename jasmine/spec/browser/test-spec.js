(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
module.exports={
	"title": "", 
	"content1":""
}

},{}],3:[function(require,module,exports){
module.exports=[{
	"title": ",;.", 
	"content1":",;."
}]

},{}],4:[function(require,module,exports){
module.exports={
"title": ["1"],
"content": ["2", "3"]
}

},{}],5:[function(require,module,exports){
module.exports={
"title": ["1"],
"content": ["4"]
}

},{}],6:[function(require,module,exports){
describe('Inverted index class', () => {
  const InvertedIndex = require('../../src/inverted-index'),
    book = require('../books.json'),
    storyBook = require('../storybook.json'),
    mergeSrc = require('../merge-source.json'),
    mergeDest = require('../merge-dest.json'),
    invalidBook1 = require('../invalid/book1.json'),
    invalidBook2 = require('../invalid/book2.json');
  
  const invertedIndex = new InvertedIndex();

  describe('Read book data', () => {
    it('Assert that JSON file is not empty', () => {
      expect(book).not.toEqual({});
    });

    it('Should return false if the values of the keys are empty', () => {
      expect(invertedIndex.createIndex(invalidBook1)).toBeFalsy();
    });

    it('Should return false if the values of the keys are invalid', () => {
      expect(invertedIndex.createIndex(invalidBook2)).toBeFalsy();
    });
  });

  describe('Populate Index', () => {
    const indexObject = invertedIndex.createIndex(book);
    it('Should create an index', () => {
      expect(indexObject).toBeTruthy();
    });
    it('Should map string keys to the appropriate json object', () => {
      const getTheIndex = invertedIndex.getIndex();
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
      expect(invertedIndex.searchIndex('alice')).toEqual({alice : [0]});
      expect(invertedIndex.searchIndex('of')).toEqual({of : [0,1]});
      expect(invertedIndex.searchIndex('alliance')).toEqual({alliance : [1]});
      expect(invertedIndex.searchIndex('of','Alice in Wonderland')).toEqual({of : [0]});
      expect(invertedIndex.searchIndex('foodie')).toBeFalsy();
    });
  })

  describe('merge objects', () => {
    const merge = invertedIndex.mergeObjects(mergeDest, mergeSrc);
  
    it('should merge the content of two objects', () => {
      expect(merge).toEqual({ title: ['1'], content: ['2', '3', '4'] });
    });
    it('should return false if the arguments are not objects', () => {
      expect(invertedIndex.mergeObjects('arg1', 'arg2')).toBeFalsy();
    });
  });

  describe('filter string', () => {
    it('should take a string and return an array of filtered text in lower case', () => {
      expect(invertedIndex.filter('This$ i_s t£ext, Te:steD')).toEqual(['this', 'is', 'text', 'tested']);
    });
    it('should return false if the argument to be filtered is not a string', () => {
      expect(invertedIndex.filter(['one, two'])).toBeFalsy();
    });
    it('should return false if string is empty after filtering', () => {
      expect(invertedIndex.filter('.,;:-')).toBeFalsy();
    });
  });

  describe('generate unique array', () => {
    it('should return an array of unique contents of the array argument', () => {
      expect(invertedIndex.generateUniqueArray([1, 1, 2, 2, 'yes', 'yes'])).toEqual([1, 2, 'yes']);
    });
    it('should return false if the argument specified is not an array', () => {
      expect(invertedIndex.generateUniqueArray('12345')).toBeFalsy();
    });
  });

  describe('get story', () => {
    const newInvertedIndex = new InvertedIndex();
    newInvertedIndex.createIndex(storyBook);
    it('should return an object of all the titles and stories', () => {
      expect(newInvertedIndex.getStory()).toEqual({ titles: ['story title'], stories: ['story content'] });
    });
  });
});
},{"../../src/inverted-index":8,"../books.json":1,"../invalid/book1.json":2,"../invalid/book2.json":3,"../merge-dest.json":4,"../merge-source.json":5,"../storybook.json":7}],7:[function(require,module,exports){
module.exports={
"title": "story title",
"content": "story content"
}

},{}],8:[function(require,module,exports){

/** *Inverted Index Application to index, sort and search words in a string***/
/**
 * InvertedIndex Class.
 */
class InvertedIndex {

  /**
   *  @constructor
   */
  constructor() {
    this.stories = [];
    this.titles = [];
    this.indexes = {};
    this.searchResult = {};
    this.bookIndex = {};
  }

  /**
    * Creates an Index of the file at the path specified
    * @param {string} book
    * @returns {boolean} true if index is created and false otherwise
    */
  createIndex(book) {
    // Check if the data is a single json object(one content) and resolve
    if (!Array.isArray(book)) {
      const bookTitle = book[Object.keys(book)[0]],
        bookContent = book[Object.keys(book)[1]];
      this.bookIndex = this.generateObject(bookTitle, bookContent);
    } else {
      const dataLength = book.length;
      for (let i = 0; i < dataLength; i += 1) {
        const bookTitle = book[i][Object.keys(book[i])[0]],
          bookContent = book[i][Object.keys(book[i])[1]];
        this.bookIndex = this.generateObject(bookTitle, bookContent);
      }
    }
    if (!this.bookIndex) {
      this.bookIndex = {};
      return false;
    }
    this.indexes = this.mergeObjects(this.indexes, this.bookIndex);
    return true;
  }

  /**
   * Method to generate an object for each text in the specified array arguments.
   * @param {array} bookTitle
   * @param {array} bookContent
   * @returns {object} indexed words object.
   */
  generateObject(bookTitle, bookContent) {
    if (bookTitle.trim().length === 0 || bookContent.trim().length === 0) {
      return false;
    }

    let wordsInText = `${bookTitle} ${bookContent}`;
    wordsInText = this.generateUniqueArray(this.filter(wordsInText));
    if (!wordsInText) {
      return false;
    }

    this.titles.push(bookTitle);
    this.stories.push(bookContent);
    wordsInText.forEach((word) => {
      if (this.bookIndex[word]) {
        this.bookIndex[word] = this.bookIndex[word].concat([bookTitle]);
      } else {
        this.bookIndex[word] = [bookTitle];
      }
    });

    return this.bookIndex;
  }


  /**
    * Method to filter out special characters and create a string out of the words specified
    * @param {string} words
    * @returns {array} filtered array
    */
  filter(words) {
    if ((typeof words) !== 'string') {
      return false;
    }

    const filtered = words.replace(/[.,\/#!$£%\^&\*;:'{}=\-_`~()]/g, '')
      .toLowerCase();

    if (filtered.trim().length > 0) {
      return filtered.split(' ');
    }
  }


  /**
  * Method to merge two objects.
  * @param {object} dest destination object to be merged into
  * @param {object} src source object to merge into destination.
  * @returns {object} merged object containing the two object arguments.
  */
  mergeObjects(dest, src) {
    if ((typeof dest !== 'object') || (typeof src !== 'object')) {
      return false;
    }
    const makeUnique = this.generateUniqueArray;
    Object.keys(src).forEach((key) => {
      if (dest[key]) {
        dest[key] = makeUnique(dest[key].concat(src[key]));
      } else {
        dest[key] = src[key];
      }
    });
    return dest;
  }


  /**
    * Method to generate unique array items from the array specified.
    * @param {array} sampleArray
    * @returns {array} array of unique words
    */
  generateUniqueArray(sampleArray) {
    if (!Array.isArray(sampleArray)) {
      return false;
    }
    const uniqueArray = [];
    sampleArray.forEach((value) => {
      const index = uniqueArray.indexOf(value);
      if (index === -1) {
        uniqueArray.push(value);
      }
    });
    return uniqueArray;
  }


  /**
    * getStory method to return an array of titles and corresponding stories
    * @returns {object} object containing the titles and stories of the book
    */
  getStory() {
    return {
      titles: this.generateUniqueArray(this.titles),
      stories: this.stories,
    };
  }


  /**
   * getIndex Method to get the index of an element
   * @returns {object} object of the indexes created for the book file.
   */
  getIndex() {
    // Check if an index has been created
    if (!Object.keys(this.indexes)[0]) {
      return false;
    }

    return this.indexes;
  }


  /**
   * searchIndex method to search for index
   * @param {string} term term to be searched for.
   * @param {string} criteria a particular title to search in.
   * @returns {object} object containing the term and array of index of titles where it appears.
   */
  searchIndex(term, criteria = null) {
    const docPosition = [];
    this.searchResult = {};
    if (this.indexes[term]) {
      if ((criteria === null) || (criteria === undefined)) {
        this.indexes[term].forEach((title) => {
          docPosition.push(this.titles.indexOf(title));
        });
        this.searchResult[term] = docPosition;
        return this.searchResult;
      } else if (this.indexes[term].indexOf(criteria) !== -1) {
        docPosition.push(this.indexes[term].indexOf(criteria));
        this.searchResult[term] = docPosition;
        return this.searchResult;
      }
    } else {
      return false;
    }
  }
}
module.exports = InvertedIndex;

},{}]},{},[6]);
