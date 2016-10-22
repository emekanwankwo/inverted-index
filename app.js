/**** Inverted Index Application to index, sort and search words in a string ******/


let indexApp = angular.module('invertedIndex', []);

indexApp.controller('rootAppController', ['$scope', ($scope) => {

  let InvertedIndex = require('./inverted-index');
  let theIndex = new InvertedIndex();

  // Define a template Document for the Inverted Index Landing Page
  $scope.columns = ['Doc1', 'Doc2', 'Doc3', 'Doc5'];
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

    if ($.trim(url) !== '') {
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
              reject('There was an error!');
          }
        }
      });

      promise.then((data) => {
        resolveData(data);
      })
        .catch((err) => {
          throw Error(err);
        });
    }

    // Ensure a valid file is selected and is has a '.json' extension
    let filepath = $.trim($('#filePath').val());
    let fileExt = filepath.substring(filepath.length - 5, filepath.length);

    if (filepath === '')
      throw Error('No file Selected!');

    if ((fileExt !== '.json') && (fileExt !== '.JSON'))
      throw Error('File type must be type JSON');

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
            reject('File content is not of type JSON. Expected file structure is: [ { "content1" : "item1", "content2" : "item2"  } ]');
        }
        else
          reject('Invalid File Selected');
      });
    });
    promise.then((data) => {
      resolveData(data);
    })
      .catch((err) => console.log(err));

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
  $scope.changeStory = () => {
    if ($scope.storyTitle.length === 0)
      return false;
    if ($scope.theIndex === $scope.storyTitle.length - 1)
      $scope.theIndex = 0;
    else
      $scope.theIndex += 1;
  };


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
      else
        throw Error('Not found!');
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
    $scope.terms = [];

    try {
      $scope.terms = theIndex.generateUniqueArray(searchTerm.split(' '));
    } catch (e) {
      console.log('Duplicates detected');
    }

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
      $scope.terms = $scope.storeTerms;
    }
  };


  /**
   * Checks the searchKeyword and re-adjust column displayed
   * @Param {string}
   * @Return {}
   */
  $scope.changeCriteria = (searchKeyword) => {

    // if the keyword is 'all titles', restore the column and row to the stored content.
    if ((searchKeyword) === 'All titles')
      $scope.columns = $scope.storeColumns;
    else {
      $scope.columns = [];
      $scope.columns.push(searchKeyword);
    }
  };
}]);
