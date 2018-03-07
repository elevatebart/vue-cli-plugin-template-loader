module.exports = (content, classComponent) => {
  const templateRE = /<template( lang="([a-z]+)")?>([^]*?)<\/template>/
  let template = ''
  let templateExt = 'html'
  if (templateRE.test(content)) {
    const templateObj = templateRE.exec(content)
    template = templateObj[3] || ''
    templateExt = templateObj[2] || templateExt
  }

  const styleRE = /<style( scoped)?( lang="([a-z]+)")?>([^]*?)<\/style>/
  let style = ''
  let styleExt = 'css'
  if (styleRE.test(content)) {
    const styleObj = styleRE.exec(content)
    style = styleObj[4]
    styleExt = styleObj[3] || styleExt
  }

  const scriptRE = /<script( lang="([a-z]+)")?>([^]*?)<\/script>/
  const templateString = template.length ? './template.' + templateExt + (style.length ? '?style=./style.' + styleExt: '') : ''
  const additionalScript = `import WithRender from '${templateString}'\n`
  let script = ''
  let scriptExt = 'js'
  if (scriptRE.test(content)) {
    const scriptObj = scriptRE.exec(content)
    script = scriptObj[3]
    if (classComponent) {
      script = script.replace(/(\r\n|\r|\n)export /, '$1@WithRender$1export ')
    } else {
      script = script.replace(/(\r\n|\r|\n)export default Vue.extend\(/, '$1export default WithRender(')
    }
    script = additionalScript + script
    scriptExt = scriptObj[2] || scriptExt
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
