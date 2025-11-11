import { parse } from 'jsonc-parser'

const HTTP_REGEX = /^https?:\/\/.*$/

export function jsonParse(content: string) {
  return parse(content)
}

export function isHttpUrl(url: string) {
  return HTTP_REGEX.test(url)
}

export function isGithubUrl(url: string) {
  return url.startsWith('https://github.com/')
}

export function normalizeUrl(url: string) {
  if (isGithubUrl(url))
    return normalizeGithubUrl(url)
  else
    return url
}

export function normalizeGithubUrl(url: string) {
  return url
    // Replace github.com with raw.githubusercontent.com
    .replace('https://github.com/', 'https://raw.githubusercontent.com/')
    // Remove /blob/ from the path
    .replace('/blob/', '/')
}

export function extractThemeName(theme: string) {
  if (isHttpUrl(theme))
    return theme.split('/').pop()?.replace('.json', '') || 'theme'
  if (theme.endsWith('.json'))
    return theme.replace('.json', '')
  return theme
}
