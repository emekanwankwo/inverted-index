describe('Inverted index class', () => {
  const InvertedIndex = require('../../src/inverted-index'),
    book = require('../books.json'),
    storyBook = require('../storybook.json'),
    mergeSrc = require('../merge-source.json'),
    mergeDest = require('../merge-dest.json'),
    invalidBook1 = require('../invalid/book1.json'),
    invalidBook2 = require('../invalid/book2.json');
  
  const invertedIndex = new InvertedIndex();

  describe('Read book data', () => {
    it('Assert that JSON file is not empty', () => {
      expect(book).not.toEqual({});
    });

    it('Should return false if the values of the keys are empty', () => {
      expect(invertedIndex.createIndex(invalidBook1)).toBeFalsy();
    });

    it('Should return false if the values of the keys are invalid', () => {
      expect(invertedIndex.createIndex(invalidBook2)).toBeFalsy();
    });
  });

  describe('Populate index', () => {
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
  });

  describe('Merge objects', () => {
    const merge = InvertedIndex.mergeObjects(mergeDest, mergeSrc);
  
    it('should merge the content of two objects', () => {
      expect(merge).toEqual({ title: ['1'], content: ['2', '3', '4'] });
    });
    it('should return false if the arguments are not objects', () => {
      expect(InvertedIndex.mergeObjects('arg1', 'arg2')).toBeFalsy();
    });
  });

  describe('Filter string', () => {
    it('should take a string and return an array of filtered text in lower case', () => {
      expect(InvertedIndex.filter('This$ i_s t£ext, Te:steD')).toEqual(['this', 'is', 'text', 'tested']);
    });
    it('should return false if the argument to be filtered is not a string', () => {
      expect(InvertedIndex.filter(['one, two'])).toBeFalsy();
    });
    it('should return false if string is empty after filtering', () => {
      expect(InvertedIndex.filter('.,;:-')).toBeFalsy();
    });
  });

  describe('Generate unique array', () => {
    it('should return an array of unique contents of the array argument', () => {
      expect(InvertedIndex.generateUniqueArray([1, 1, 2, 2, 'yes', 'yes'])).toEqual([1, 2, 'yes']);
    });
    it('should return false if the argument specified is not an array', () => {
      expect(InvertedIndex.generateUniqueArray('12345')).toBeFalsy();
    });
  });

  describe('Get story', () => {
    const newInvertedIndex = new InvertedIndex();
    newInvertedIndex.createIndex(storyBook);
    it('should return an object of all the titles and stories', () => {
      expect(newInvertedIndex.getStory()).toEqual({ titles: ['story title'], stories: ['story content'] });
    });
  });
});
