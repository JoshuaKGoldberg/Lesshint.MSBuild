# Lesshint for MSBuild

[![NuGet Version and Downloads count](https://buildstats.info/nuget/Lesshint.MSBuild)](https://www.nuget.org/packages/Lesshint.MSBuild) 

An MSBuild target for linting Less code using [Lesshint](https://github.com/lesshint/lesshint). Get it at [nuget.org](https://www.nuget.org/packages/Lesshint.MSBuild/).

## Usage

Add this package using the Visual Studio's NuGet Package Manager. 
It should be automatically added to your project.

Define a `LessCompile` property in your .csproj/.targets consisting of the names of .less files to lint.

### Builds

At runtime, the list of .less files from `LessCompile` is output to a temporary .txt file.
A .js runner file then takes in the path to that file list and runs Lesshint on them.

The following properties may be overidden via your targets:
* **LesshintBreakBuildOnError** - Whether linting failures should break the build. Defaults to `false`.
* **LesshintConfig** - Path to the configuration file to use (will be merged with defaults).
* **LesshintDeleteFileListFile** - Whether to delete the file list file when done. Defaults to `true`.
* **LesshintExclude** - An optional minimatch glob pattern or a file to exclude from being linted.
* **LesshintFilesRootDir** - A root directory to work within. Defaults to `$(MSBuildProjectDirectory)`.
* **LesshintFileListDir** - The directory to put the file list in. Defaults to `$(IntermediateOutDir)`.
* **LesshintFileListName** - The name of the file list file. Defaults to `LesshintFileList.txt-$(MSBuildProjectName)`.
* **LesshintLinters** - Require paths of custom linters to add to the built-in list.
* **LesshintNodeExe** - A node executable to execute the runner script. Defaults to the `tools\node-5.9.0.exe` in the package. 
* **LesshintRunnerScript** - The .js file to take in `LesshintFileListFile`. Defaults to the `tools\runner.js` in the package.


## Development

Run the following commands to initialize your environment:

```shell
npm install
typings install
```

Run `grunt` to build.
