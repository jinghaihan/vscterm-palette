import type { RgbaColor } from 'colord'
import type { Colors, ItermTheme } from '../types'
import { existsSync, mkdirSync } from 'node:fs'
import { writeFile } from 'node:fs/promises'
import { colord } from 'colord'
import { resolve } from 'pathe'
import { ITERM_TO_VSC_COLOR_MAP } from '../constants'

export async function convertToItermTheme(name: string, colors: Colors, cwd: string): Promise<void> {
  const itermTheme: ItermTheme = {}
  for (const [itermColorName, vscColorName] of Object.entries(ITERM_TO_VSC_COLOR_MAP)) {
    const hex = colors[vscColorName]!
    itermTheme[itermColorName] = hexToItermColor(hex)
  }

  const dir = resolve(cwd, 'themes/iterm')
  if (!existsSync(dir))
    mkdirSync(dir, { recursive: true })

  await writeItermTheme(itermTheme, resolve(dir, `${name.toLowerCase()}.itermcolors`))
}

function hexToItermColor(vscColor: string): RgbaColor {
  const color = colord(vscColor)

  return {
    r: color.rgba.r / 255,
    g: color.rgba.g / 255,
    b: color.rgba.b / 255,
    a: color.rgba.a,
  }
}

async function writeItermTheme(theme: ItermTheme, name: string): Promise<void> {
  await writeFile(name, itermThemeToXml(theme), 'utf-8')
}

/**
 * Credit to @HiDeoo
 * https://github.com/HiDeoo/iTerm2-theme-vitesse/blob/main/src/libs/iterm.ts
 */
function itermThemeToXml(itermTheme: ItermTheme) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
${Object.entries(itermTheme)
  .map(
    ([name, color]) => `  <key>${name}</key>
  <dict>
    <key>Alpha Component</key>
    <real>${color.a}</real>
    <key>Blue Component</key>
    <real>${color.b}</real>
    <key>Color Space</key>
    <string>sRGB</string>
    <key>Green Component</key>
    <real>${color.g}</real>
    <key>Red Component</key>
    <real>${color.r}</real>
  </dict>
`,
  )
  .join('')}
</dict>
</plist>
`
}
