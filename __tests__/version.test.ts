/**
 * Unit tests for src/version.ts
 */
import { getVersionSuffix } from '../src/version.js'

describe('version.ts', () => {
  it('Gets the correct branch name', async () => {
    expect(getVersionSuffix('refs/heads/develop')).toBe('develop')
  })

  it('gets the correct branch name with back slash', () => {
    expect(getVersionSuffix('\\refs\\heads\\develop')).toBe('develop')
  })

  it('gets the correct branch name from a feature branch', () => {
    expect(getVersionSuffix('refs/heads/feature/action')).toBe('feature+action')
  })
})
