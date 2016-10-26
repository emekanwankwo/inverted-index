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


	let indexApp = angular.module('invertedIndex', []);

	indexApp.controller('rootAppController', ['$scope', ($scope) => {

	  let InvertedIndex = __webpack_require__(2);
	  let theIndex = new InvertedIndex();

	  // Define a template Document for the Inverted Index Landing Page
	  $scope.columns = ['Doc1', 'Doc2', 'Doc3', 'Doc4'];
	  $scope.terms = ['No', 'Yes', 'Hi', 'Hello', 'This', 1, 5, 10, '23', 'Not'];

	  $scope.allContent = {};
	  $scope.storyTitle = [];
	  $scope.storyContent = [];
	  $scope.theIndex = 0;


	  /**
	   * Method to create index.
	   * @Params {}
	   * @Returns {}
	   */

	  $scope.createIndex = (url) => {

	    let filepath = $.trim($('#filePath').val());
	    if ((filepath === '') && ($.trim(url) !== '')) {
	      let httpRequest = new XMLHttpRequest();

	      // Make a promise to send the http get request
	      let promise = new Promise((resolve, reject) => {

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
	            if (httpRequest.status === 200)
	              resolve(JSON.parse(httpRequest.responseText));
	            else
	              reject('There was an error resolving url');
	          }
	        }
	      });

	      promise.then((data) => {
	         resolveData(data);
	      })
	        .catch((err) => {
	          showErr(err);
	        });
	    } else {

	    // Ensure a valid file is selected and is has a '.json' extension
	    let fileExt = filepath.substring(filepath.length - 5, filepath.length);

	    if ((filepath === '') && ($.trim(url) === '')){
	      showErr('No url specified or file Selected!');
	      return false;
	    }
	    if ((fileExt !== '.json') && (fileExt !== '.JSON') && ($.trim(url) === '')){
	      showErr('File type must be type JSON');
	      return false;
	    }

	    let thefile = document.getElementById('filePath').files[0];
	    let reader = new FileReader();
	    reader.readAsText(thefile);

	    let promise = new Promise((resolve, reject) => {

	      reader.onload = ((e) => {
	        if (e.target.result)
	          try {
	            if (JSON.parse(e.target.result)) ;
	            resolve(JSON.parse(e.target.result));
	          } catch (e) {
	            reject('Invalid JSON file. Expected:{ "title" : "item", "content" : "item"  }');
	        }
	        else
	          reject('Invalid File Selected');
	      });
	    });
	    promise.then((data) => {
	       resolveData(data); 
	    })
	      .catch((err) => {
	        showErr(err);
	      });
	    }
	  };


	/**
	 * function to display error for 8 seconds
	 * @Param{string} error message
	 */

	  showErr = (errMsg) => {
	    setTimeout(() => {
	    $scope.errExist = false;
	    $scope.errMsg = '';
	    $scope.$apply();
	    }, 8000);
	      $scope.errMsg = errMsg; 
	      $scope.errExist = true;
	      $scope.$apply();
	  };


	  /**
	   *  Method to resolve response from the Inverted index function
	   *  @Param {object}
	   *  @Returns {}
	   */
	  resolveData = (data) => {
	    let objectIndex = theIndex.createIndex(data);
	    $scope.allContent = theIndex.mergeObjects($scope.allContent, objectIndex);
	    getIndex($scope.allContent);
	    $scope.storyTitle = theIndex.getStory().titles;
	    $scope.storyContent = theIndex.getStory().stories;
	    $scope.$apply();
	  };


	  /**
	   * Method to get the index of the object
	   * @Param {object}
	   * @Returns {}
	   */
	  getIndex = (data) => {
	    let wordsIndex = theIndex.getIndex(data);
	    $scope.columns = (wordsIndex.titles);
	    $scope.terms = (wordsIndex.words);
	    $scope.storeTerms = (wordsIndex.words);
	    $scope.storeColumns = (wordsIndex.titles);
	    $scope.$apply();
	  };


	  /**
	   * Method to change the story being displayed when user clicks next button
	   * @Params {}
	   * @Returns {}
	   */
	  $scope.changeStory = () => ($scope.storyTitle.length === 0) ? false : ($scope.theIndex === $scope.storyTitle.length - 1) ? $scope.theIndex = 0 : $scope.theIndex += 1;



	  /**
	   * Method to compare the selected word in the array of words and check the
	   * story title column where it belongs
	   * @Param {string} {integer}
	   * @Return {}
	   */
	  $scope.checkThis = (word, columnIndex) => {
	    $scope.count = 0;
	    try {
	      if ($scope.allContent[word].indexOf(columnIndex) !== -1)
	        $scope.count += 1;
	    } catch (e) {
	      // Fail silently
	    }
	  };


	  /**
	   * Method to search for a given keyword
	   * @Param {string : number}
	   * @Return {}
	   */
	  $scope.searchWord = (keyword, criteria) => {
	    $scope.searchState = false;
	    if (Object.keys($scope.allContent).length === 0)
	      return false;

	    let searchTerm = keyword.toLowerCase();
	    // $scope.terms = [];

	    $scope.terms = theIndex.generateUniqueArray(searchTerm.split(' '));

	    let i = searchTerm.split(' ').length; //get the length of the search field and set the searchterm to the last item.
	    searchTerm = searchTerm.split(' ')[i - 1];

	    let searchQuery = theIndex.searchIndex(searchTerm, criteria);
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
	   * @Param {string}
	   * @Return {}
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

	      this.titles.push(objectTitle);
	      this.stories.push(objectContent);

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

	        this.titles.push(objectTitle);
	        this.stories.push(objectContent);

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
	        }
	        return this.searchResult;
	      }
	    }
	    else
	      return false;
	  }
	}
	module.exports = InvertedIndex;

/***/ }
/******/ ]);