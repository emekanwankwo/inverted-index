
describe("Inverted index class", () => {

  let indexFile = new InvertedIndex();

  describe("createIndex method", () => {
    let singleJsonFile = {
      'a': 'single title',
      'b': 'single content'
    };

    let multipleJsonArray = [{
      'a': 'multiple title1',
      'b': 'multiple content1'
    }, {
      'c': 'multiple title2',
      'd': 'multiple content2'
    }
    ];

    let createSingle = indexFile.createIndex(singleJsonFile);
    let createMultiple = indexFile.createIndex(multipleJsonArray);

    it("should return an object which indexes each word in a single or multiple JSON object to an array of the titles they appear in.", () => {
      expect(JSON.stringify(createSingle)).toBe(JSON.stringify({
        'single': ['single title'],
        'title': ['single title'],
        'content': ['single title']
      }));

      expect(JSON.stringify(createMultiple)).toBe(JSON.stringify({
        'multiple': ['multiple title1', 'multiple title2'],
        'title1': ['multiple title1'],
        'content1': ['multiple title1'],
        'title2': ['multiple title2'],
        'content2': ['multiple title2'],
      }));
    });

  });

  describe("getIndex method", () => {
    let obj = {
      'a': ['doc1', 'doc2'],
      'b': ['doc2', 'doc3']
    };
    indexFile.createIndex(obj);
    let theData = indexFile.getIndex(obj);
    it("should return an object that stores arrays of words and titles", () => {
      expect(JSON.stringify(theData)).toBe(JSON.stringify({
        words: ['a', 'b'],
        titles: ['doc1', 'doc2', 'doc3']
      }));
    });
  });

  describe("searchIndex method", () => {
    let theFile = {
      'a': 'single title',
      'b': 'single content'
    };
    indexFile.createIndex(theFile);
    it("Should return true if the index exists and false otherwise", () => {
      expect(indexFile.searchIndex('single')).toBe(true);
      expect(indexFile.searchIndex('multiple')).toBe(false);
    });
  });

  describe("mergeObjects method", () => {
    let obj1 = {
      'a': '1',
      'b': ['2', '3']
    };

    let obj2 = {
      'c': '4',
      'b': ['4']
    };

    let result = {
      a: '1',
      b: ['2', '3', '4'],
      c: '4'
    };
    let merge = indexFile.mergeObjects(obj1, obj2)
    it("should merge the content of two objects", () => {
      expect(JSON.stringify(merge)).toBe(JSON.stringify(result));
    });
  });

  describe("filterWord method", () => {
    let stringWord = indexFile.filterWord('This$ i_s t£ext, to BE Te:steD');
    it("should take a string and return an array of filtered text in lower case", () => {
      expect(JSON.stringify(stringWord)).toBe(JSON.stringify(['this', 'is', 'text', 'to', 'be', 'tested']));
    });
  });

  describe("generateUniqueArray method", () => {
    let generate = indexFile.generateUniqueArray([1, 1, 2, 2, 'yes', 'yes']);
    it("should return an array of unique items", () => {
      expect(JSON.stringify(generate)).toBe(JSON.stringify([1, 2, 'yes']));
    });
  });

  describe("getStory method", () => {
    let theStoryFile = {
      'x': 'story title',
      'y': 'story content'
    };
    let newIndex = new InvertedIndex();
    newIndex.createIndex(theStoryFile);
    let theStory = newIndex.getStory();
    it("should return an object of all the titles and stories", () => {
      expect(JSON.stringify(theStory)).toBe(JSON.stringify({
        titles: ['story title'],
        stories: ['story content']
      }));
    });
  });

});