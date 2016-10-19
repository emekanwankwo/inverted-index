/**** Inverted Index Application to index, sort and search words in a string ******/


let indexApp = angular.module("root", []);


// Define a controller 'rootAppController' for the root module

indexApp.controller('rootAppController', ["$scope", function ($scope) {

	let theIndex = new InvertedIndex();

	// Define a template Document for the Inverted Index Landing Page
	$scope.columns = ['Doc1', 'Doc2', 'Doc3', 'Doc5'];
	$scope.rows = ['No', 'Yes', 'No', 'Hi', 'Hello', 'This', 1, 5, 10, '23', 'Yes', 'No', 'Not'];

	let storeRowContent = [];									// Define an array to store row content
	let storeColumnContent = [];								// Define an array to store column content
	$scope.allContent = {};										// Define an object to hold all book titles and associated array of texts. Defined outside the getTheBook scope for data persistence.
	$scope.storyTitle = [];										// Define an array to hold all the story titles		
	$scope.storyContent = [];									// Define an array to hold all story contents
	$scope.count = 0;

	$scope.theIndex = 0;

	/**
	 * Method to change the story being displayed by changing the index value
	 * @Params {}
	 * @Returns {}
	 */
	$scope.changeStory = function () {
		if ($scope.storyTitle.length == 0)
			return false;
		if ($scope.theIndex == $scope.storyTitle.length - 1)
			$scope.theIndex = 0;
		else
			$scope.theIndex += 1;
	}

	$scope.uniqueWords = [];
	$scope.uniqueWords = generateUniqueArray($scope.rows);

	let wordListResult = [];


	/**
	 * Method to generate unique array items from the array given
	 * @Params {array}
	 * @Returns {array}
	 */

	function generateUniqueArray(data) {
		let uniqueArray = [];
		angular.forEach(data, (value) => {
			let index = uniqueArray.indexOf(value);
			if (index === -1)
				uniqueArray.push(value);
		})
		return uniqueArray;
	}


	/**
	 * Method to get the array of words by calling the InvertedIndex class
	 * @Params {}
	 * @Returns {}
	 */
	$scope.getTheBook = function () {

		// Check if a url address is entered to make an http get request to the selected JSON
		let fileUrl = $.trim($('#filename').val());

		if (fileUrl !== "") {

			$scope.columns = [];
			$scope.rows = [];
			$scope.uniqueWords = [];

			let theUrlArray = new Promise((resolve, reject) => { resolve(theIndex.getRequest(fileUrl)); });

			// Set a timeout for the promise to be fufilled	
			setTimeout(() => {
				theUrlArray.then((data) => {
					pushValue(data);
				});
			}, 0);

		} else {

			// Ensure a valid file is selected and is has a '.json' extension
			let filepath = $.trim($('#filePath').val());
			let fileExt = filepath.substring(filepath.length - 5, filepath.length);

			if (filepath == "")
				throw Error('No file Selected!')

			if ((fileExt !== '.json') && (fileExt !== '.JSON'))
				throw Error('File type must be type JSON');


			// Empty the contents of the template data initially set.
			$scope.columns = [];
			$scope.rows = [];
			$scope.uniqueWords = [];

			// Make a promise to call the createIndex method of the InvertedIndex class
			let theArray = new Promise((resolve, reject) => { resolve(theIndex.createIndex()); });

			// Set a timeout for the promise to be fufilled	
			setTimeout(() => {
				theArray.then((data) => {
					pushValue(data);
				});
			}, 0);

		}

	}


	/**
	 * Method that splits the content of a multi-dimensional array by calling the listArrayItems method
	 * of the InvertedIndex class.
	 * @Params {Array}
	 * @Returns {}
	 */
	function pushValue(data) {
		// Check if the data is a single json object(one content) and resolve
		if (!Array.isArray(data)) {
			let objectTitle = data[Object.keys(data)[0]];
			let objectTitleArray = data[Object.keys(data)[0]].split(' ');
			let objectContentArray = data[Object.keys(data)[1]].split(' ');
			let objectArray = objectTitleArray.concat(objectContentArray);
			objectArray = generateUniqueArray(objectArray);

			try {
				if (!$scope.allContent[objectTitle]) {
					$scope.allContent[objectTitle] = objectArray;
					$scope.$apply();
				} else {
					throw Error('Name conflicts detected!');
				}
			} catch (e) {
				console.log(e);
			}


		} else {
			for (let i = 0; i < data.length; i++) {
				let objectTitle = data[i][Object.keys(data[i])[0]];							// Get the first item of each array as title
				let objectTitleArray = data[i][Object.keys(data[i])[0]].split(' ');			// Convert the title to an array
				let objectContentArray = data[i][Object.keys(data[i])[1]].split(' ');		// Convert the content to an array
				let objectArray = objectTitleArray.concat(objectContentArray);				// Concat the title and content arrays
				objectArray = generateUniqueArray(objectArray);

				try {
					if (!$scope.allContent[objectTitle]) {
						$scope.allContent[objectTitle] = objectArray;						// Set the title of the text as the key of the word array content.		
						$scope.$apply();
					} else {
						throw Error('Name conflicts detected!');
					}
				} catch (e) {
					console.log(e);
				}
			}

		}

		let titlesArray = [];
		let titlesItem = [];

		for (let i = 0; i < data.length; i++) {
			$scope.storyTitle.push(data[i][Object.keys(data[i])[0]]);						// Push the first content of each of the objects to the storyTitle array
			$scope.storyContent.push(data[i][Object.keys(data[i])[1]]);						// Push the second content of each of the objects to the storyContent array
		}

		// Assign the empty title column template to the unique keys of the allContent object. 
		$scope.columns = generateUniqueArray(Object.keys($scope.allContent));
		storeColumnContent = generateUniqueArray(Object.keys($scope.allContent));

		let wordList = [];


		// Try to resolve the contents of the JSON as multi-dimensional
		try {
			for (let book of data)
				for (let attribute in book)
					wordList.push(book[attribute].split(' '));
		}
		catch (e) {
			// If the error is an instance of 'TypeError', try to resolve the array as a single JSON
			if (e instanceof TypeError) {
				try {
					for (let singleBook in data) {
						wordList.push(data[singleBook].split(' '));
					}

					// Push the single items as the story title and content
					$scope.storyTitle.push(data[Object.keys(data)[0]]);
					$scope.storyContent.push(data[Object.keys(data)[1]]);
				}
				catch (e) {
					//final catch statement goes here
					throw Error('Cannot read file content')
				}

			}
		}

		let word = theIndex.listArrayItems(wordList);
		let wordsItem = word.words;

		// Generate a unique array of items from the contents of the new array
		$scope.uniqueWords = generateUniqueArray(wordsItem);
		storeRowContent = $scope.uniqueWords;

		$scope.$apply();
	}

	$scope.columnCount = 0;


	/**
	 * Method to compare the selected word in the array of words and check the
	 * story title column where it belongs
	 * @Param {string} {integer}
	 * @Return {}
	 */
	$scope.checkThis = function (word, columnIndex) {
		columnIndex = storeColumnContent.indexOf(columnIndex);

		// console.log(columnIndex);
		$scope.count = 0;														// Initialize a count variable to restart from 0 anytime the function is called.
		for (let title of $scope.storyTitle) {									// Get each of the titles in the storyTitle array
			$scope.columnCount = $scope.storyTitle.indexOf(title);				// Set the column number as the index of 'this' title
			if ($scope.columnCount == columnIndex) {							// If 'this' column number is the same as the index of the current ng-repeat column
				for (let theContent of $scope.allContent[title])				// Get the array of words represented by this Index
					if (theContent == word)										// If the content is equal to the word listed, then the word exists.
						$scope.count += 1;

			}
		}

	}


	/**
	 * Method to search for a given keyword
	 * @Param {string : number}
	 * @Return {}
	 */
	$scope.searchWord = function (keyword) {
		
		// @TODO Make the search statement to work only when an index has been created.

		$scope.exists = false;
		if ($.trim(keyword) === "") {

			// @TODO Make the push statement to only push unique items.

			if ($scope.columns.length === storeColumnContent.length) {			// If a search criteria is not specified and the search is empty, set the row of words to the entire array of words.
				$scope.uniqueWords = storeRowContent;
			} else {															// If criteria is specified, use the words in that criteria title.
				$scope.uniqueWords = $scope.allContent[$scope.columns[0]];
			}
			$scope.status = '';
		}

		else {
			if ($scope.columns.length === storeColumnContent.length) {			// If a search criteria is not specified, set the row of words to the array of that criteria
				searchColumn = storeRowContent;
			} else {
				searchColumn = $scope.allContent[$scope.columns[0]];
			}

			// Change the status if found or not found
			$scope.status = 'Not Found';
			$scope.uniqueWords = [];
			$scope.uniqueWords.push(keyword);
			for (let item of searchColumn) {
				if (item == keyword) {
					$scope.status = 'Found';
					$scope.exists = true;
				}
			}
		}

	}


	/**
	 * Checks the searchKeyword and re-adjust column displayed
	 * @Param {string}
	 * @Return {}
	 */
	$scope.changeCriteria = function (searchKeyword) {

		// if the keyword is 'all titles', restore the column and row to the stored content.
		if ((searchKeyword) === "All titles") {
			$scope.columns = storeColumnContent;
			$scope.uniqueWords = storeRowContent;
		}
		else {
			$scope.columns = [];
			$scope.uniqueWords = [];
			$scope.uniqueWords = generateUniqueArray($scope.allContent[searchKeyword]);
			$scope.columns.push(searchKeyword);
		}

	}
}])
