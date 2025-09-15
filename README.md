# GitHub Action for Semantic Versioning

[![GitHub Super-Linter](https://github.com/altemiq/semver/actions/workflows/linter.yml/badge.svg)](https://github.com/super-linter/super-linter)
![CI](https://github.com/altemiq/semver/actions/workflows/ci.yml/badge.svg)
[![Check dist/](https://github.com/altemiq/semver/actions/workflows/check-dist.yml/badge.svg)](https://github.com/actions/typescript-action/actions/workflows/check-dist.yml)
[![CodeQL](https://github.com/altemiq/semver/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/actions/typescript-action/actions/workflows/codeql-analysis.yml)
[![Coverage](./badges/coverage.svg)](./badges/coverage.svg)

This action installs the CLI for
[Altemiq.SemanticVersioning](https://github.com/altemiq/nuget-semver) and
exposes version data from it as action outputs.

## Inputs

All inputs are optional.

| Name               | Default         | Description                                                                                                                                                                         |
| ------------------ | --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `source`           | null            | The NuGet source that contains the tool as well as the packges to be versioned.                                                                                                     |
| `configfile`       | null            | The NuGet configuration file to use.                                                                                                                                                |
| `toolVersion`      | latest stable   | The version of the semantic version dotnet command-line tool to install and use. If not specified, the default is the latest stable version.                                        |
| `solution`         | repository root | The path to the solution.                                                                                                                                                           |
| `isDefaultBranch`  | false           | Whether the current branch is the default branch. Forces there to be no version suffix. This overrides `versionSuffix`.                                                             |
| `versionSuffix`    | null            | The prerelease value. If none is specified, the prerelease from the previous version is used.                                                                                       |
| `increment`        | 'Patch'         | Sets the location for the version increment. Can be either `Patch` to increment the patch value, or `ReleaseLabel` to increment the release label. Only valid for version >= 1.0.82 |
| `packageIdRegex`   | ''              | The regular expression to match in the package ID                                                                                                                                   |
| `packageIdReplace` | ''              | The text used to replace the match from `packageIdRegex`                                                                                                                            |
| `workingDirectory` | null            | The working directory to operate in. Only valid for version >= 2.2.0                                                                                                                |

## Outputs

| Name          | Description                                              |
| ------------- | -------------------------------------------------------- |
| Version       | The full representation of the version include metadata. |
| VersionPrefix | The four integer version.                                |
| VersionSuffix | The metadata version.                                    |

## Example usage

### Using step outputs

```yaml
- uses: altemiq/semver@v1
  id: semver
  with:
    source: https://nuget.pkg.github.com/<ORG>/index.json
    configfile: ${{ github.workspace }}/src/nuget.config
    solution: ${{ env.SOLUTION_PATH }}
    isDefaultBranch: false
    versionSuffix: ${{ github.ref }}
    increment: ReleaseLabel
    workingDirectory: ${{ github.workspace }}

- run: |
    echo 'Version: ${{ steps.semver.outputs.Version }}'
```

## Creating new version

Details on versioning can be found here:
[Action Versioning](https://github.com/actions/toolkit/blob/main/docs/action-versioning.md)
Create a new release using the UI. Version format should be `v2.x.x`. Creating a
new major version requires reaction from users and should be done only with
breaking changes. Once the new release is created, the v2 tag needs to be
updated as well.

```bash
git tag -fa v2 -m "Update v2 tag"
git push origin v2 --force
```
