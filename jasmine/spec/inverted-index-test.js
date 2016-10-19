
describe("Inverted index class", function() {

    let indexFile = new InvertedIndex();
    
    describe("createIndex function", function() {
        let promise = indexFile.createIndex();
        it("should return an instance of Promise", function() {
        expect(promise instanceof Promise).toBe(true);
        });
    });

    describe("getRequest function", function() {
        let promise = indexFile.getRequest();
        it("should return an instance of Promise", function() {
        expect(promise instanceof Promise).toBe(true);
        });
    });

    describe("listArrayItems function", function() {
        let arrayObject = indexFile.listArrayItems([1,2]);      
        it("should return an object", function() {
        expect(typeof arrayObject).toBe('object');
        });
    });

});