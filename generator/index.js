const extractParts = require('../sfcSplitter')

module.exports = api => {
  const typescript = api.hasPlugin('typescript')
  const classComponent = typescript && api.rootOptions.classComponent

  // transform vue files into a folder with the same name containing
  // index.ts
  // style.css
  // template.html
  const vueRE = /\.vue$/
  api.postProcessFiles(files => {
    for (const file in files) {
      if (vueRE.test(file)) {
        const parts = extractParts(files[file], classComponent)
        const componentPath = file.replace(vueRE, '')
        files[componentPath + '/index.' + parts.scriptExt] = parts.script
        files[componentPath + '/template.html'] = parts.template
        files[componentPath + '/style.' + parts.styleExt] = parts.style
        delete files[file]
      }
    }
  })

  // fix unit tests import paterns from
  // import foo from 'foo.vue'
  // into
  // import foo from 'foo'
  const tsFileRE = /\.ts$/
  const tsExcludeRE = /main.ts$/
  const importRelativeVueRE = /(\r\n|\r|\n)import (\w+) from '\.\/([^]+).vue'(\r\n|\r|\n)/g
  const importVueRE = /(\r\n|\r|\n)import (\w+) from '([^]+).vue'(\r\n|\r|\n)/g
  api.postProcessFiles(files => {
    for (const file in files) {
      if (tsFileRE.test(file) && !tsExcludeRE.test(file)) {
        let content = files[file].replace(importRelativeVueRE, '$1import $2 from \'../$3\'$4')
        content = content.replace(importVueRE, '$1import $2 from \'$3\'$4')
        files[file] = content
      }
    }
  })

  const hasJest = api.hasPlugin('unit-jest')
  const hasMocha = api.hasPlugin('unit-mocha')

  api.render('./template', {
    isTest: process.env.VUE_CLI_TEST || process.env.VUE_CLI_DEBUG,
    hasMocha,
    hasJest
  })
}
