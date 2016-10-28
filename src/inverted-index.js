
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
  * @Returns {object}
	**/

  createIndex(data) {

    if(Object.keys(data).length <= 0) return false;

    let objectIndex = {};

    // Check if the data is a single json object(one content) and resolve
    if (!Array.isArray(data)) {
      let objectTitle = data[Object.keys(data)[0]],
        objectContent = data[Object.keys(data)[1]];

        if (Object.keys(data).length !== 2) return false;

      this.titles.push(objectTitle);
      this.stories.push(objectContent);

      let wordsInText = `${objectTitle} ${objectContent}`;
      wordsInText = this.generateUniqueArray(this.filterWord(wordsInText));

      for (let word of wordsInText){
        objectIndex[word] = [objectTitle];
      }
        
    } else {
      let dataLength = data.length;
      for (let i = 0; i < dataLength; i++) {
        let objectTitle = data[i][Object.keys(data[i])[0]],
          objectContent = data[i][Object.keys(data[i])[1]];

        if (Object.keys(data[i]).length !== 2) return false;

        this.titles.push(objectTitle);
        this.stories.push(objectContent);

        let wordsInText = `${objectTitle} ${objectContent}`;
        wordsInText = this.generateUniqueArray(this.filterWord(wordsInText));

        for (let word of wordsInText) {
          if (objectIndex[word]) objectIndex[word] = objectIndex[word].concat([objectTitle]);
          else objectIndex[word] = [objectTitle];
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

    if ((typeof word) !== 'string') return false;
    return word.replace(/[.,\/#!$£%\^&\*;:'{}=\-_`~()]/g, '').toLowerCase().split(' ');
  }


  /**
  * Method to merge two objects.
  * @Params {object} {object}
  * @Returns {object}
  */
  mergeObjects(dest, src) {
    if ((typeof dest !== 'object') || (typeof src !== 'object')) return false;
    let makeUnique = this.generateUniqueArray;
    Object.keys(src).forEach(function(key) {
      if (dest[key]) dest[key] = makeUnique(dest[key].concat(src[key]));
      else dest[key] = src[key];
    });
    return dest;
  }


  /**
    * Method to generate unique array items from the array specified.
    * @Params {array}
    * @Returns {array}
    */
  generateUniqueArray(data) {
    if (!Array.isArray(data)) return false;
    let uniqueArray = [];
    data.forEach((value) => {
      let index = uniqueArray.indexOf(value);
      if (index === -1) uniqueArray.push(value);
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
    if (Object.keys(data).length <= 0) return false;
    let terms = [];
    let columns = [];
    terms = Object.keys(data);
    for (let term of terms){
      columns = columns.concat(data[term]);
    }
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
    else return false;
  }
}
module.exports = InvertedIndex;