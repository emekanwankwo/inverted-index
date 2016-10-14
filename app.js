
class InvertedIndex {

    //TODO: Create a constructor to initialize variables

    /**
     * getRequest method to make http request to the server on the specified part
     * @Params {string}
     * @Returns
     */

    getRequest(url) {

        console.log(url);

        return false;

        // Create a new XMLHttpRequest object
        let httpRequest = new XMLHttpRequest();       
        
        // Make a promise to send the http get request
        let p1 = new Promise((resolve, reject) => {

            // Make sure the request object was created for modern browsers
            if (httpRequest) {
                httpRequest.onreadystatechange = alertContents;
                httpRequest.open('GET', url);
                httpRequest.send();
            } else {
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

        //Handle the promise fufilment
        p1.then((data) => {

            let content = "";
            let wordList = [];

            $(document).ready(function (e) {

                $('#request_content').html('');

                for (let book of data)
                    for (let attribute in book) {
                        wordList.push(book[attribute].split(' '));
                        content += `${attribute}:  ${book[attribute]} <br /><br />`;
                        document.getElementById('request_content').innerHTML = content;
                    }

                let word = this.listArrayItems(wordList);
                let wordsItem = word.words;

                $('#wordList').html(`Total Number of Words: ${wordLength}`);
            });

            setTimeout(function () {
                console.log(wordsItem);
            }, 0);            
        })
            .catch((err) => console.log(err)); 
 }


	/**
	* Creates an Index of the file at the path specified
	* @Params {string}
    * @Returns {}
	**/

    createIndex(filePath) {

        // Create a new object to hold the word index
        let wordIndex = {};

        // Insert an index for each word in wordArray
        for (let j = 0; j < wordArray.length; j++)
            wordIndex[j + 1] = wordArray[j];

        console.log(wordArray)
        console.log(wordIndex[3]);

    }


    /**
     * getIndex Method to get the index of an element
     * @Returns {object}
     */

    getIndex(){

    }


    /**
     * searchIndex method to search for index
     * @Params {string}
     * @Returns {object}
     */

    searchIndex(terms){

    }


    /** listArrayItems method to list contents of an array into strings
	 *	@Param {array} @Returns {array}
	 */

    listArrayItems(data) {

        // Return the value if it is not an Array
        if (!Array.isArray(data))
            return data;


        //Make a recursive call back to the function if it is an array
        for (let item of data)
            wordListResult.push(this.listArrayItems(item));


        // Remove the undefined elements in the generated array.
        for (let word in wordListResult)
            if ((typeof wordListResult[word] !== 'string'))
                wordListResult.splice(word, 1);

        //console.log(wordListResult);
        return { 'length': wordListResult.length, 'words': wordListResult };
    }
}

module.exports = InvertedIndex;