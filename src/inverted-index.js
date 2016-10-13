/**** Inverted Index Application to index, sort and search words in a string ******/

// Define a function to make http request to the JSON file url passed at the argument

var $ = require('jquery');

class invertedIndex {

	//TODO: Create a constructor to initialize variables

	getRequest(url){

		// Create a new XMLHttpRequest object
		let httpRequest = new XMLHttpRequest();

		// Make a promise to send the http get request
		let p1 = new Promise((resolve, reject) => {

			// Make sure the request object was created for modern browsers
			if(httpRequest){
				httpRequest.onreadystatechange = alertContents;
				httpRequest.open('GET', url);
				httpRequest.send();
			} else{
				reject('Browser Not Supported');
			}

			// Method to handle the promise
			function alertContents() {
				if (httpRequest.readyState === XMLHttpRequest.DONE) {
					if (httpRequest.status === 200)
						resolve(JSON.parse(httpRequest.responseText));
					else
						reject('There was an error!');		
				}
			}
		});

		// Handle the promise fufilment
		p1.then((data) => {

			let content = "";
			let wordList = [];

			$(document).ready(function(e) {

				$('#request_content').html('');

				for (let book of data)
					for (let attribute in book){
						wordList.push(book[attribute].split(' '));
						content += `${attribute}:  ${book[attribute]} <br /><br />`;
						document.getElementById('request_content').innerHTML = content;
					}

					let wordLength = newIndex.listArrayItems(wordList).length;

				$('#wordList').html(`Total Number of Words: ${wordLength}`);
			});

			// Call the createIndex method and pass the new array containing words
			let wordsItem = newIndex.listArrayItems(wordList).words;
			//newIndex.createIndex(wordsItem);


			/******************************/
			setTimeout(function () {
				console.log(wordsItem.length);
			}, 0);

			/******************************/

		})
		.catch((err) => console.log(err));
	}


	/** Method to break down contents of an array into strings
	 *	@Param {array} @Returns {array}
	 **/

	listArrayItems(data){

		// Return the value if it is not an Array
		if (!Array.isArray(data))
			return data;
	

		//Make a recursive call back to the function if it is an array
		for (let item of data)
			wordListResult.push(newIndex.listArrayItems(item));
	
	
		// Remove the undefined elements in the generated array.
		for (let word in wordListResult)
			if ((typeof wordListResult[word] !== 'string'))
				wordListResult.splice(word,1);

		//console.log(wordListResult);
		return {'length': wordListResult.length, 'words': wordListResult};
	}


	/**
	* Creates an Index of the file at the path specified
	* @Param {string: filepath}
	**/

	createIndex(wordArray) {

		// Create a new object to hold the word index
		let wordIndex = {};

		// Insert an index for each word in wordArray
		for (let j = 0; j < wordArray.length; j++)
			wordIndex[j+1] = wordArray[j];

		console.log(wordArray)
		console.log(wordIndex[3]);
		
	}
}

let wordListResult = [];

let newIndex = new invertedIndex;

//let theFileUrl = 'http://localhost:3000/src/books/book-file.json';

//newIndex.getRequest(theFileUrl);

angular.module("root", [])
	.controller("index", ["$scope", function($scope) {
		$scope.products = [
			{id: 1, name: "Hockey puck"},
			{id: 2, name: "Golf club"},
			{id: 3, name: "Baseball bat"},
			{id: 4, name: "Lacrosse stick"}
		];

		$scope.columns = ['Document1','Document2','Document3',,'Document4'];
		$scope.rows = ['Yes','No','Hi','Hello','Not',1,5,10,'23','Yes','No','Not'];

		$scope.uniqueWords = [];

		angular.forEach($scope.rows, function(value){
			let index = $scope.uniqueWords.indexOf(value);
			if( index === -1)
				$scope.uniqueWords.push(value);
		})

		$scope.getTheBook = function() {
			
			if($scope.urlpath){
				let theIndex = new invertedIndex;
				theIndex.getRequest($scope.urlpath);
			}
			else
				console.log('Error: No Path Specified');
		}
	}]);