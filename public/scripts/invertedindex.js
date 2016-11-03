/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/**** Inverted Index Application to index, sort and search words in a string ******/


	const indexApp = angular.module('invertedIndex', []);

	indexApp.controller('rootAppController', ['$scope', ($scope) => {

	  const InvertedIndex = __webpack_require__(2);
	  const theIndex = new InvertedIndex();

	  // Define a template Document for the Inverted Index Landing Page
	  $scope.columns = [];
	  $scope.terms = [];

	  $scope.allContent = {};
	  $scope.storyTitle = [];
	  $scope.storyContent = [];
	  $scope.theIndex = 0;


	  /**
	   * Method to create index.
	   * @Param {string}
	   * @returns {}
	   */

	  $scope.createIndex = (url) => {

	    const thefile = document.getElementById('filePath').files[0];

	    if ((!thefile) && ($.trim(url) === '')) {
	      $('#selectEmptyMsg').show();
	      return false;
	    }

	    $('#selectEmptyMsg').hide();
	    if (!thefile && ($.trim(url) !== '')) {
	      const httpRequest = new XMLHttpRequest();

	      // Make a promise to send the http get request
	      const promise = new Promise((resolve, reject) => {

	        // Make sure the request object was created for modern browsers
	        if (httpRequest) {
	          httpRequest.onreadystatechange = alertContents;
	          httpRequest.open('GET', url);
	          httpRequest.send();
	        } else {
	          reject('Browser Not Supported');
	        }

	        // function to handle the promise
	        function alertContents() {
	          if (httpRequest.readyState === XMLHttpRequest.DONE) {
	            if (httpRequest.status === 200) {
	              resolve(JSON.parse(httpRequest.responseText));
	            } else {
	              reject('There was an error resolving url');
	            }
	          }
	        }
	      });

	      promise.then((response) => {
	        resolveData(response);
	      })
	        .catch((err) => {
	          showErr(err);
	        });
	    } else {
	      // Ensure a valid file is selected and is has a '.json' extension
	      const fileExt = thefile.name.substring(thefile.name.length - 5, thefile.name.length);

	      if ((fileExt !== '.json') && (fileExt !== '.JSON') && ($.trim(url) === '')) {
	        showErr('Please select a valid json file');
	        return false;
	      }
	      const reader = new FileReader();
	      reader.readAsText(thefile);

	      const promise = new Promise((resolve, reject) => {
	        reader.onload = ((e) => {
	          if (e.target.result) {
	            try {
	              if (JSON.parse(e.target.result)) {
	                resolve(JSON.parse(e.target.result));
	              }
	            } catch (e) {
	              reject('Invalid JSON file. Expected:{ "title" : "item", "content" : "item"  }');
	            }
	          } else {
	            reject('Invalid File Selected');
	          }
	        });
	      });
	      promise.then((response) => {
	        resolveData(response);
	      })
	        .catch((err) => {
	          showErr(err);
	        });
	    }
	  };


	  /**
	   * function to display error for 8 seconds
	   * @param {string} error message
	   */

	  showErr = (errMsg) => {
	    setTimeout(() => {
	      $scope.errExist = false;
	      $scope.errMsg = '';
	      $scope.$apply();
	    }, 5000);
	    $scope.errMsg = errMsg;
	    $scope.errExist = true;
	    $scope.$apply();
	    return false;
	  };


	  /**
	   *  Method to resolve response from the Inverted index function
	   *  @param {object}
	   *  @returns {}
	   */
	  resolveData = (jsonData) => {
	    const objectIndex = theIndex.createIndex(jsonData);
	    if (!objectIndex) {
	      showErr('Error! ensure your json file has a title key and a content key');
	      return false;
	    } else {
	      $scope.storyTitle = theIndex.getStory().titles;
	      $scope.storyContent = theIndex.getStory().stories;
	      $scope.$apply();
	    }
	  };


	  /**
	   * Method to get the index of the object
	   * @param {object}
	   * @returns {}
	   */
	  $scope.getIndex = () => {
	    const wordsIndex = theIndex.getIndex();
	    if (!wordsIndex) {
	      showErr('Error! no file uploaded!');
	      return false;
	    }
	    $scope.allContent = theIndex.mergeObjects($scope.allContent, wordsIndex);
	    $scope.terms = Object.keys(wordsIndex);
	    $scope.storeTerms = $scope.terms;
	    for (let term of $scope.terms) {
	      $scope.columns = $scope.columns.concat(wordsIndex[term]);
	    }
	    $scope.columns = theIndex.generateUniqueArray($scope.columns);
	    $scope.storeColumns = $scope.columns;
	  };


	  /**
	   * Method to change the story being displayed when user clicks next button
	   * @params {}
	   * @returns {}
	   */

	  $scope.changeStory = (currentStoryIndex) => {
	    $scope.theIndex = currentStoryIndex;
	  };

	  $scope.nextPrev = function(value) {
	    if (value === 'next') {
	      if ($scope.theIndex === $scope.storyTitle.length - 1) {
	        return false;
	      }
	      $scope.theIndex++;
	    } else {
	      if ($scope.theIndex === 0) {
	        return false;
	      }
	      $scope.theIndex--;
	    }
	  };



	  /**
	   * Method to compare the selected word in the array of words and check the
	   * story title column where it belongs
	   * @param {string} {integer}
	   * @returns {}
	   */
	  $scope.checkThis = (word, columnIndex) => {
	    $scope.count = 0;
	    try {
	      if ($scope.allContent[word].indexOf(columnIndex) !== -1) {
	        $scope.count += 1;
	      }
	    } catch (e) {
	      // Fail silently
	    }
	  };


	  /**
	   * Method to search for a given keyword
	   * @param {string : number}
	   * @returns {}
	   */
	  $scope.searchWord = (keyword, criteria) => {
	    $scope.searchState = false;
	    if (Object.keys($scope.allContent).length === 0) {
	      return false;
	    }

	    let searchTerm = keyword.toLowerCase();

	    $scope.terms = theIndex.generateUniqueArray(searchTerm.split(' '));

	    let i = searchTerm.split(' ').length; //get the length of the search field and set the searchterm to the last item.
	    searchTerm = searchTerm.split(' ')[i - 1];

	    const searchQuery = theIndex.searchIndex(searchTerm, criteria);
	    if (searchQuery) {
	      $scope.status = 'Found';
	      $scope.searchState = true;
	    } else {
	      $scope.status = 'Not Found';
	    }

	    $scope.exists = false;
	    if ($.trim(keyword) === '') {
	      $scope.status = '';
	      $scope.terms = $scope.storeTerms;
	    }
	  };


	  /**
	   * Checks the searchKeyword and re-adjust column displayed
	   * @param {string}
	   * @returns {}
	   */
	  $scope.changeCriteria = (searchKeyword) => ((searchKeyword) === null ? ($scope.columns = $scope.storeColumns) : `${$scope.columns = []} ${$scope.columns.push(searchKeyword)}`);

	}]);


/***/ },
/* 2 */
/***/ function(module, exports) {

	
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

	    const objectIndex = {};

	    if (Object.keys(thisObject).length <= 0) {
	      return false;
	    }

	    // Check if the data is a single json object(one content) and resolve
	    if (!Array.isArray(thisObject)) {
	      if (Object.keys(thisObject).length !== 2) {
	        return false;
	      }

	      const objectTitle = thisObject[Object.keys(thisObject)[0]],
	        objectContent = thisObject[Object.keys(thisObject)[1]];

	      if (objectTitle.trim().length === 0 || objectContent.trim().length === 0) {
	        return false;
	      }

	      let wordsInText = `${objectTitle} ${objectContent}`;

	      wordsInText = this.generateUniqueArray(this.filter(wordsInText));
	      if (wordsInText) {
	        this.titles.push(objectTitle);
	        this.stories.push(objectContent);
	        for (let word of wordsInText) {
	          objectIndex[word] = [objectTitle];
	        }
	      } else {
	        return false;
	      }
	    } else {
	      const dataLength = thisObject.length;
	      for (let i = 0; i < dataLength; i++) {
	        if (Object.keys(thisObject[i]).length !== 2) {
	          return false;
	        }
	        const objectTitle = thisObject[i][Object.keys(thisObject[i])[0]],
	          objectContent = thisObject[i][Object.keys(thisObject[i])[1]];

	        if (objectTitle.trim().length === 0 || objectContent.trim().length === 0) {
	          return false;
	        }

	        let wordsInText = `${objectTitle} ${objectContent}`;
	        wordsInText = this.generateUniqueArray(this.filter(wordsInText));
	        if (wordsInText) {
	          this.titles.push(objectTitle);
	          this.stories.push(objectContent);
	          for (let word of wordsInText) {
	            if (objectIndex[word]) {
	              objectIndex[word] = objectIndex[word].concat([objectTitle]);
	            } else {
	              objectIndex[word] = [objectTitle];
	            }
	          }
	        } else {
	          return false;
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

	    if ((typeof aString) !== 'string') {
	      return false;
	    }

	    const filtered = aString.replace(/[.,\/#!$£%\^&\*;:'{}=\-_`~()]/g, '').toLowerCase();

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

/***/ }
/******/ ]);