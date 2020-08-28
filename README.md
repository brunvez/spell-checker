# Markdown Spell Checker action

This action calls the ProWritingAid API with markdown files and

## Inputs

### `pro-writing-aid-api-key`

**Required** The API key to call ProWritingAid.

### `file-paths`

**Required** The md files to check spelling.

## Example usage

```yml
name: Spell checking
on: [pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: technote-space/get-diff-action@v3
        with:
          SUFFIX_FILTER: .md
      - name: Check spelling
        uses: brunvez/spell-checker@master
        with:
          pro-writing-aid-api-key: ${{ secrets.PRO_WRITING_AID_API_KEY }}
          file-paths: ${{ env.GIT_DIFF_FILTERED }}
```
