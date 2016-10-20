
/**** Inverted Index Application to index, sort and search words in a string ******/

class InvertedIndex {

  //TODO: Create a constructor to initialize variables

  /**
	* Creates an Index of the file at the path specified
	* @Params {string}
  * @Returns {}
	**/

  createIndex(data) {

    //@TODO keep files outside the spec so that it can be tested.

    let objectIndex = {};

    // Check if the data is a single json object(one content) and resolve
    if (!Array.isArray(data)) {
      let objectTitle = data[Object.keys(data)[0]],
        objectContent = data[Object.keys(data)[1]];

      let wordsInText = `${objectTitle} ${objectContent}`;
      wordsInText = this.generateUniqueArray(this.filterWord(wordsInText));

      for (let word of wordsInText) {
        try {
          objectIndex[word] = [objectTitle];
        } catch (e) {
          throw Error('Could not create index');
        }
      }
    } else {
      let dataLength = data.length;
      for (let i = 0; i < dataLength; i++) {
        let objectTitle = data[i][Object.keys(data[i])[0]],
          objectContent = data[i][Object.keys(data[i])[1]];

        let wordsInText = `${objectTitle} ${objectContent}`;
        wordsInText = this.generateUniqueArray(this.filterWord(wordsInText));

        for (let word of wordsInText) {
          try {
            if (objectIndex[word])
              objectIndex[word] = objectIndex[word].concat([objectTitle]);
            else
              objectIndex[word] = [objectTitle];
          } catch (e) {
            throw Error('Could not create index');
          }
        }
      }
    }
    return objectIndex;

    // let file = document.querySelector('input[type=file]').files[0];

    // if (!file)
    //   throw Error('No file selected');

    // let reader = new FileReader();
    // reader.readAsText(file);

    // // Make a promise to resolve the file if it is a JSON file with valid JSON content and reject otherwise
    // let promise = new Promise((resolve, reject) => {

    //   reader.onload = ((e) => {
    //     if (e.target.result)

    //       try {
    //         if (JSON.parse(e.target.result)) ;
    //         resolve(JSON.parse(e.target.result));
    //       } catch (e) {
    //         reject('File content is not of type JSON. Expected file structure is: [ { "content1" : "item1", "content2" : "item2"  } ]');
    //     }
    //     else
    //       reject('Invalid File Selected');
    //   })
    // });

  // console.log(promise instanceof Promise);
  // return promise;
  }


  /**
      * Method to filter out special characters and create a string out of the words specified
      * @Params {string}
      * @Returns {array}
      */

  filterWord(word) {
    return word.replace(/[.,\/#!$£%\^&\*;:'{}=\-_`~()]/g, "").toLowerCase().split(" ");
  }


  /**
  * Method to merge two objects.
  * @Params {object} {object}
  * @Returns {object}
  */
  mergeObjects(dest, src) {
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
    let uniqueArray = [];
    data.forEach((value) => {
      let index = uniqueArray.indexOf(value);
      if (index === -1)
        uniqueArray.push(value);
    });
    return uniqueArray;
  }


  /**
   * getRequest method to make http request to the server on the specified part
   * @Params {string}
   * @Returns
   */

  getRequest(url) {

    // Create a new XMLHttpRequest object
    let httpRequest = new XMLHttpRequest();

    // Make a promise to send the http get request
    let p1 = new Promise((resolve, reject) => {

      // Make sure the request object was created for modern browsers
      if (httpRequest) {
        httpRequest.onreadystatechange = alertContents;
        httpRequest.open('GET', url);
        httpRequest.send();
      } else {
        reject('Browser Not Supported');
      }

      // Method to handle the promise
      function alertContents() {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
          if (httpRequest.status === 200)
            resolve(JSON.parse(httpRequest.responseText));
          else
            reject('There was an error!');
        }
      }
    });

    return p1;
  }


  /**
   * getIndex Method to get the index of an element
   * @param {object}
   * @Returns {object}
   */

  getIndex(data) {
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

  searchIndex(terms) {}


  /** listArrayItems method to list contents of an array into strings
	 *	@Param {array} 
   *  @Returns {array}
	 */

  listArrayItems(data) {

    // Return the value if it is not an Array
    if (!Array.isArray(data))
      return data;

    //Make a recursive call back to the function if it is an array
    for (let item of data)
      wordListResult.push(this.listArrayItems(item));

    // Remove the undefined elements in the generated array.
    for (let word in wordListResult)
      if ( (typeof wordListResult[word] !== 'string') )
        wordListResult.splice(word, 1);

    return {
      'length': wordListResult.length,
      'words': wordListResult
    };
  }
}

let wordListResult = [];