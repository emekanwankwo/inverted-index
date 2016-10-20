
describe("Inverted index class", function() {

  let indexFile = new InvertedIndex();

  describe("createIndex function", function() {
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

    it("should return an object which indexes each unique word in a single JSON object to an array of the title", function() {
      expect(JSON.stringify(createSingle)).toBe(JSON.stringify({
        'single': ['single title'],
        'title': ['single title'],
        'content': ['single title']
      }));
    });

    it("should return an object which indexes each unique word in an array of JSON objects to an array of the titles it appears in", function() {
      expect(JSON.stringify(createMultiple)).toBe(JSON.stringify({
        'multiple': ['multiple title1', 'multiple title2'],
        'title1': ['multiple title1'],
        'content1': ['multiple title1'],
        'title2': ['multiple title2'],
        'content2': ['multiple title2'],
      }));
    });

  });

  describe("getIndex function", function() {
    let obj = {
      'a': ['1', '2'],
      'b': ['2', '3']
    };
    let theData = indexFile.getIndex(obj);

    it("should return an object", function() {
      expect(typeof theData).toBe('object');
    });
  });

  describe("mergeObjects function", function() {
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
    it("should merge the content of two objects", function() {
      expect(JSON.stringify(merge)).toBe(JSON.stringify(result));
    });
  });

  describe("filterWord function", function() {
    let stringWord = indexFile.filterWord('This$ i_s t£ext, to BE Te:steD');
    it("should take a string and return an array of filtered text in lower case", function() {
      expect(JSON.stringify(stringWord)).toBe(JSON.stringify(['this', 'is', 'text', 'to', 'be', 'tested']));
    });
  });

  describe("generateUniqueArray function", function() {
    let generate = indexFile.generateUniqueArray([1, 1, 2, 2, 'yes', 'yes']);
    it("should return an array of unique items", function() {
      expect(JSON.stringify(generate)).toBe(JSON.stringify([1, 2, 'yes']));
    });
  });

  describe("getRequest function", function() {
    let promise = indexFile.getRequest();
    it("should return an instance of Promise", function() {
      expect(promise instanceof Promise).toBe(true);
    });
  });

});