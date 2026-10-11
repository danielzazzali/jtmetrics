import { afterAll, beforeAll, describe, expect, it } from '@jest/globals'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { parse } from '@babel/parser'
import { BABEL_PARSER_OPTIONS, FILE_ENCODING } from '../../src/constants/constants.js'
import { constructASTs } from '../../src/ast/astProcessor.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const nestFileName = 'temp_nest_decorators.js'
const nestFilePath = path.join(__dirname, nestFileName)
const nestCodeContent = `import { Injectable } from '@nestjs/common'

@Injectable()
export class CatsService {
  repo = new Map()
}
`

const optionsWithoutNewPlugins = {
  ...BABEL_PARSER_OPTIONS,
  plugins: BABEL_PARSER_OPTIONS.plugins.filter((plugin) => plugin !== 'decorators-legacy' && plugin !== 'classProperties')
}

describe('babel parser plugins for decorators and class fields', () => {
  beforeAll(() => {
    fs.writeFileSync(nestFilePath, nestCodeContent, FILE_ENCODING)
  })

  afterAll(() => {
    if (fs.existsSync(nestFilePath)) {
      fs.unlinkSync(nestFilePath)
    }
  })

  it('parses NestJS-style decorators and class fields with the configured options', async () => {
    const results = await constructASTs([{ filePath: nestFilePath, fileName: nestFileName }])
    expect(results).toHaveLength(1)
  })

  it('fails to parse the same code without decorators-legacy and classProperties', () => {
    expect(() => parse(nestCodeContent, optionsWithoutNewPlugins)).toThrow()
  })
})
