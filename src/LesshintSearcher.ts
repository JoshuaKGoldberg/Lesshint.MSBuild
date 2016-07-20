/// <reference path="../typings/main.d.ts" />

import * as fs from "fs";
import * as path from "path";

/**
 * The folder name NuGet packages are stored under.
 */
const packagesFolderName: string = "packages";

/**
 * Where the node module is stored under its NuGet package.
 */
const pathSuffix: string = "tools/node_modules/lesshint";

/**
 * Known names of environment variables that build systems may put packages in.
 */
const possibleEnvironmentVariables: string[] = [
    "NugetMachineInstallRoot"
];

/**
 * A utility to find a Lesshint NuGet package.
 */
export class LesshintSearcher {
    /**
     * The parent project's NuGet packages folder.
     */
    private packagesDirectory: string;

    /**
     * The highest available version of the Lesshint NuGet package.
     */
    private lesshintPackage: string;

    /**
     * Initializes a new instance of the LesshintSearcher class.
     */
    constructor() {
        this.packagesDirectory = this.resolvePackagesDirectory();
        console.log(`Resolved packages directory to '${this.packagesDirectory}'.`);

        this.lesshintPackage = this.resolveLesshintPackageDirectory();
        console.log(`Resolved Lesshint package directory to '${this.lesshintPackage}'.`);
    }

    /**
     * @returns The complete path to the Lesshint package.
     */
    public resolve(): string {
        const packagePath: string = path.resolve(
            this.packagesDirectory,
            this.lesshintPackage,
            pathSuffix);
        const cliPath = path.join(packagePath, "lib", "cli.js");
        console.log(`Resolved Lesshint CLI to '${cliPath}'.`);

        return cliPath;
    }

    /**
     * @returns The parent project's NuGet packages folder.
     */
    private resolvePackagesDirectory(): string {
        console.log("Resolving packages directory...");

        const result: string = (
            this.resolvePackagesDirectoryFromSibling()
            || this.resolvePackagesDirectoryFromEnvironment()
            || this.resolvePackagesDirectoryFromParent());

        if (!result) {
            throw new Error("Couldn't find Lesshint packages directory!");
        }

        return result;
    }

    /**
     * Attempts to find the NuGet package directory as a sibling of the current
     * directory.
     * 
     * @returns The NuGet package directory path, if found.
     */
    private resolvePackagesDirectoryFromSibling(): string {
        console.log("Resolving packages directory from siblings...");

        const currentPath: string = path.resolve(__dirname, "../..");
        if (this.doesFolderContainLesshint(currentPath)) {
            return currentPath;
        }

        console.log(`No Lesshint found in '${currentPath}'.`);
        return undefined;
    }

    /**
     * Attempts to find the NuGet package directory based on known environment
     * variables.
     * 
     * @returns The NuGet package directory path, if found.
     */
    private resolvePackagesDirectoryFromEnvironment(): string {
        console.log("Resolving packages directory from environment...");

        for (let i: number = 0; i < possibleEnvironmentVariables.length; i += 1) {
            const name: string = possibleEnvironmentVariables[i];
            if (!process.env[name]) {
                continue;
            }

            const value: string = process.env[name];
            const  currentPath: string = path.resolve(value);
            console.log(`Checking environment variable path '${name}' (value '${value}' resolved to '${currentPath}')...`);

            if (this.doesFolderContainLesshint(currentPath)) {
                return currentPath;
            }
        }

        console.log("No matching environment variable paths found.");
    }

    /**
     * Attempts to find the NuGet package directory as a parent of the current
     * directory.
     * 
     * @returns The NuGet package directory path, if found.
     */
    private resolvePackagesDirectoryFromParent(): string {
        console.log("Resolving packages directory from parent...");

        let currentPath: string = path.resolve(__dirname, "..");

        while (true) {
            if (currentPath.length < 3) {
                console.log("Too far up to find packages directory.");
                return;
            }

            console.log(`\tChecking '${currentPath}'...`);

            let childNames: string[] = fs.readdirSync(currentPath);
            if (childNames.indexOf(packagesFolderName) !== -1) {
                currentPath = path.resolve(currentPath, packagesFolderName);
                break;
            }

            let nextPath = path.resolve(currentPath, "..");
            if (currentPath === nextPath) {
                console.log("Could not find \"packages\" directory from parents.");
                return undefined;
            }

            currentPath = nextPath;
        }

        return currentPath;
    }

    /**
     * Determines the highest version of the Lesshint NuGet package in the 
     * previously determined packages directory.
     * 
     * @returns The highest version of the Lesshint NuGet package.
     */
    private resolveLesshintPackageDirectory(): string {
        console.log("Resolving Lesshint package directory...");

        let lintVersions: number[][] = fs.readdirSync(this.packagesDirectory)
            .filter(folderName => this.folderIsLesshint(folderName))
            .map(folderName => this.parseLesshintPackageVersionFromName(folderName));

        if (lintVersions.length === 0) {
            throw new Error("Couldn't find a Lesshint package.");
        }

        lintVersions.sort(LesshintSearcher.versionSorter);
        console.log(`\tFound Lesshint versions [${this.joinLintVersions(lintVersions)}].`);

        return `lesshint.${lintVersions[0].join(".")}`;
    }

    /**
     * @param folderName   The name of a Lesshint folder.
     * @returns The semver associated with that name.
     */
    private parseLesshintPackageVersionFromName(folderName: string): number[] {
        return folderName
            .replace("lesshint", "")
            .split(".")
            .filter(numberRaw => !!numberRaw)
            .map(numberRaw => parseInt(numberRaw));
    }

    /**
     * @param lintVersions   Found versions of a package.
     * @returns A human-readable list of the given versions.
     */
    private joinLintVersions(lintVersions: number[][]): string {
        return lintVersions.map(lintVersion => lintVersion.join(".")).join(",");
    }

    /**
     * Determines if a folder's children contain a Lesshint directory.
     * 
     * @param folderPath   A path to a folder.
     * @returns Whether the folder contains a Lesshint child.
     */
    private doesFolderContainLesshint(folderPath: string) {
        const childNames: string[] = fs.readdirSync(folderPath);

        for (let i: number = 0; i < childNames.length; i += 1) {
            if (this.folderIsLesshint(childNames[i])) {
                return true;
            }
        }

        return false;
    }

    /**
     * Determines whether a folder contains the Lesshint NuGet package.
     * 
     * @param folderName   A folder to check.
     * @returns Whether the folderName is a match for Lesshint.
     */
    private folderIsLesshint(folderName: string): boolean {
        return /lesshint.\b\d+.\d+.\d+\b/.test(folderName);
    }

    /**
     * Sorts semver versions of a package.
     * 
     * @param a   A semver version of a package.
     * @param b   A semver version of a package.
     * @returns Whether a is less than b.
     */
    private static versionSorter(a: number[], b: number[]): number {
        const minimumLength = Math.min(a.length, b.length);

        for (let i: number = 0; i < minimumLength; i += 1) {
            if (a[i] !== b[i]) {
                return a[i] > b[i] ? -1 : 1;
            }
        }

        return a.length > b.length ? -1 : 1;
    }
}
