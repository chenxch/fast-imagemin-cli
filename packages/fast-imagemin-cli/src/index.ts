import { loadConfig } from 'unconfig'
import chalk from 'chalk'
import { Command } from 'commander'
import type { FmConfig } from './types/type'
import { compress } from './core/compress.js'
import { debug } from './core/utils.js'

const program = new Command()
program
  .option('-o, --force', 'compress force')
program.parse(process.argv)
const options = program.opts()

debug(chalk.yellowBright('---- fast imagemin ----'))

async function run() {
  debug('load config')
  const { config } = await loadConfig<FmConfig>({
    sources: [
      {
        files: 'fm.config',
        extensions: ['ts', 'mts', 'cts', 'js', 'mjs', 'cjs', 'json', ''],
      },
    ],
  })

  if (!config || !config.include || !config.include.length)
    debug(chalk.redBright('The fm.config configuration file is not found or the include configuration item is missing.'))

  await compress(config, options.force || false)
}

const timeLabel = `${chalk.green('[fast-imagemin-cli]')} time consuming to compress`
// eslint-disable-next-line no-console
console.time(timeLabel)
debug('compress start')
await run()
// eslint-disable-next-line no-console
console.timeEnd(timeLabel)
