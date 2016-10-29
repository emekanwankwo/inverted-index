/**** Inverted Index Application to index, sort and search words in a string ******/


let indexApp = angular.module('invertedIndex', []);

indexApp.controller('rootAppController', ['$scope', ($scope) => {

  let InvertedIndex = require('./inverted-index');
  let theIndex = new InvertedIndex();

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

    let thefile = document.getElementById('filePath').files[0];

    if ((!thefile) && ($.trim(url) === '')) {
      $('#selectEmptyMsg').show();
      return false;
    }

    $('#selectEmptyMsg').hide();
    if ((thefile.name === '') && ($.trim(url) !== '')) {
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
            if (httpRequest.status === 200) {
              resolve(JSON.parse(httpRequest.responseText));
            }
            else {
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
      let fileExt = thefile.name.substring(thefile.name.length - 5, thefile.name.length);

      if ((fileExt !== '.json') && (fileExt !== '.JSON') && ($.trim(url) === '')){
        showErr('Please select a valid json file');
        return false;
      }
      let reader = new FileReader();
      reader.readAsText(thefile);

      let promise = new Promise((resolve, reject) => {

        reader.onload = ((e) => {
          if (e.target.result) {
            try {
              if (JSON.parse(e.target.result)) {
                resolve(JSON.parse(e.target.result));
              }
            } catch (e) {
              reject('Invalid JSON file. Expected:{ "title" : "item", "content" : "item"  }');
            }
          }
          else{
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
    }, 8000);
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
    let objectIndex = theIndex.createIndex(jsonData);
    if (!objectIndex) {
      showErr('Error! ensure your json file has a title key and a content key');
      return false;
    }
    $scope.storyTitle = theIndex.getStory().titles;
    $scope.storyContent = theIndex.getStory().stories;
    $scope.$apply();
  };


  /**
   * Method to get the index of the object
   * @param {object}
   * @returns {}
   */
  $scope.getIndex = () => {
    let wordsIndex = theIndex.getIndex();
    if(!wordsIndex){
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

      //@TODO create method to move to the next/previous index.

      // if ($scope.storyTitle.length === 0){
      //   return false;
      // } else{
      //   if ($scope.theIndex === $scope.storyTitle.length - 1){
      //     $scope.theIndex = 0; 
      //   } else {
      //     $scope.theIndex += 1;
      //   }
      // }
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
      if ($scope.allContent[word].indexOf(columnIndex) !== -1){
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
   * @param {string}
   * @returns {}
   */
  $scope.changeCriteria = (searchKeyword) => ((searchKeyword) === null ? ($scope.columns = $scope.storeColumns) : `${$scope.columns = []} ${$scope.columns.push(searchKeyword)}`);

}]);
