import type { Colors } from './types'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'pathe'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export const CACHE_DIR = resolve(__dirname, '../cache')

export const ITERM_TO_VSC_COLOR_MAP: Record<string, keyof Colors> = {
  'Background Color': 'background',
  'Foreground Color': 'foreground',
  'Ansi 0 Color': 'ansiBlack',
  'Ansi 1 Color': 'ansiRed',
  'Ansi 2 Color': 'ansiGreen',
  'Ansi 3 Color': 'ansiYellow',
  'Ansi 4 Color': 'ansiBlue',
  'Ansi 5 Color': 'ansiMagenta',
  'Ansi 6 Color': 'ansiCyan',
  'Ansi 7 Color': 'ansiWhite',
  'Ansi 8 Color': 'ansiBrightBlack',
  'Ansi 9 Color': 'ansiBrightRed',
  'Ansi 10 Color': 'ansiBrightGreen',
  'Ansi 11 Color': 'ansiBrightYellow',
  'Ansi 12 Color': 'ansiBrightBlue',
  'Ansi 13 Color': 'ansiBrightMagenta',
  'Ansi 14 Color': 'ansiBrightCyan',
  'Ansi 15 Color': 'ansiBrightWhite',
  'Cursor Color': 'cursorBackground',
  'Cursor Text Color': 'cursorForeground',
  'Selection Color': 'selectionBackground',
  'Selected Text Color': 'background',
  'Link Color': 'ansiRed',
} as const
