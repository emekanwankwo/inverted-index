describe("Calculator", function() {

    let indexFile = new InvertedIndex();
    
    describe("Addition function", function() {
        it("should add numbers", function() {
        expect(indexFile.addIt(1, 1)).toBe(2);
        expect(indexFile.addIt(2, 2)).toBeGreaterThan(3);
        });
    });

    describe("Multiplication function", function() {
        it("should multiply numbers", function() {
        expect(indexFile.doIt(1, 1)).toBe(1);
        expect(indexFile.doIt(2, 2)).toBeGreaterThan(3);
        });
    });

});