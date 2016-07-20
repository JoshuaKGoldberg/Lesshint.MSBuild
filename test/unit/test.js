const tests = {
    LesshintSearcher: [
        "folderIsLesshint",
        "versionSorter"
    ],
    ArgumentsCollection: [
        "collectInputs",
        "toSpawnArgs"
    ]
};

for (const className in tests) {
    describe(className, () => {
        tests[className].forEach(functionName => {
            describe(functionName, require(`./${className}/${functionName}`).runTests);
        });
    });
};
