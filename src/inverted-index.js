
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
    this.indexes = InvertedIndex.mergeObjects(this.indexes, this.bookIndex);
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
    wordsInText = InvertedIndex.generateUniqueArray(InvertedIndex.filter(wordsInText));
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
  static filter(words) {
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
  * @param {object} input1 destination object to be merged into
  * @param {object} input2 source object to merge into input1.
  * @returns {object} merged object containing the two object arguments.
  */
  static mergeObjects(input1, input2) {
    if ((typeof input1 !== 'object') || (typeof input2 !== 'object')) {
      return false;
    }
    const makeUnique = InvertedIndex.generateUniqueArray;
    Object.keys(input2).forEach((key) => {
      if (input1[key]) {
        input1[key] = makeUnique(input1[key].concat(input2[key]));
      } else {
        input1[key] = input2[key];
      }
    });
    return input1;
  }


  /**
    * Method to generate unique array items from the array specified.
    * @param {array} item an array item.
    * @returns {array} array of unique words
    */
  static generateUniqueArray(item) {
    if (!Array.isArray(item)) {
      return false;
    }
    const uniqueArray = [];
    item.forEach((value) => {
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
      titles: InvertedIndex.generateUniqueArray(this.titles),
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
