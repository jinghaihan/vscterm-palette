import type { CommandOptions, ConvertOptions } from './types'
import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import process from 'node:process'
import { join } from 'pathe'
import { parse } from 'yaml'

export async function resolveConfig(options: CommandOptions): Promise<ConvertOptions> {
  options.cwd = options.cwd || process.cwd()
  options.force = typeof options.force === 'boolean' ? options.force : false

  options.iterm = typeof options.iterm === 'boolean' ? options.iterm : false
  options.tabby = typeof options.tabby === 'boolean' ? options.tabby : false

  if (options.theme) {
    options.theme = Array.isArray(options.theme) ? options.theme : [options.theme]
  }

  if (!options.iterm && !options.tabby) {
    throw new Error('Please specify the target format with --iterm or --tabby')
  }

  // merge config file
  const configPath = join(options.cwd, options.config || 'vscterm.config.yaml')
  if (existsSync(configPath)) {
    const configContent = parse(await readFile(configPath, 'utf-8'))
    if (Array.isArray(configContent.themes)) {
      options.theme = [...new Set([...(options.theme || []), ...configContent.themes])]
    }

    // will auto update tabby config.yaml
    (options as ConvertOptions).tabbyConfigPath = configContent.tabbyConfig || ''
  }

  if (!options.theme || options.theme.length === 0) {
    throw new Error('Please specify the path to the theme file with --theme')
  }

  return options as ConvertOptions
}
