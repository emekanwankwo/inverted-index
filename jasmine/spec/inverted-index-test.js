
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

    it("should return an object which indexes each unique word in a single JSON object to an array of the title", () => {
      expect(JSON.stringify(createSingle)).toBe(JSON.stringify({
        'single': ['single title'],
        'title': ['single title'],
        'content': ['single title']
      }));
    });

    it("should return an object which indexes each unique word in an array of JSON objects to an array of the titles it appears in", () => {
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
      'a': ['1', '2'],
      'b': ['2', '3']
    };
    let theData = indexFile.getIndex(obj);

    it("should return an object", () => {
      expect(typeof theData).toBe('object');
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

  describe("generateUniqueArray method", () => {
    let generate = indexFile.generateUniqueArray([1, 1, 2, 2, 'yes', 'yes']);
    it("should return an array of unique items", () => {
      expect(JSON.stringify(generate)).toBe(JSON.stringify([1, 2, 'yes']));
    });
  });

});