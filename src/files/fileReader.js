import path from 'path'
import fs from 'fs/promises'
import { getIgnored, isSupported } from './ignoreAndSupport.js'

/**
 * Recursively reads a directory and returns all supported files.
 *
 * @param {string} directory - Absolute or relative path to the directory.
 * @param {string[]} ignoreFiles - List of absolute file paths to ignore.
 * @returns {Promise<import('../types.js').FileEntry[]>}
 * Array of file objects with absolute path and file name.
 */
async function readDirectory (directory, ignoreFiles) {
  const files = await fs.readdir(directory, { withFileTypes: true })
  const arrayOfFiles = []

  await Promise.all(files.map(async (file) => {
    const absolutePath = path.resolve(directory, file.name)
    if (ignoreFiles.includes(absolutePath)) {
      return
    }

    if (file.isDirectory()) {
      const subFiles = await readDirectory(absolutePath, ignoreFiles)
      arrayOfFiles.push(...subFiles)
    } else if (isSupported(absolutePath)) {
      arrayOfFiles.push({
        filePath: absolutePath,
        fileName: file.name
      })
    }
  }))

  return arrayOfFiles
}

/**
 * Returns all supported files under a path, applying ignore rules from a metrics ignore file.
 *
 * @param {string} path - Directory path to scan.
 * @param {string} [ignoreMetricsFilePath] - Path to `.metricsignore` file.
 * @returns {Promise<import('../types.js').FileEntry[]>}
 * List of files that are supported and not ignored.
 */
async function getFiles (path, ignoreMetricsFilePath) {
  const ignoreFiles = await getIgnored(ignoreMetricsFilePath)
  return await readDirectory(path, ignoreFiles)
}

export { getFiles }
