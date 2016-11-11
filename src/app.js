/***Inverted Index Application to index, sort and search words in a string***/


const indexApp = angular.module('invertedIndex', []);

indexApp.controller('rootAppController', ['$scope', ($scope) => {

  const InvertedIndex = require('./inverted-index');
  const invertedIndex = new InvertedIndex();

  // Define a template Document for the Inverted Index Landing Page
  $scope.columns = [];
  $scope.terms = [];
  $scope.allContent = {};
  $scope.storyTitle = [];
  $scope.storyContent = [];
  $scope.storyIndex = 0;
  $scope.bookNames = [];
  $scope.books = {};
  $scope.fileSelected = true;


  /**
   * Method to create index.
   * @Param {string}
   * @returns {}
   */

  $scope.uploadFile = (url) => {

    const uploadedFile = document.getElementById('filePath').files[0];

    if ((!uploadedFile) && ($.trim(url) === '')) {
      $scope.selectEmptyMsg = true;
      return false;
    }

    $scope.selectEmptyMsg = false;
    if (!uploadedFile && ($.trim(url) !== '')) {
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
        resolveData(response, url);
      })
        .catch((err) => {
          showErr(err);
        });
    } else {
      // Ensure a valid file is selected and is has a '.json' extension
      const fileExt = uploadedFile.name
        .substring(uploadedFile.name.length - 5, uploadedFile.name.length);

      if ((fileExt !== '.json') && (fileExt !== '.JSON') && ($.trim(url) === '')) {
        showErr('Please select a valid json file');
        return false;
      }
      const reader = new FileReader();
      reader.readAsText(uploadedFile);

      const promise = new Promise((resolve, reject) => {
        reader.onload = ((e) => {
          if (e.target.result) {
            try {
              if (JSON.parse(e.target.result)) {
                resolve(JSON.parse(e.target.result));
              }
            } catch (e) {
              reject('Invalid JSON file');
            }
          } else {
            reject('Invalid File Selected');
          }
        });
      });

      promise.then((response) => {
        resolveData(response, uploadedFile.name);
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
  resolveData = (responseData, responseDataName) => {
    document.getElementById('uploadJsonForm').reset();
    if (Object.keys(responseData).length <= 0) {
      showErr('error! cannot upload empty file');
      return false;
    }
    if (!Array.isArray(responseData)) {
      if (Object.keys(responseData).length !== 2) {
        showErr('error! file must have only title and content keys');
        return false;
      }
    } else {
      const bookLength = responseData.length;
      for (let i = 0; i < bookLength; i++) {
        if (Object.keys(responseData[i]).length !== 2) {
          showErr('error! each file must have only title and content keys');
          return false;
        }
      }
    }
    $scope.books[responseDataName] = responseData;
    $scope.bookNames = Object.keys($scope.books);
    $scope.numberOfTitles = responseData.length;
    $scope.validBook = true;
    $scope.$apply();
  };

  $scope.setBook = (name) => {
    $('.list-group-item').not(':first').css('background-color', 'white');
    document.getElementById(name).style.backgroundColor = 'lightgray';
    $scope.fileToRead = name;
  };

  $scope.createIndex = () => {
    if (!$scope.fileToRead) {
      $scope.fileSelected = false;
      return false;
    }
    $scope.fileSelected = true;
    const filename = $scope.fileToRead;
    const thisBook = $scope.books[filename];
    const bookIndex = invertedIndex.createIndex(thisBook);

    if (!bookIndex) {
      // Delete the object from the books object.
      delete $scope.books[filename];
      $scope.bookNames.splice($scope.bookNames.indexOf(filename), 1);
      showErr('Error! ensure your json file has a title key and a content key');
      return false;
    }

    $scope.storyTitle = invertedIndex.getStory().titles;
    $scope.storyContent = invertedIndex.getStory().stories;
    $scope.getIndex();
  };

  /**
   * Method to get the index of the object
   * @param {object}
   * @returns {}
   */
  $scope.getIndex = () => {
    const wordsIndex = invertedIndex.getIndex();
    if (!wordsIndex) {
      showErr('Error! no file uploaded!');
      return false;
    }
    $scope.allContent = invertedIndex.mergeObjects($scope.allContent, wordsIndex);
    $scope.terms = Object.keys(wordsIndex);
    $scope.storeTerms = $scope.terms;
    for (let term of $scope.terms) {
      $scope.columns = $scope.columns.concat(wordsIndex[term]);
    }
    $scope.columns = invertedIndex.generateUniqueArray($scope.columns);
    $scope.storeColumns = $scope.columns;
  };


  /**
   * Method to change the story being displayed when user clicks next button
   * @params {}
   * @returns {}
   */

  $scope.changeStory = (currentStoryIndex) => {
    $scope.storyIndex = currentStoryIndex;
  };

  $scope.nextPrev = function(value) {
    if (value === 'next') {
      if ($scope.storyIndex === $scope.storyTitle.length - 1) {
        return false;
      }
      $scope.storyIndex++;
    } else {
      if ($scope.storyIndex === 0) {
        return false;
      }
      $scope.storyIndex--;
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

    $scope.terms = invertedIndex.generateUniqueArray(searchTerm.split(' '));

    let i = searchTerm.split(' ').length; //get the length of the search field and set the searchterm to the last item.
    searchTerm = searchTerm.split(' ')[i - 1];

    const searchQuery = invertedIndex.searchIndex(searchTerm, criteria);
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
  $scope.changeCriteria = (searchKeyword) => (
  (searchKeyword) === null ? ($scope.columns = $scope.storeColumns) :
    `${$scope.columns = []} ${$scope.columns.push(searchKeyword)}`);

}]);
