
/**** Inverted Index Application to index, sort and search words in a string ******/

class InvertedIndex {

    //TODO: Create a constructor to initialize variables

    	/**
	* Creates an Index of the file at the path specified
	* @Params {string}
    * @Returns {}
	**/

    createIndex(filePath) {

        let file = document.querySelector('input[type=file]').files[0];

        if(!file)
            throw Error('No file selected');              

        let reader = new FileReader();
        reader.readAsText(file);

        // Make a promise to resolve the file if it is a JSON file with valid JSON content and reject otherwise
        let promise = new Promise((resolve, reject) => {

            reader.onload = ((e) => {  
                if (e.target.result)
                
                    try{
                        if(JSON.parse(e.target.result));
                        resolve(JSON.parse(e.target.result));
                    }
                    catch(e){
                        reject('File content is not of type JSON. Expected file structure is: [ { "content1" : "item1", "content2" : "item2"  } ]');
                    }                                       
                else
                        reject('Invalid File Selected');
            })
        });

        return promise;
    }


    /**
     * getRequest method to make http request to the server on the specified part
     * @Params {string}
     * @Returns
     */

    getRequest(url) {

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

        return p1;
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

        return { 'length': wordListResult.length, 'words': wordListResult };
    }
}

let wordListResult = [];