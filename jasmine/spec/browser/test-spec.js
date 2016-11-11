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
describe('Inverted index class', () => {
  const InvertedIndex = require('../../src/inverted-index'),
    book = require('../books.json'),
    invalidBook1 = require('../invalid/book1.json'),
    invalidBook2 = require('../invalid/book2.json');
  
  const invertedIndex = new InvertedIndex();

  describe('Read book data', () => {
    it('Assert that JSON file is not empty', () => {
      expect(book).not.toEqual({});
    });

    it('Should return false if the number of keys of the book object is not exactly 2 or if the values are invalid', () => {
      expect(invertedIndex.createIndex(invalidBook1)).toBeFalsy();
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

  describe('mergeObjects method', () => {
    const obj1 = { title: ['1'], content: ['2', '3'] },
      obj2 = { title: ['1'], content: ['4'] },
      result = { title: ['1'], content: ['2', '3', '4'] },
      merge = invertedIndex.mergeObjects(obj1, obj2);
  
    it('should merge the content of two objects', () => {
      expect(merge).toEqual(result);
    });
    it('should return false if the arguments are not objects', () => {
      expect(invertedIndex.mergeObjects('arg1', 'arg2')).toBeFalsy();
    });
  });

  describe('filter method', () => {
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

  describe('generateUniqueArray method', () => {
    it('should return an array of unique contents of the array argument', () => {
      expect(invertedIndex.generateUniqueArray([1, 1, 2, 2, 'yes', 'yes'])).toEqual([1, 2, 'yes']);
    });
    it('should return false if the argument specified is not an array', () => {
      expect(invertedIndex.generateUniqueArray('12345')).toBeFalsy();
    });
  });

  describe('getStory method', () => {
    const theStoryFile = { title: 'story title', content: 'story content' };
    const newIndex = new InvertedIndex();
    newIndex.createIndex(theStoryFile);
    it('should return an object of all the titles and stories', () => {
      expect(newIndex.getStory()).toEqual({ titles: ['story title'], stories: ['story content'] });
    });
  });
});
},{"../../src/inverted-index":5,"../books.json":1,"../invalid/book1.json":2,"../invalid/book2.json":3}],5:[function(require,module,exports){

/***Inverted Index Application to index, sort and search words in a string***/

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
	* @param {string}
  * @returns {object}
	**/

  createIndex(book) {
    // Check if the data is a single json object(one content) and resolve
    if (!Array.isArray(book)) {
      const bookTitle = book[Object.keys(book)[0]],
        bookContent = book[Object.keys(book)[1]];
      this.bookIndex = this.generateObject(bookTitle, bookContent);
    } else {
      const dataLength = book.length;
      for (let i = 0; i < dataLength; i++) {
        const bookTitle = book[i][Object.keys(book[i])[0]],
          bookContent = book[i][Object.keys(book[i])[1]];
        this.bookIndex = this.generateObject(bookTitle, bookContent);
      }
    }
    if (!this.bookIndex) {
      return false;
    }
    this.indexes = this.mergeObjects(this.indexes, this.bookIndex);
    return true;
  }

  /**
   * Method to generate an object for each text in the specified array arguments.
   * @param {array} {array}
   * @returns {object}
   */
  generateObject(bookTitle, bookContent) {
    if (bookTitle.trim().length === 0 || bookContent.trim().length === 0) {
      return false;
    }

    let wordsInText = `${bookTitle} ${bookContent}`;
    wordsInText = this.generateUniqueArray(this.filter(wordsInText));
    if (wordsInText) {
      this.titles.push(bookTitle);
      this.stories.push(bookContent);
      for (let word of wordsInText) {
        if (this.bookIndex[word]) {
          this.bookIndex[word] = this.bookIndex[word].concat([bookTitle]);
        } else {
          this.bookIndex[word] = [bookTitle];
        }
      }
    } else {
      return false;
    }

    return this.bookIndex;
  }


  /**
    * Method to filter out special characters and create a string out of the words specified
    * @param {string}
    * @returns {array}
    */

  filter(aString) {
    if ((typeof aString) !== 'string') {
      return false;
    }

    const filtered = aString.replace(/[.,\/#!$£%\^&\*;:'{}=\-_`~()]/g, '')
      .toLowerCase();

    if (filtered.trim().length > 0) {
      return filtered.split(' ');
    } else {
      return false;
    }
  }


  /**
  * Method to merge two objects.
  * @param {object} {object}
  * @returns {object}
  */
  mergeObjects(dest, src) {
    if ((typeof dest !== 'object') || (typeof src !== 'object')) {
      return false;
    }
    const makeUnique = this.generateUniqueArray;
    Object.keys(src).forEach(function(key) {
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
    * @param {array}
    * @returns {array}
    */
  generateUniqueArray(thisArray) {
    if (!Array.isArray(thisArray)) {
      return false;
    }
    const uniqueArray = [];
    thisArray.forEach((value) => {
      let index = uniqueArray.indexOf(value);
      if (index === -1) {
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
    if (!Object.keys(this.indexes)[0]) {
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
    const docPosition = [];
    this.searchResult = {};
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
    } else {
      return false;
    }
  }
}
module.exports = InvertedIndex;
},{}]},{},[4]);
