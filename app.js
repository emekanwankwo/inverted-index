/**** Inverted Index Application to index, sort and search words in a string ******/


let indexApp = angular.module("invertedIndex", []);

indexApp.controller('rootAppController', ["$scope", function($scope) {

  let theIndex = new InvertedIndex();

  // Define a template Document for the Inverted Index Landing Page
  $scope.columns = ['Doc1', 'Doc2', 'Doc3', 'Doc5'];
  $scope.terms = ['No', 'Yes', 'Hi', 'Hello', 'This', 1, 5, 10, '23', 'Not'];

  let storeRowContent = [];
  let storeColumnContent = [];
  $scope.allContent = {};
  $scope.storyTitle = [];
  $scope.storyContent = [];
  $scope.count = 0;

  $scope.theIndex = 0;

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
   * Method to create index.
   * @Params {}
   * @Returns {}
   */

  $scope.createIndex = (fileName) => {

    // Ensure a valid file is selected and is has a '.json' extension
    let filepath = $.trim($('#filePath').val());
    let fileExt = filepath.substring(filepath.length - 5, filepath.length);

    if (filepath === "")
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
    })
      .then((data) => {
        let objectIndex = theIndex.createIndex(data);
        $scope.allContent = theIndex.mergeObjects($scope.allContent, objectIndex);
        getIndex($scope.allContent);
        $scope.storyTitle = theIndex.getStory().titles;
        $scope.storyContent = theIndex.getStory().stories;
        $scope.$apply();
      })
      .catch((err) => console.log(err));


      // // Check if a url address is entered to make an http get request to the selected JSON
      // let fileUrl = $.trim($('#filename').val());

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
    $scope.$apply();
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
  $scope.searchWord = (keyword) => {
    $scope.terms = [];
    let searchTerm = keyword.toLowerCase();
    $scope.terms.push(searchTerm);

    let searchQuery = theIndex.searchIndex(searchTerm);


    // @TODO Make the search statement to work only when an index has been created.

    $scope.exists = false;
    if ($.trim(keyword) === "") {
      $scope.terms = $scope.storeTerms;

      // @TODO Make the push statement to only push unique items.

      //   if ($scope.columns.length === storeColumnContent.length) { // If a search criteria is not specified and the search is empty, set the row of words to the entire array of words.
      //     $scope.uniqueWords = storeRowContent;
      //   } else { // If criteria is specified, use the words in that criteria title.
      //     $scope.uniqueWords = $scope.allContent[$scope.columns[0]];
      //   }
      //   $scope.status = '';
      // } else {
      //   if ($scope.columns.length === storeColumnContent.length) { // If a search criteria is not specified, set the row of words to the array of that criteria
      //     searchColumn = storeRowContent;
      //   } else {
      //     searchColumn = $scope.allContent[$scope.columns[0]];
      //   }

    // Change the status if found or not found
    // $scope.status = 'Not Found';
    // $scope.uniqueWords = [];
    // $scope.uniqueWords.push(keyword);
    // for (let item of searchColumn) {
    //   if (item == keyword) {
    //     $scope.status = 'Found';
    //     $scope.exists = true;
    //   }
    // }
    }

  }


  /**
   * Checks the searchKeyword and re-adjust column displayed
   * @Param {string}
   * @Return {}
   */
  $scope.changeCriteria = (searchKeyword) => {

    // if the keyword is 'all titles', restore the column and row to the stored content.
    if ((searchKeyword) === "All titles") {
      $scope.columns = storeColumnContent;
      $scope.uniqueWords = storeRowContent;
    } else {
      $scope.columns = [];
      $scope.uniqueWords = [];
      $scope.uniqueWords = generateUniqueArray($scope.allContent[searchKeyword]);
      $scope.columns.push(searchKeyword);
    }

  }
}])
