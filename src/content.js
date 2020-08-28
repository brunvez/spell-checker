module.exports =  { stripMarkdown }

const remark = require('remark')
const strip = require('strip-markdown')

function stripMarkdown(fileContents) {
  return new Promise((resolve, reject) => {
    remark()
    .use(strip)
    .process(fileContents, (error, file) => {
      if (error) return reject(error)

      resolve(String(file))
    })
  })
}
