# Inverted Index

[![Build Status](https://travis-ci.org/andela-cnwankwo/inverted-index.svg?branch=develop)](https://travis-ci.org/andela-cnwankwo/inverted-index) [![Code Climate](https://codeclimate.com/github/andela-cnwankwo/inverted-index/badges/gpa.svg)](https://codeclimate.com/github/andela-cnwankwo/inverted-index) [![Test Coverage](https://codeclimate.com/github/andela-cnwankwo/inverted-index/badges/coverage.svg)](https://codeclimate.com/github/andela-cnwankwo/inverted-index/coverage)

### Introduction
An inverted index (also referred to as postings file or inverted file) is an index data structure storing a mapping from content, such as words or numbers, to its locations in a database file, or in a document or a set of documents (named in contrast to a Forward Index, which maps from documents to content). The purpose of an inverted index is to allow fast full text searches, at a cost of increased processing when a document is added to the database. The inverted file may be the database file itself, rather than its index. It is the most popular data structure used in document retrieval systems.

### Technology and Dependencies
    - Javascript ES6 (ECMAScript 2015)
    - Node JS

### Features
    - Enter url to a well-formatted json content or upload  a well-formatted json file to index content.
    (check below for proper content formatting).

    - View and navigate across titles and stories after indexing.

    - Search for a term in the content to return documents containing such term.

    - Filter search results by specifying a particular title to search.

    - Search multiple words by separating them with a space.

    - Search results rendered in real-time.

### Content formatting
    - Sample json file: [{ title: 'Book Title', content: 'This is the book content'}]

### How to use
 [Click here](https://inverted-index-develop.herokuapp.com/) to open the application.

    - Select a valid (single or multiple) json file or enter a url 
    to a json file and click create index.

    - Search for a word or group of words to view the index in the application.

    - Select a given title to view/search contents from that title.

### Limitations
    - Only json files can be indexed.

    - Json contents must adhere to a specified (title/content) format.

    - Searches can only be filtered to a single title or all titles.

### Contribute
    - Clone the github repository by running the command on a terminal: git clone https://github.com/andela-cnwankwo/inverted-index.git

    - Make sure you have latest version of node installed, 
    then navigate to the application folder and install dependencies by running the command: npm install

    - Run the application locally using the command: npm start

    - Create a new branch locally for your desired feature using: git checkout -b <your branch name>

    - Make desired changes and push to github using: git push origin <your branch name>

    - Open a pull request.

### How to Test
    - After cloning the repository and installing dependencies as specified above, run the command: npm test