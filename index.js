/* eslint-disable */
module.exports = (api, {pluginOptions}) => {
  api.chainWebpack(config => {
      config.resolve
        .extensions
          .merge(['.html', '.css'])

      config.module
        .rule('html')
        .include
          .add(api.resolve('src'))
          .end()
        .test(/\.html$/)
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
    })
}
