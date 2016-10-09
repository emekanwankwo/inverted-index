/**** Inverted Index Application to index, sort and search words in a string ******/

// Define a function to make http request to the JSON file url passed at the argument

var $ = require('jquery');


let sendGetRequest = function getRequest(url){

	// Create a new XMLHttpRequest object
	httpRequest = new XMLHttpRequest();

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

		$(document).ready(function(e) {

			let content = "";
			for (book of data)
				for (attribute in book)
					content += `${attribute}:  ${book[attribute]} <br /><br />`;
					console.log(content);
					$('#request_content').html(content);
			

		});
		

	})
	.catch((err) => console.log(err));
}

let theFileUrl = 'http://localhost:3000/src/books/book-file.json';

sendGetRequest(theFileUrl);

/**

//Create an empty array to hold items

var wordList = [];

var listItems = function list(data){
	
	
	// Return the value if it is not an Array
	
	if (!Array.isArray(data)){
		return data;
	}
	

	//Make a recursive call back to the function if it is an array

	for (item of data)
		wordList.push(list(item));
	
	
	// Remove the undefined elements in the generated array.

	for (word in wordList)
		if (wordList[word] === undefined)
			wordList.splice(word,1);			
};

var arr= [['a','b','c'],['d','e','f'],['g','h','i','j','k','l'],'n',1,3,6,2];

listItems(arr);
console.log(wordList);
**/


/**

//Declare modules to read file
var request = require('request');

var listContent = function list(url){

	// Specify file path to read
	let filePath = url;

	// Make a promise to read the JSON file located at the path provided
	let p1 = new Promise(function(resolve, reject){

		// Read the file using the path provided
		request.get('http://ipinfo.io/json', (err, response, body) => {

			// Resolve the promise if there is no error and reject otherwise
			if(response.statusCode === 200)
				resolve(JSON.parse(data));
			else
				reject(err);
		})

	});

	// Specify the callback after the promise is fufilled
	p1.then((data) => {

		// Iterate for the number of items in the JSON file
		for(let i = 0; i < data.length; i++){
			console.log (`\nName: ${data[i].book_name} \nContent: ${data[i].book_text}\n`);
		}
	})
	.catch((err) => console.log(err));
}

//let theFileUrl = 'http://localhost:8080/src/books/book-file.json';

//console.log(listContent(theFileUrl));

**/