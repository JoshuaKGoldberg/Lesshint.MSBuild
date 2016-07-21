/// <reference path="../typings/main.d.ts" />

import { ArgumentsCollection } from "./ArgumentsCollection";
import { LesshintSearcher } from "./LesshintSearcher";

/**
 * Driver for running Lesshint on a number of files.
 */
export class LintRunner {
    /**
     * Parsed MSBuild arguments.
     */
    private argumentsCollection: ArgumentsCollection;

    /**
     * Paths of files to lint.
     */
    private filePaths: string[];

    /**
     * Path of the Lesshint CLI file.
     */
    private pathToLinter: any;

    /**
     * Initializes a new instance of the LintRunner class.
     * 
     * @param argumentsCollection   Parsed MSBuild arguments.
     * @param filePaths   Paths of files to lint.
     */
    constructor(argumentsCollection: ArgumentsCollection, filePaths: string[]) {
        this.argumentsCollection = argumentsCollection;
        this.filePaths = filePaths;
        this.pathToLinter = new LesshintSearcher().resolve();
    }

    /**
     * Runs Lesshint on the added file paths.
     */
    public runLesshint(): void {
        const cli = require(this.pathToLinter);

        cli({
            args: this.filePaths,
            config: this.argumentsCollection.getConfig()
        });
    }
}
