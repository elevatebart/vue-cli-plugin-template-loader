module.exports = (api, options) => {
  api.chainWebpack(config => {
    const templateRule = config.module.rule('template').test(/\.html$/)

    templateRule.include.add(api.resolve('src')).end()

    templateRule
      .use('vue-template-loader')
      .loader('vue-template-loader')
      .options({
        scoped: true,
        hmr: process.env.NODE_ENV === 'development',
        transformToRequire: {
          // The key should be element name,
          // the value should be attribute name or its array
          img: 'src'
        }
      })

    const cssRule = config.module.rule('css')
    cssRule.enforce('post')
  })
}
