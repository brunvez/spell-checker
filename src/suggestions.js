module.exports = { getSuggestions, applySuggestion }

const ProWritingAidApi = require('pro_writing_aid_api')

function getSuggestions(text, apiKey) {
  return new Promise((resolve, reject) => {
    const api = new ProWritingAidApi.TextApi()
    api.apiClient.basePath = "https://api.prowritingaid.com"
    api.apiClient.defaultHeaders = { 'licenseCode': apiKey }
    var request = new ProWritingAidApi.TextAnalysisRequest(
      String(text),
      ['grammar'],
      "General",
      "En"
    )
    api.post(request)

    .then(function(data) {
      resolve(data['Result']['Tags'])
    }, function(error) {
      reject(error)
    })
  })
}

function applySuggestion([text, offset], { startPos, endPos, hint, suggestions }) {
  startPos = startPos + offset
  endPos = endPos + offset + 1
  const textToCorrect = text.substring(startPos, endPos)
  const hintedText = createSuggestion(textToCorrect, hint, (suggestions || [])[0])
  const preText = text.substring(0, startPos)
  const postText = text.substring(endPos, text.length)

  return [preText + hintedText + postText, offset + hintedText.length - textToCorrect.length]
}

function createSuggestion(textToCorrect, hint, possibleCorrection) {
  const correction = !!possibleCorrection ? `${hint}. Suggestion: "${possibleCorrection}"` : hint
  return redText(textToCorrect) + " " + redText(underlinedText(`(${correction})`))
}

function redText(text) {
  return "\033[31;1m" + text + "\033[0m"
}

function underlinedText(text) {
  return "\033[4m" + text + "\033[0m"
}
