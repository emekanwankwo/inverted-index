describe('Inverted index class', () => {
  const InvertedIndex = require('../../src/inverted-index'),
    book = require('../books.json'),
    invalidBook1 = require('../invalid/book1.json'),
    invalidBook2 = require('../invalid/book2.json'),
    invalidBook3 = require('../invalid/book3.json'),
    invalidBook4 = require('../invalid/book4.json');
  
  const invertedIndex = new InvertedIndex();

  describe('Read book data', () => {
    it('Assert that JSON file is not empty', () => {
      expect(book).not.toEqual({});
    });

    it('Should return false if the number of keys of the book object is not exactly 2 or if the values are invalid', () => {
      expect(invertedIndex.createIndex(invalidBook1)).toBeFalsy();
      expect(invertedIndex.createIndex(invalidBook2)).toBeFalsy();
      expect(invertedIndex.createIndex(invalidBook3)).toBeFalsy();
      expect(invertedIndex.createIndex(invalidBook4)).toBeFalsy();
    });
  });

  describe('Populate Index', () => {
    const indexObject = invertedIndex.createIndex(book);
    it('Should create an index', () => {
      expect(indexObject).toBeTruthy();
    });
    it('Should map string keys to the appropriate json object', () => {
      const getTheIndex = invertedIndex.getIndex();
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
      expect(invertedIndex.searchIndex('alice')).toEqual({alice : [0]});
      expect(invertedIndex.searchIndex('of')).toEqual({of : [0,1]});
      expect(invertedIndex.searchIndex('alliance')).toEqual({alliance : [1]});
      expect(invertedIndex.searchIndex('of','Alice in Wonderland')).toEqual({of : [0]});
      expect(invertedIndex.searchIndex('foodie')).toBeFalsy();
    });
  })

  describe('mergeObjects method', () => {
    const obj1 = { title: ['1'], content: ['2', '3'] },
      obj2 = { title: ['1'], content: ['4'] },
      result = { title: ['1'], content: ['2', '3', '4'] },
      merge = invertedIndex.mergeObjects(obj1, obj2);
  
    it('should merge the content of two objects', () => {
      expect(merge).toEqual(result);
    });
    it('should return false if the arguments are not objects', () => {
      expect(invertedIndex.mergeObjects('arg1', 'arg2')).toBeFalsy();
    });
  });

  describe('filter method', () => {
    it('should take a string and return an array of filtered text in lower case', () => {
      expect(invertedIndex.filter('This$ i_s t£ext, Te:steD')).toEqual(['this', 'is', 'text', 'tested']);
    });
    it('should return false if the argument to be filtered is not a string', () => {
      expect(invertedIndex.filter(['one, two'])).toBeFalsy();
    });
    it('should return false if string is empty after filtering', () => {
      expect(invertedIndex.filter('.,;:-')).toBeFalsy();
    });
  });

  describe('generateUniqueArray method', () => {
    it('should return an array of unique contents of the array argument', () => {
      expect(invertedIndex.generateUniqueArray([1, 1, 2, 2, 'yes', 'yes'])).toEqual([1, 2, 'yes']);
    });
    it('should return false if the argument specified is not an array', () => {
      expect(invertedIndex.generateUniqueArray('12345')).toBeFalsy();
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