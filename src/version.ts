/**
 * Gets the version suffix
 *
 * @param versionSuffix The raw version suffix
 * @returns The processed version suffix
 */
export function getVersionSuffix(versionSuffix: string): string | undefined {
  if (versionSuffix === '' || versionSuffix === null) {
    return undefined
  }

  if (versionSuffix.startsWith('refs/')) {
    versionSuffix = versionSuffix.replace('refs/heads/', '')
  } else if (versionSuffix.startsWith('\\refs\\')) {
    versionSuffix = versionSuffix.replace('\\refs\\heads\\', '')
  }

  if (versionSuffix.includes('/')) {
    versionSuffix = versionSuffix.replace('/', '+')
  } else if (versionSuffix.includes('\\')) {
    versionSuffix = versionSuffix.replace('\\', '+')
  }

  return versionSuffix
}
