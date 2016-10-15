/**** Inverted Index Application to index, sort and search words in a string ******/

// Define a module 'root' for the application

let indexApp = angular.module("root", []);


// Define a controller 'rootAppController' for the root module

indexApp.controller('rootAppController', ["$scope", function($scope) {

		// Define a template Document for the Inverted Index Landing Page
 		$scope.columns = ['Doc1','Doc2','Doc3','Doc'];
 		$scope.rows = ['Yes','No','Hi','Hello','Not',1,5,10,'23','Yes','No','Not'];

		$scope.storyTitle = [];			
		$scope.storyContent = [];
		
		$scope.theIndex = 0;	// The index of the current story
		
		/**
		 * Method to change the story being displayed by changing the index value
		 * @Params {}
		 * @Returns {}
		 */
		$scope.changeStory = function(){
			if ($scope.storyTitle.length == 0)
				return false;
			if ($scope.theIndex == $scope.storyTitle.length-1)
				$scope.theIndex = 0;
			else
				$scope.theIndex += 1;
		}


		$scope.uniqueWords = [];
		generateUnique($scope.rows);

		let theNewArray = [];						// Empty array to hold the 
		let wordListResult = [];


		/**
		 * Method to generate unique items from the array given
		 * @Params {array}
		 * @Returns {}
		 */
		function generateUnique(data) {
			angular.forEach(data, (value) => {
				let index = $scope.uniqueWords.indexOf(value);
				if (index === -1)
					$scope.uniqueWords.push(value);
			})
		}


		/**
		 * Method to get the array of words by calling the InvertedIndex class
		 * @Params {}
		 * @Returns {}
		 */
		$scope.getTheBook = function(){

			// Create a new object for the InvertedIndex class.
			theIndex = new InvertedIndex();

			// Check if a url address is entered to make an http get request to the selected JSON
			let fileUrl = $.trim($('#filename').val());

			if(fileUrl !== ""){

				theIndex.getRequest(fileUrl);

			} else {

				// Ensure a valid file is selected and is has a '.json' extension
				let filepath = $.trim($('#filePath').val());
				let fileExt = filepath.substring(filepath.length-5,filepath.length);

				if(filepath == "")
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


			let titlesArray = [];
			let titlesItem = [];

			for (let i = 0; i < data.length; i++){
				$scope.storyTitle.push(data[i][Object.keys(data[i])[0]]);	// Push the first content of each of the objects to the storyTitle array
				$scope.storyContent.push(data[i][Object.keys(data[i])[1]]);	// Push the second content of each of the objects to the storyContent array
			}

			// Assign the empty title column template to the title of the new stories 
			$scope.columns = $scope.storyTitle;

			let wordList = [];

			
			// Split the contents of the array items anywhere a white space is detected

			// Try to resolve the contents of the JSON as multi-dimensional
			try {
			for(let book of data)
				for(let attribute in book)
					wordList.push(book[attribute].split(' '));
			} 
			catch(e) {
				// If the error is an instance of 'TypeError', try to resolve the array as a single JSON
				if (e instanceof TypeError){
					try{
						for (let singleBook in data){
							wordList.push(data[singleBook].split(' '));
						}

						// Push the single items as the story title and content
						$scope.storyTitle.push(data[Object.keys(data)[0]]);
						$scope.storyContent.push(data[Object.keys(data)[1]]);
					}
					catch(e) {
						//final catch statement goes here
						throw Error('Cannot read file content')
					}

				}
			}
			
			let word = theIndex.listArrayItems(wordList);
            let wordsItem = word.words;

			// Generate a unique array of items from the contents of the new array
			generateUnique(wordsItem);

			$scope.$apply();		
		}

}])
