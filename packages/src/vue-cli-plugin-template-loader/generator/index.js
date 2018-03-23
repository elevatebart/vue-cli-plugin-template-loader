const extractParts = require('../lib/sfcSplitter')

module.exports = api => {
  // transform .vue files into a folder with the same name containing
  // index.ts
  // style.css
  // template.html
  const vueRE = /\.vue$/
  api.postProcessFiles(files => {
    let classComponent
    if (files['tsconfig.json']) {
      const tsconfig = JSON.parse(files['tsconfig.json'])
      // if it has experimentalDecorators it probably has classComponent as well
      classComponent = tsconfig.compilerOptions.experimentalDecorators
      delete tsconfig.include
      files['tsconfig.json'] = JSON.stringify(tsconfig, null, 2)
    }
    for (const file in files) {
      if (vueRE.test(file)) {
        const parts = extractParts(files[file], classComponent)
        const componentPath = file.replace(vueRE, '')
        files[componentPath + '/index.' + parts.scriptExt] = parts.script
        files[componentPath + '/style.' + parts.styleExt] = parts.style
        // assets in html templates will need to be rerouted.
        // Indeed, we change their relative path
        const template = parts.template.replace(/'\.\/assets\//, "'../assets/")
        files[componentPath + '/template.' + parts.templateExt] = template
        delete files[file]
      }
    }
  })

  // fix unit tests import paterns from
  // import foo from 'path/foo.vue'
  // into
  // import foo from 'path/foo'
  const tsFileRE = /\.ts$/
  const tsExcludeRE = /main.ts$/
  const importRelativeVueRE = /(\r\n|\r|\n)import (\w+) from '\.\/([^]+).vue';?(\r\n|\r|\n)/g
  const importVueRE = /(\r\n|\r|\n)import (\w+) from '([^]+).vue';?(\r\n|\r|\n)/g
  api.postProcessFiles(files => {
    for (const file in files) {
      if (tsFileRE.test(file)) {
        let content = files[file]
        if (!tsExcludeRE.test(file)) {
          content = content.replace(importRelativeVueRE, "$1import $2 from '../$3'$4")
        }
        content = content.replace(importVueRE, "$1import $2 from '$3'$4")
        files[file] = content
      }
    }
  })

  api.render('./template')
}
