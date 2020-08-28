const core = require('@actions/core')
const github = require('@actions/github')
const fs = require('fs')
const path = require('path')
const { getSuggestions, applySuggestion } = require('./suggestions')
const { stripMarkdown } = require('./content')

const apiKey = core.getInput('pro-writing-aid-api-key')
const filePaths = core.getInput('file-paths')
const basePath = process.env.GITHUB_WORKSPACE

const formattedFilePaths = filePaths.split("' '").map((path) => path.replace(/(^'|'$)/g, ''))
console.log('Files to check:')
formattedFilePaths.forEach(fileName => console.log(fileName))

formattedFilePaths.forEach((filePath) => {
  console.log(`Checking file: "${filePath}"`)

  fs.readFile(path.join(basePath, filePath), 'utf8', function(fileReadErr, contents) {
    if (fileReadErr) return core.setFailed(fileReadErr.message)

    stripMarkdown(contents)
    .then((strippedContent) => {
      return getSuggestions(strippedContent, apiKey).then((suggestions) => {
        if (suggestions.length !== 0) {
          const [hintedText, _offset] = suggestions.reduce(applySuggestion, [strippedContent, 0])
          console.log(hintedText)
          core.setFailed('Please take a look at the suggestions noted above')
        } else {
          console.log('No grammar suggestions! You are good to go')
        }
      })
    }).catch(grammarApiError => core.setFailed(grammarApiError.message))
  })
})
