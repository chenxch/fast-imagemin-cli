import path from 'node:path'
import fs from 'node:fs'
import chalk from 'chalk'
import imagemin from 'imagemin'
import ora from 'ora'
import type { FmConfig } from '../types/type'
import { getImageminPlugins } from './plugins.js'
import { debug, getHashOfFile, isImageExp, walkSync } from './utils.js'

const RecordFilePath = path.resolve(process.cwd(), 'fm-record.json')

interface TinyInfo { relativePath: string; size: number; oldSize: number; ratio: number; 'time(ms)': number }

let oldTinyMap: Map<string, TinyInfo>
const tinyMap = new Map<string, TinyInfo>()

fs.access(RecordFilePath, fs.constants.F_OK, (err) => {
  if (!err) {
    const rawdata = fs.readFileSync(RecordFilePath)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const fmRecord = JSON.parse(rawdata)
    oldTinyMap = new Map(Object.entries(fmRecord))
  }
  else {
    oldTinyMap = new Map()
  }
})

async function processFile(plugins: imagemin.Plugin[], filePath: string, buffer: Buffer): Promise<boolean> {
  let content: Buffer

  const ts = Date.now()

  try {
    const files = await imagemin([filePath], {
      destination: path.dirname(filePath),
      plugins,
    })
    content = files[0].data

    const size = content.byteLength
    const oldSize = buffer.byteLength

    tinyMap.set(getHashOfFile(filePath), {
      'relativePath': path.relative(process.cwd(), filePath).replace(/\\/g, '/'),
      'size': size / 1024,
      'oldSize': oldSize / 1024,
      'ratio': size / oldSize - 1,
      'time(ms)': (Date.now() - ts),
    })
    return true
  }
  catch (error) {
    console.error(`imagemin error:${filePath}`)
    return false
  }
}

export async function compress(config: FmConfig, force = false) {
  const { include, options } = config
  const includeArr = Array.isArray(include) ? include : [include]
  const filePaths: string[] = []
  includeArr.forEach((targetDir) => {
    const currentDirPath = path.resolve(process.cwd(), targetDir)
    walkSync(currentDirPath, (filePath: string, dirent: fs.Dirent) => {
      if (isImageExp(dirent.name)) {
        const hash = getHashOfFile(filePath)
        if (force || !oldTinyMap.has(hash))
          filePaths.push(filePath)
      }
    })
  })

  if (filePaths.length > 0) {
    const plugins = getImageminPlugins(options)
    if (plugins.length === 0) {
      debug(chalk.redBright('Please configure at least one compression configuration parameter.'))
      return
    }
    const tasks = filePaths.map(filePath => Promise.resolve(processFile(plugins!, filePath, fs.readFileSync(filePath))))
    const spinner = ora({ text: chalk.bold.yellow('compressing...'), color: 'yellow' }).start()

    await Promise.all(tasks).then((results) => {
      spinner.stop()
      const total = results.length
      const success = results.filter(result => result).length
      const fail = total - success
      debug(`compress results: total: ${chalk.bold.blue(total)} success: ${chalk.bold.green(success)} fail: ${chalk.bold.red(fail)}`)
      // eslint-disable-next-line no-console
      console.table(Array.from(tinyMap.values()), ['relativePath', 'oldSize', 'size', 'ratio', 'time(ms)'])
      Array.from(tinyMap.entries()).forEach(([key, value]) => {
        oldTinyMap.set(key, value)
      })
      fs.writeFileSync(RecordFilePath, JSON.stringify(Object.fromEntries(oldTinyMap.entries()), null, '\t'))
    })
  }
  else {
    debug('no file need to compress')
  }
}

