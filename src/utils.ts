export function isUrl(url: string) {
  return url.startsWith('http')
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
  // Replace github.com with raw.githubusercontent.com
  let normalizedUrl = url.replace('https://github.com/', 'https://raw.githubusercontent.com/')
  // Remove /blob/ from the path
  normalizedUrl = normalizedUrl.replace('/blob/', '/')

  return normalizedUrl
}

export function extractThemeName(theme: string) {
  if (isUrl(theme)) {
    return theme.split('/').pop()?.replace('.json', '') || 'theme'
  }

  if (theme.endsWith('.json'))
    return theme.replace('.json', '')

  return theme
}
