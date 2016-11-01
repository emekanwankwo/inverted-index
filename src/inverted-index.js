
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

      const objectTitle = thisObject[Object.keys(thisObject)[0]],
        objectContent = thisObject[Object.keys(thisObject)[1]];  

      this.titles.push(objectTitle);
      this.stories.push(objectContent);

      let wordsInText = `${objectTitle} ${objectContent}`;
      wordsInText = this.generateUniqueArray(this.filter(wordsInText));

      if(wordsInText) {
        for (let word of wordsInText) {
          objectIndex[word] = [objectTitle];
        }
      }
    } else {
      const dataLength = thisObject.length;
      for (let i = 0; i < dataLength; i++) {
        if (Object.keys(thisObject[i]).length !== 2){
          return false;
        }
        const objectTitle = thisObject[i][Object.keys(thisObject[i])[0]],
          objectContent = thisObject[i][Object.keys(thisObject[i])[1]];

        this.titles.push(objectTitle);
        this.stories.push(objectContent);

        let wordsInText = `${objectTitle} ${objectContent}`;
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
    const makeUnique = this.generateUniqueArray;
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
    const uniqueArray = [];
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
    }
    else{
      return false;
    }
  }
}
module.exports = InvertedIndex;