const expect = require("chai").expect;
const LesshintSearcher = require("../../../dist/LesshintSearcher").LesshintSearcher;

exports.runTests = () => {
    it("passes a semver folder name", () => {
        // Arrange
        const folderName = "lesshint.1.2.3";

        // Act & assert
        expect(LesshintSearcher.prototype.folderIsLesshint(folderName)).to.be.true;
    });

    it("rejects a regular folder name", () => {
        // Arrange
        const folderName = "lesshint";

        // Act && assert
        expect(LesshintSearcher.prototype.folderIsLesshint(folderName)).to.be.false;
    });

    it("rejects a folder name with not enough version numbers", () => {
        // Arrange
        const folderName = "lesshint.1.2";

        // Act && assert
        expect(LesshintSearcher.prototype.folderIsLesshint(folderName)).to.be.false;
    });

    it("rejects a folder name with improper version numbers", () => {
        // Arrange
        const folderName = "lesshint.a.b.c";

        // Act && assert
        expect(LesshintSearcher.prototype.folderIsLesshint(folderName)).to.be.false;
    });
};
