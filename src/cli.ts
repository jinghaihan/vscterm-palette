import type { CAC } from 'cac'
import type { CommandOptions } from './types'
import process from 'node:process'
import c from 'ansis'
import { cac } from 'cac'
import Spinner from 'yocto-spinner'
import { name, version } from '../package.json'
import { resolveConfig } from './config'
import { convertToItermTheme } from './converter/iterm'
import { convertToTabbyTheme, updateTabbyConfig } from './converter/tabby'
import { extractThemeName } from './utils'
import { getVscColors } from './vsc'

try {
  const cli: CAC = cac()

  cli.command('')
    .option('--config <path>', 'Path to the config file', { default: 'vscterm.config.yaml' })
    .option('--theme <paths...>', 'Path to the theme file, local or remote url')
    .option('--iterm', 'Convert to iterm theme')
    .option('--tabby', 'Convert to tabby theme')
    .option('--force', 'Force to fetch from remote', { default: false })
    .action(async (options: CommandOptions) => {
      console.log(`${c.yellow(name)} ${c.dim(`v${version}`)}`)
      console.log()

      const config = await resolveConfig(options)

      for (const theme of config.theme) {
        const name = extractThemeName(theme)
        const colors = await getVscColors(theme, config.force)
        const spinner = Spinner({ text: `${c.yellow(name)} Converting...` }).start()

        try {
          if (config.iterm) {
            await convertToItermTheme(name, colors, config.cwd)
            spinner.text = `${c.green(`${name} theme converted to iTerm theme.`)}`
          }

          if (config.tabby) {
            await convertToTabbyTheme(name, colors, config.cwd)
            spinner.text = `${c.green(`${name} theme converted to Tabby theme.`)}`
          }
        }
        catch (error) {
          spinner.error(c.red(error instanceof Error ? error.message : String(error)))
        }
        finally {
          spinner.success(`${c.green(`${name} theme converted.`)}`)
        }
      }

      if (config.tabbyConfigPath)
        await updateTabbyConfig(config.tabbyConfigPath, config.theme)
    })

  cli.help()
  cli.version(version)
  cli.parse()
}
catch (error) {
  console.error(error)
  process.exit(1)
}
