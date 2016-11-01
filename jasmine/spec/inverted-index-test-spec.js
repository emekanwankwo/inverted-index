describe('Inverted index class', () => {
  const InvertedIndex = require('../../src/inverted-index');
  const book = require('../books.json');
  
  const indexFile = new InvertedIndex();

  describe('Read book data', () => {
    it('Assert that JSON file is not empty', () => {
      expect(book).not.toEqual({});
    });

    it('Should return false if the number of keys of the book object is not exactly 2', () => {
      const Book1 = {title: 'new title', content1 : 'A new content1', content2 : 'A new content2'};
      const Book2 = book;
      Book2[1] = {content: 'content'};
      expect(indexFile.createIndex(Book1)).toBeFalsy();
      expect(indexFile.createIndex(Book2)).toBeFalsy();
    });
  });

  describe('Populate Index', () => {
    const indexObject = indexFile.createIndex(book);
    it('Should create an index', () => {
      expect(indexObject).toBeTruthy();
    });
    it('Should map string keys to the appropriate json object', () => {
      const getTheIndex = indexFile.getIndex();
      expect(getTheIndex['alice']).toEqual(['Alice in Wonderland']);
      expect(getTheIndex['a']).toEqual(['Alice in Wonderland','The Lord of the Rings: The Fellowship of the Ring.']);
      expect(getTheIndex['unusual']).toEqual(['The Lord of the Rings: The Fellowship of the Ring.']);
    });
    it('Should return false if no index is created', () => {
      const noIndex = new InvertedIndex();
      expect(noIndex.getIndex()).toBeFalsy();
    });
  });

  describe('Search index', () => {
    it('Should return an array of the indices of the correct objects that contain the words in the search query', () => {
      expect(indexFile.searchIndex('alice')).toEqual({alice : [0]});
      expect(indexFile.searchIndex('of')).toEqual({of : [0,1]});
      expect(indexFile.searchIndex('alliance')).toEqual({alliance : [1]});
      expect(indexFile.searchIndex('of','Alice in Wonderland')).toEqual({of : [0]});
      expect(indexFile.searchIndex('foodie')).toBeFalsy();
    });
  })

  describe('mergeObjects method', () => {
    const obj1 = { title: '1', content: ['2', '3'] };
    const obj2 = { title: '4',content: ['4'] };
    const result = { title: '1', content: ['2', '3', '4'] };
    const merge = indexFile.mergeObjects(obj1, obj2);
  
    it('should merge the content of two objects', () => {
      expect(merge['content']).toEqual(result['content']);
    });
    it('should return false if the arguments are not objects', () => {
      expect(indexFile.mergeObjects('arg1', 'arg2')).toBeFalsy();
    });
  });

  describe('filter method', () => {
    it('should take a string and return an array of filtered text in lower case', () => {
      expect(indexFile.filter('This$ i_s t£ext, to BE Te:steD')).toEqual(['this', 'is', 'text', 'to', 'be', 'tested']);
    });
    it('should return false if the argument to be filtered is not a string', () => {
      expect(indexFile.filter(['one, two'])).toBeFalsy();
    });
  });

  describe('generateUniqueArray method', () => {
    it('should return an array of unique contents of the array argument', () => {
      expect(indexFile.generateUniqueArray([1, 1, 2, 2, 'yes', 'yes'])).toEqual([1, 2, 'yes']);
    });
    it('should return false if the argument specified is not an array', () => {
      expect(indexFile.generateUniqueArray('12345')).toBeFalsy();
    });
  });

  describe('getStory method', () => {
    const theStoryFile = { title: 'story title', content: 'story content' };
    const newIndex = new InvertedIndex();
    newIndex.createIndex(theStoryFile);
    it('should return an object of all the titles and stories', () => {
      expect(newIndex.getStory()).toEqual({ titles: ['story title'], stories: ['story content'] });
    });
  });
});