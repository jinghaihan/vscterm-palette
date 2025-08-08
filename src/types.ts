import type { RgbaColor } from 'colord'
import type { ITERM_TO_VSC_COLOR_MAP } from './constants'

export interface CommonOptions {
  cwd?: string
  /**
   * Force to fetch from remote, even if the theme is already in cache
   */
  force?: boolean
}

export interface CommandOptions extends CommonOptions {
  /**
   * Path to the config file
   * @default 'vscterm.config.yaml'
   */
  config?: string
  /**
   * Path to the theme file support local or remote url
   */
  theme?: string[]
  /**
   * Convert to iterm theme
   */
  iterm?: boolean
  /**
   * Convert to tabby theme
   */
  tabby?: boolean
}

export type ConvertOptions = Required<CommandOptions> & {
  tabbyConfigPath: string
}

export type Theme = VscodeTheme | VscodeSchemes

export interface VscodeTheme {
  colors: VscodeColors
}

// https://github.com/mbadolato/iTerm2-Color-Schemes
export interface VscodeSchemes {
  'workbench.colorCustomizations': VscodeWorkbenchColors
}

export interface VscodeColors extends VscodeBaseColors {
  'editor.background'?: string
}

export interface VscodeWorkbenchColors extends VscodeBaseColors {
  'terminal.background'?: string
  'terminalCursor.background'?: string
  'terminalCursor.foreground'?: string
}

export interface VscodeBaseColors {
  'terminal.foreground'?: string
  'terminal.selectionBackground'?: string
  'terminal.ansiBlack'?: string
  'terminal.ansiBlue'?: string
  'terminal.ansiCyan'?: string
  'terminal.ansiGreen'?: string
  'terminal.ansiMagenta'?: string
  'terminal.ansiRed'?: string
  'terminal.ansiWhite'?: string
  'terminal.ansiYellow'?: string
  'terminal.ansiBrightBlack'?: string
  'terminal.ansiBrightBlue'?: string
  'terminal.ansiBrightCyan'?: string
  'terminal.ansiBrightGreen'?: string
  'terminal.ansiBrightMagenta'?: string
  'terminal.ansiBrightRed'?: string
  'terminal.ansiBrightWhite'?: string
  'terminal.ansiBrightYellow'?: string
}

export interface Colors {
  background?: string
  foreground?: string
  selectionBackground?: string
  ansiBlack?: string
  ansiBlue?: string
  ansiCyan?: string
  ansiGreen?: string
  ansiMagenta?: string
  ansiRed?: string
  ansiWhite?: string
  ansiYellow?: string
  ansiBrightBlack?: string
  ansiBrightBlue?: string
  ansiBrightCyan?: string
  ansiBrightGreen?: string
  ansiBrightMagenta?: string
  ansiBrightRed?: string
  ansiBrightWhite?: string
  ansiBrightYellow?: string
  cursorBackground?: string
  cursorForeground?: string
}

export type ItermColor = keyof typeof ITERM_TO_VSC_COLOR_MAP

export type ItermTheme = Record<ItermColor, RgbaColor>

export interface TabbyTheme {
  name: string
  foreground: string
  background: string
  selection: string
  cursor: string
  cursorAccent: string
  colors: string[]
}
