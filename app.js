/**** Inverted Index Application to index, sort and search words in a string ******/

// Define a function to make http request to the JSON file url passed at the argument



let indexApp = angular.module("root", []);

indexApp.controller('rootAppController', ["$scope", function($scope) {

		// Define a template Document for the Inverted Index
 		$scope.columns = ['Document1','Document2','Document3','Document4'];
 		$scope.rows = ['Yes','No','Hi','Hello','Not',1,5,10,'23','Yes','No','Not'];

		$scope.uniqueWords = [];
		generateUnique($scope.rows);

		let theNewArray = [];
		let wordListResult = [];

		function generateUnique(data) {
			angular.forEach(data, (value) => {
				let index = $scope.uniqueWords.indexOf(value);
				if (index === -1)
					$scope.uniqueWords.push(value);
			})
		}

		$scope.getTheBook = function(){

			let filePath = $('#filePath').val();
			console.log(filePath);

			theIndex = new InvertedIndex();

			let theArray = new Promise((resolve, reject) => {resolve(theIndex.createIndex());});
			
			setTimeout(() => {
				theArray.then((data) => {
					$scope.array1 = data;
					
					theNewArray = data;
					pushValue(theNewArray);
				});
			}, 0);
			
		}

		function pushValue(data) {

			let wordList = [];

			for(let book of data)
				for(let attribute in book)
					wordList.push(book[attribute].split(' '));
			
			let word = theIndex.listArrayItems(wordList);
            let wordsItem = word.words;


			generateUnique(wordsItem);

			$scope.$apply();		
		}

}])
