module.exports = (content, classComponent) => {
  const templateRE = /<template( lang="([a-z]+)")?>([^]*?)<\/template>/
  let template = ''
  let templateExt = 'html'
  if (templateRE.test(content)) {
    const templateObj = templateRE.exec(content)
    template = templateObj[3].trim() || ''
    templateExt = templateObj[2] || templateExt
  }

  const styleRE = /<style( scoped)?( lang="([a-z]+)")?>([^]*?)<\/style>/
  let style = ''
  let styleExt = 'css'
  if (styleRE.test(content)) {
    const styleObj = styleRE.exec(content)
    style = styleObj[4].trim()
    styleExt = (styleObj[3] || styleExt).trim()
  }

  const scriptRE = /<script( lang="([a-z]+)")?>([^]*?)<\/script>/
  const templateString = template.length
    ? './template.' +
      templateExt +
      (style.length ? '?style=./style.' + styleExt : '')
    : ''
  const additionalScript = `import WithRender from '${templateString}'\n`
  let script = ''
  let scriptExt = 'js'
  if (scriptRE.test(content)) {
    const scriptObj = scriptRE.exec(content)
    script = scriptObj[3]
    scriptExt = (scriptObj[2] || scriptExt).trim()
    if (classComponent) {
      script = script.replace(
        /(\r\n|\r|\n)[ ,\t]*export /,
        '$1@WithRender$1export '
      )
    } else {
      if (scriptExt === 'ts') {
        script = script.replace(
          /(\r\n|\r|\n)\W*export default Vue.extend\(/,
          '$1export default WithRender('
        )
      } else {
        script =
          script.replace(
            /(\r\n|\r|\n)\W*export default {/,
            '$1export default WithRender({'
          ) + ')'
      }
    }
    script = (additionalScript + script).trim()
  }

  return {
    script,
    scriptExt,
    template,
    templateExt,
    style,
    styleExt
  }
}
