# Lesshint for MSBuild

[![NuGet Version and Downloads count](https://buildstats.info/nuget/Lesshint.MSBuild)](https://www.nuget.org/packages/Lesshint.MSBuild) 

An MSBuild target for linting Less code using [Lesshint](https://github.com/lesshint/lesshint).
Get it at [nuget.org](https://www.nuget.org/packages/Lesshint.MSBuild/).

## Usage

Add this package using the Visual Studio's NuGet Package Manager. 
It should be automatically added to your project.

Lesshint's default configuration's are used by default.
If you'd like to use your own `.lesshintrc` file, add a `LesshintConfig` property to your project:

```xml
<LesshintConfig>Styles/.lesshintrc</LesshintConfig>
```

All overrideable item groups and properties are below.
Read the [Lesshint documentation](https://github.com/palantir/Lesshint) for Lesshint-specific linting details.

#### Overrideable Item Groups

<table>
    <thead>
        <tr>
            <td>Item Group</td>
            <td>Description</td>
            <td>Default</td>
        </tr>
    </thead>
    <tbody>
        <tr>
            <th><code>LesshintExclude</code></th>
            <td>Globs of file names to exclude.</td>
            <td><em>(blank)</em></td>
        </tr>
        <tr>
            <th><code>LesshintFiles</code></th>
            <td>Files and directories to lint.</td>
            <td><em>(blank)</em></td>
        </tr>
        <tr>
            <th><code>LesshintLinters</code></th>
            <td>User-provided linters.</td>
            <td><em>(blank)</em></td>
        </tr>
    </tbody>
</table>

Note that to use special characters (such as `*` wildcards) in `LesshintExclude` you must escape the special characters.

```xml
<!-- Equivalent to "libs/**/*.less" -->
<LesshintExclude Include="libs/%2A%2A/%2A.less" />
```

#### Overrideable Properties

<table>
    <thead>
        <tr>
            <td>Property</td>
            <td>Description</td>
            <td>Default</td>
        </tr>
    </thead>
    <tbody>
        <tr>
            <th><code>LesshintAfterTargets</code></th>
            <td>What target to run Lesshint after.</td>
            <td><code>"Lesshint"</code></td>
        </tr>
        <tr>
            <th><code>LesshintBreakBuildOnError</code></th>
            <td>Whether linting failures should break the build.</td>
            <td><code>false</code></td>
        </tr>
        <tr>
            <th><code>LesshintConfig</code></th>
            <td>Path to a specific <code>.lesshintrc</code>.</td>
            <td><em>(blank)</em></td>
        </tr>
        <tr>
            <th><code>LesshintCli</code></th>
            <td>Path to a Lesshint CLI to run with.</td>
            <td>The highest-versioned Lesshint version in the solution's <code>packages</code> directory.</td>
        </tr>
        <tr>
            <th><code>LesshintDisabled</code></th>
            <td>Whether to skip running Lesshint.</td>
            <td><code>false</code></td>
        </tr>
        <tr>
            <th><code>LesshintNodeExe</code></th>
            <td>Path to a Node executable to execute the runner script.</td>
            <td>The <code>tools\node-6.1.0.exe</code> in the package.</td>
        </tr>
        <tr>
            <th><code>LesshintRunOutsideBuildingProject</code></th>
            <td>Whether to run even if `BuildingProject` isn't `true`.</td>
            <td><em>(blank)</em></td>
        </tr>
    </tbody>
</table>

#### Output Item Groups

<table>
    <thead>
        <tr>
            <td>Item Group</td>
            <td>Description</td>
        </tr>
    </thead>
    <tbody>
        <tr>
            <th><code>LesshintOutput</code></th>
            <td>Lines of console output form the Lesshint CLI.</td>
        </tr>
    </tbody>
</table>

#### Output Properties

<table>
    <thead>
        <tr>
            <td>Property</td>
            <td>Description</td>
        </tr>
    </thead>
    <tbody>
        <tr>
            <th><code>LesshintErrorCode</code></th>
            <td>Exit code of the Lesshint CLI.</td>
        </tr>
    </tbody>
</table>

### Lesshint version

The *first* available Lesshint version in your NuGet packages directory will be used. 

### Errata

You can exclude `.d.ts` files using `<LesshintExclude Include="%2A%2A/%2A.d.ts" />`.
MSBuild escapes `*` and other special characters using `%` and their hexadecimal value.


## Development

Run the following commands to initialize your environment:

```shell
npm install
```

Run `gulp` to build.
`gulp test` just runs tests.

### Updating the version

The version number is stored both in `package.json` and `Lesshint.MSBuild.nuspec`.
Make sure to update it in both places.

### 0.X to 1.X

0.X versions ran JavaScript logic to search for Lesshint, run it, and wrap the output.
This was slow (running two nested Node processes, with intermediary file names in text).

1.X versions now are completely in a single MSBuild file.
This is better for performance but has two downsides:
* It no longer searches for the "highest" available Lesshint version in the packages directory; instead, the first found in a file search is used.
* The `LesshintErrorSeverity` flag is no longer supported (until Lesshint adds support for error levels).

#### Why?

The original structure of Lesshint.MSBuild requires multiple layers of processes calling each other, which can wreak havoc in complex managed build systems.
Then, in order:

1. MSBuild determined build settings and passed them to the JavaScript code
2. JavaScript code determined the Lesshint location and re-formulated any arguments
3. JavaScript code ran Lesshint via a spawned process, captured its output, and re-logged it
4. MSBuild captured the (re-logged Lesshint) JavaScript output and logged it 

1.X unified all the logic into MSBuild, which resulted in significant performance gains, code simplification, and runtime stability. 
Now, in order:

1. MSBuild determines build settings and Lesshint location
2. MSBuild runs Lesshint using the packaged Node executable

### 0.3.X to 0.4.X

Versions 0.3.X and below manually call Lesshint on individual folders, whereas 0.4.X defers to the Lesshint CLI.

File a [bug report](https://github.com/JoshuaKGoldberg/Lesshint.MSBuild/issues) if upgrading causes any issues.
