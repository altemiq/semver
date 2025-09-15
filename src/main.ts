import * as core from '@actions/core'
import { exec } from '@actions/exec'
import { getVersionSuffix } from './version.js'
import { homedir } from 'os'
import { join } from 'path'

/**
 * The main function for the action.
 *
 * @returns Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const workingDirectory: string = core.getInput('workingDirectory')
    if (workingDirectory) {
      core.info(`changing directory to ${workingDirectory}`)
      process.chdir(workingDirectory)
    }

    // install semver
    const installArgs: string[] = [
      'tool',
      'install',
      '-g',
      'Altemiq.SemanticVersioning'
    ]
    const toolVersion: string = core.getInput('toolVersion')
    if (toolVersion) {
      installArgs.push('--version', toolVersion)
    }

    const source: string = core.getInput('source')
    if (source) {
      installArgs.push('--add-source', source)
    }

    const configFile: string = core.getInput('configfile')
    if (configFile) {
      installArgs.push('--configfile', configFile)
    }

    const exitCode: number = await exec('dotnet', installArgs, {
      ignoreReturnCode: true
    })

    if (exitCode > 1) {
      core.setOutput('dotnet tool install failed.', exitCode)
    }

    // Collect a JSON string of all the version properties.
    const args: string[] = ['diff', 'solution']
    const solution: string = core.getInput('solution')
    if (solution) {
      args.push(solution)
    }

    const defaultBranch: boolean = core.getBooleanInput('isDefaultBranch')
    if (defaultBranch) {
      args.push('--no-version-suffix')
    }

    const versionSuffix: string | undefined = getVersionSuffix(
      core.getInput('versionSuffix')
    )
    if (versionSuffix) {
      args.push('--version-suffix', versionSuffix)
    }

    if (source) {
      args.push('--source', source)
    }

    const increment: string = core.getInput('increment')
    if (increment) {
      args.push('--increment', increment)
    }

    args.push(
      '--output',
      'Json',
      '--direct-download',
      '--package-id-regex',
      core.getInput('packageIdRegex'),
      '--package-id-replace',
      core.getInput('packageIdReplace'),
      '--nologo'
    )

    const toolPath: string = join(
      homedir(),
      '.dotnet',
      'tools',
      'dotnet-semver'
    )

    let versionJson = ''
    await exec(toolPath, args, {
      listeners: {
        stdout: (data: Buffer) => {
          versionJson += data.toString()
        }
      }
    })

    core.setOutput('versionJson', versionJson)

    // Break up the JSON into individual outputs.
    const versionProperties = JSON.parse(versionJson)
    for (const name in versionProperties) {
      core.setOutput(name, versionProperties[name])
    }
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
