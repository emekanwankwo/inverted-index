/**** Inverted Index Application to index, sort and search words in a string ******/

// Define a function to make http request to the JSON file url passed at the argument

//let theFileUrl = 'http://localhost:3000/src/books/book-file.json';


let indexApp = angular.module("root", []);

indexApp.controller('rootAppController', ["$scope", function($scope) {

 		$scope.columns = ['Document1','Document2','Document3','Document4'];
 		$scope.rows = ['Yes','No','Hi','Hello','Not',1,5,10,'23','Yes','No','Not'];

		$scope.uniqueWords = [];

		angular.forEach($scope.rows, (value) => {
			let index = $scope.uniqueWords.indexOf(value);
			if( index === -1)
				$scope.uniqueWords.push(value);
		})

		$scope.getTheBook = function(){

			let filePath = $('#filePath').val();

			// Call the getRequest method of the InvertedIndex class in app.js
			$(document).ready(function(e){

				$.getscript("./app.js",function(){
					InvertedIndex.getRequest(filePath);
				});

			});
		}
}])
