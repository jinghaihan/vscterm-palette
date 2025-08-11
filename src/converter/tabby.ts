import type { Colors, TabbyTheme } from '../types'
import { existsSync, mkdirSync } from 'node:fs'
import { readFile, writeFile } from 'node:fs/promises'
import process from 'node:process'
import c from 'ansis'
import { resolve } from 'pathe'
import { parse, stringify } from 'yaml'
import Spinner from 'yocto-spinner'
import { extractThemeName } from '../utils'

const tabbyTheme = new Map<string, TabbyTheme>()

export async function convertToTabbyTheme(name: string, colors: Colors, cwd: string): Promise<void> {
  const theme = {
    name,
    background: colors.background,
    foreground: colors.foreground,
    // selection: colors.selectionBackground,
    selection: null,
    cursor: colors.cursorBackground,
    cursorAccent: colors.cursorForeground,
    colors: [
      colors.ansiBlack,
      colors.ansiRed,
      colors.ansiGreen,
      colors.ansiYellow,
      colors.ansiBlue,
      colors.ansiMagenta,
      colors.ansiCyan,
      colors.ansiWhite,
      colors.ansiBrightBlack,
      colors.ansiBrightRed,
      colors.ansiBrightGreen,
      colors.ansiBrightYellow,
      colors.ansiBrightBlue,
      colors.ansiBrightMagenta,
      colors.ansiBrightCyan,
      colors.ansiBrightWhite,
    ],
  } as TabbyTheme

  const dir = resolve(cwd, 'themes/tabby')
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true })
  }

  tabbyTheme.set(name, theme)
  await writeFile(resolve(dir, `${name}.yaml`), stringify(theme))
}

export async function updateTabbyConfig(configPath: string, theme: string[]) {
  const spinner = Spinner({ text: 'Updating Tabby config...' }).start()
  try {
    spinner.text = 'Reading Tabby config...'
    const content = await readFile(configPath, 'utf-8')
    const config = parse(content)

    const themeNames = theme.map(path => extractThemeName(path))

    spinner.text = 'Backing up Tabby config...'
    // backup original config
    const backupPath = `${configPath}.backup`
    await writeFile(backupPath, content)

    const customColorSchemes = themeNames.map((name) => {
      const theme = tabbyTheme.get(name)
      if (!theme) {
        spinner.error(c.red(`Theme ${name} not found`))
        process.exit(1)
      }
      return theme
    })

    if (Array.isArray(config.terminal.customColorSchemes)) {
      config.terminal.customColorSchemes = config.terminal.customColorSchemes.filter((i: TabbyTheme) => !themeNames.includes(i.name))
    }

    config.terminal.customColorSchemes = [
      ...(config.terminal.customColorSchemes ?? []),
      ...customColorSchemes,
    ]

    spinner.text = 'Updating Tabby config...'
    await writeFile(configPath, stringify(config))
    spinner.success(c.green('Tabby config updated successfully'))
  }
  catch (error) {
    spinner.error(c.red(error instanceof Error ? error.message : String(error)))
    process.exit(1)
  }
}
