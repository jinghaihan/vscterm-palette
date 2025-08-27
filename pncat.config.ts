import { defineConfig, mergeCatalogRules } from 'pncat'

export default defineConfig({
  catalogRules: mergeCatalogRules([
    {
      name: 'node',
      match: ['yocto-spinner'],
    },
    {
      name: 'utils',
      match: ['colord', 'jsonc-parser'],
    },
  ]),
  postRun: 'eslint --fix "**/package.json" "**/pnpm-workspace.yaml"',
})
