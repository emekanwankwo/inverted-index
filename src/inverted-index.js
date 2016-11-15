
/** *Inverted Index Application to index, sort and search words in a string***/

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
      this.bookIndex = {};
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
      for (const word of wordsInText) {
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

  filter(words) {
    if ((typeof words) !== 'string') {
      return false;
    }

    const filtered = words.replace(/[.,\/#!$£%\^&\*;:'{}=\-_`~()]/g, '')
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
    * @param {array}
    * @returns {array}
    */
  generateUniqueArray(thisArray) {
    if (!Array.isArray(thisArray)) {
      return false;
    }
    const uniqueArray = [];
    thisArray.forEach((value) => {
      const index = uniqueArray.indexOf(value);
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
      stories: this.stories,
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
        for (const title of this.indexes[term]) {
          docPosition.push(this.titles.indexOf(title));
        }
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
