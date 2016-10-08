/**** Inverted Index Application to index, sort and search words in a string ******/


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

//Declare modules to read file
let read = require('jsonfile');

var listContent = function list(path){

	// Specify file path to read
	let filePath = path;

	// Make a promise to read the JSON file located at the path provided
	let p1 = new Promise(function(resolve, reject){

		// Read the file using the path provided
		read.readFile(filePath, (err, data) => {

			// Resolve the promise if there is no error and reject otherwise
			if(!err)
				resolve(data);
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

let theFile = 'src/books/book-file.json';

console.log(listContent(theFile));