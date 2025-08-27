import type { Colors, Theme, VscodeSchemes, VscodeTheme } from './types'
import { existsSync, mkdirSync } from 'node:fs'
import { readFile, writeFile } from 'node:fs/promises'
import process from 'node:process'
import c from 'ansis'
import { resolve } from 'pathe'
import Spinner from 'yocto-spinner'
import { CACHE_DIR } from './constants'
import { extractThemeName, isHttpUrl, jsonParse, normalizeUrl } from './utils'

export async function getVscColors(path: string, force: boolean): Promise<Colors> {
  const theme = await fetchVscTheme(path, force)

  if ((theme as VscodeTheme).colors)
    return extractFromVscodeTheme(theme as VscodeTheme)
  else
    return extractFromVscodeSchemesTheme(theme as VscodeSchemes)
}

export function extractFromVscodeTheme(theme: VscodeTheme): Colors {
  const colors = theme.colors
  if (!colors) {
    console.error(c.red('Theme does not contain colors'))
    process.exit(1)
  }

  return {
    background: colors['editor.background'],
    foreground: colors['terminal.foreground'] || colors['editor.foreground'],
    selectionBackground: colors['terminal.selectionBackground'] || colors['editor.background'],
    cursorBackground: colors['terminal.foreground'] || colors['editor.foreground'],
    cursorForeground: colors['editor.background'],
    ansiBlack: colors['terminal.ansiBlack'],
    ansiBlue: colors['terminal.ansiBlue'],
    ansiCyan: colors['terminal.ansiCyan'],
    ansiGreen: colors['terminal.ansiGreen'],
    ansiMagenta: colors['terminal.ansiMagenta'],
    ansiRed: colors['terminal.ansiRed'] || colors['editorError.foreground'],
    ansiWhite: colors['terminal.ansiWhite'],
    ansiYellow: colors['terminal.ansiYellow'] || colors['editorWarning.foreground'],
    ansiBrightBlack: colors['terminal.ansiBrightBlack'],
    ansiBrightBlue: colors['terminal.ansiBrightBlue'],
    ansiBrightCyan: colors['terminal.ansiBrightCyan'],
    ansiBrightGreen: colors['terminal.ansiBrightGreen'],
    ansiBrightMagenta: colors['terminal.ansiBrightMagenta'],
    ansiBrightRed: colors['terminal.ansiBrightRed'],
    ansiBrightWhite: colors['terminal.ansiBrightWhite'],
    ansiBrightYellow: colors['terminal.ansiBrightYellow'],
  }
}

export function extractFromVscodeSchemesTheme(theme: VscodeSchemes): Colors {
  const colors = theme['workbench.colorCustomizations']
  if (!colors) {
    console.error(c.red('Theme does not contain colors'))
    process.exit(1)
  }

  return {
    background: colors['terminal.background'],
    foreground: colors['terminal.foreground'],
    selectionBackground: colors['terminal.selectionBackground'] || colors['terminal.background'],
    cursorBackground: colors['terminalCursor.background'] || colors['terminal.foreground'],
    cursorForeground: colors['terminalCursor.foreground'] || colors['terminal.background'],
    ansiBlack: colors['terminal.ansiBlack'],
    ansiBlue: colors['terminal.ansiBlue'],
    ansiCyan: colors['terminal.ansiCyan'],
    ansiGreen: colors['terminal.ansiGreen'],
    ansiMagenta: colors['terminal.ansiMagenta'],
    ansiRed: colors['terminal.ansiRed'],
    ansiWhite: colors['terminal.ansiWhite'],
    ansiYellow: colors['terminal.ansiYellow'],
    ansiBrightBlack: colors['terminal.ansiBrightBlack'],
    ansiBrightBlue: colors['terminal.ansiBrightBlue'],
    ansiBrightCyan: colors['terminal.ansiBrightCyan'],
    ansiBrightGreen: colors['terminal.ansiBrightGreen'],
    ansiBrightMagenta: colors['terminal.ansiBrightMagenta'],
    ansiBrightRed: colors['terminal.ansiBrightRed'],
    ansiBrightWhite: colors['terminal.ansiBrightWhite'],
    ansiBrightYellow: colors['terminal.ansiBrightYellow'],
  }
}

export async function fetchVscTheme(path: string, force: boolean): Promise<Theme> {
  const isLocal = !isHttpUrl(path)
  if (isLocal)
    return await fetchLocalTheme(path)
  else
    return await fetchRemoteTheme(path, force)
}

async function fetchLocalTheme(theme: string): Promise<Theme> {
  if (!theme.endsWith('.json'))
    theme = resolve(`${theme}.json`)

  const path = resolve(theme)
  const spinner = Spinner({ text: `Loading theme from ${path}...` }).start()

  try {
    const content = await readFile(path, 'utf-8')
    const theme = jsonParse(content)
    spinner.success('Theme loaded successfully')
    return theme
  }
  catch (error) {
    spinner.error(c.red(error instanceof Error ? error.message : String(error)))
    process.exit(1)
  }
}

async function fetchRemoteTheme(theme: string, force: boolean): Promise<Theme> {
  const url = normalizeUrl(theme)
  const spinner = Spinner({ text: `Loading theme from ${url}...` }).start()

  try {
    const name = extractThemeName(url)
    // check cache
    const cachePath = resolve(CACHE_DIR, `${name}.json`)
    if (existsSync(cachePath) && !force) {
      const content = await readFile(cachePath, 'utf-8')
      const theme = jsonParse(content)
      spinner.success('Theme loaded successfully from cache')
      return theme
    }

    // fetch from remote
    const response = await fetch(url)
    const content = await response.text()
    spinner.success('Theme loaded successfully')

    // write to cache
    if (!existsSync(CACHE_DIR))
      mkdirSync(CACHE_DIR, { recursive: true })
    await writeFile(cachePath, content)
    const theme = jsonParse(content)
    return theme
  }
  catch (error) {
    spinner.error(c.red(error instanceof Error ? error.message : String(error)))
    process.exit(1)
  }
}
