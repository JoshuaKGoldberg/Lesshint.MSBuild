# Lesshint for MSBuild

[![NuGet Version and Downloads count](https://buildstats.info/nuget/Lesshint.MSBuild)](https://www.nuget.org/packages/Lesshint.MSBuild) 

An MSBuild target for linting Lesshint code using [Lesshint](https://github.com/lesshint/lesshint). Get it at [nuget.org](https://www.nuget.org/packages/Lesshint.MSBuild/).

## Usage

Add this package using the Visual Studio's NuGet Package Manager. 
It should be automatically added to your project.

Define a `LessCompile` property in your `.csproj`/`.targets` consisting of the names of .less files to lint.
The `Lesshint` target runs after a target named `CompileLessFiles`.

Lesshint's default configurations are used by default.
If you'd like to use your own `.lesshintrc` file, add a `LesshintConfig` property to your project:

```xml
<LesshintConfig>Styles/.lesshintrc</LesshintConfig>
```

All overrideable item groups and properties are below.
Read the [Lesshint documentation](https://github.com/lesshint/lesshint) for Lesshint-specific linting details.

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
            <td>A minimatch glob pattern or a file to exclude form being linted.</td>
            <td><em><code>(blank)</code></em></td>
        </tr>
        <tr>
            <th><code>LesshintLinters</code></th>
            <td>Require paths of custom linters to add to the built-in list.</td>
            <td><em><code>(blank)</code></em></td>
        </tr>
    </tbody>
</table>

Note that to use special characters (such as `*` wildcards) in `LesshintExclude` you must escape the special characters.

```xml
<!-- Equivalent to "styles/external/*.less" -->
<LesshintExclude Include="styles/external/%2A.less" />
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
            <th><code>LesshintBreakBuildOnError</code></th>
            <td>Whether linting failures should break the build.</td>
            <td><code>false</code></td>
        </tr>
        <tr>
            <th><code>LesshintConfig</code></th>
            <td>Path to a specific .lesshintrc.</td>
            <td><em><code>(blank)</code></em></td>
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
            <th><code>LesshintExtraArgs</code></th>
            <td>Any extra arguments to pass to the Lesshint CLI.</td>
            <td><code>(blank)</code></td>
        </tr>
        <tr>
            <th><code>LesshintNodeExe</code></th>
            <td>Path to a Node executable to execute the runner script.</td>
            <td>The <code>tools\node-6.1.0.exe</code> in the package.</td>
        </tr>
        <tr>
            <th><code>LesshintVersion</code></th>
            <td>Glob filter for the version of Lesshint to use <em>(ignored if <code>LesshintConfig</code> is provided)</em>.</td>
            <td><code>*.*.*</code></td>
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
            <td>Lines of console output from the Lesshint CLI.</td>
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
