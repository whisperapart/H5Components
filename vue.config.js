'use strict'
const path = require('path')
// const defaultSettings = require('./src/index/settings.js')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// 配置接口环境地址
const baseUrl = 'https://easy-mock.com/mock/5ce73ac90edc0c38e2a1ad97'
const uploadUrl = 'http://192.168.100.117:9999'

function resolve(dir) {
  return path.join(__dirname, dir)
}

const name = '金山中台样式库' // page title
// If your port is set to 80,
// use administrator privileges to execute the command line.
// For example, Mac: sudo npm run
const port = 9528 // dev port
const version = require('./package.json').version

// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = {
  /**
   * You will need to set publicPath if you plan to deploy your site under a sub path,
   * for example GitHub Pages. If you plan to deploy your site to https://foo.github.io/bar/,
   * then publicPath should be set to "/bar/".
   * In most cases please use '/' !!!
   * Detail: https://cli.vuejs.org/config/#publicpath
   */
  // publicPath: process.env.NODE_ENV === 'development' ? '/' : '/',
  // outputDir: 'dist',
  // assetsDir: 'static',
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  devServer: {
    port: port,
    open: false,
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: {
      '/fs': {
        target: uploadUrl,
        changeOrigin: true,
        ws: false,
        secure: false,
        pathRewrite: {
          '^/fs': '/fs'
        }
      }
    }
    // after: require('./mock/mock-server.js')
  },
  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name: name,
    plugins: [
      new MiniCssExtractPlugin({
        // 修改打包后css文件名
        filename: 'static/css/samples-ui@' + version + '.css'
      })
    ],
    resolve: {
      alias: {
        '@': resolve('src'),
        '#': resolve('packages')
      }
    }

  },
  css: { extract: true },
  chainWebpack(config) {
    config.plugins.delete('preload') // TODO: need test
    config.plugins.delete('prefetch') // TODO: need test

    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('packages/samplesSvgIcon/src'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('packages/samplesSvgIcon/src'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()
    config.module.rule('md')
      .test(/\.md/)
      .use('vue-loader')
      .loader('vue-loader')
      .end()
      .use('vue-markdown-loader')
      .loader('./build/md-loader/index.js')
      .options({
        raw: true,
        preventExtract: true
      })
      .end()
    // set preserveWhitespace
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true
        return options
      })
      .end()
    config.when(process.env.NODE_ENV === 'development', config => {
      config.module.rule('images')
        .test(/\.(jpg|png|gif)$/)
        .use('url-loader')
        .loader('url-loader')
        .options({
          limit: 1,
          publicPath: 'http://dev.frontend.s-gsun.com/img',
          outputPath: '/static/img',
          name: '[name].[ext]'
        })
        .end()
    })
    config
    // https://webpack.js.org/configuration/devtool/#development
      .when(process.env.NODE_ENV === 'lib',
        config => {
          config.module.rule('images')
            .test(/\.(jpg|png|gif)$/)
            .use('url-loader')
            .loader('url-loader')
            .options({
              limit: 10,
              publicPath: `http://${process.env.PKG_HOST}/img`,
              outputPath: 'static/img',
              name: '[name].[ext]'
            })
            .end()
          config.module.rule('fonts')
            .test(/\.(eot|woff2|woff|ttf|svg)/)
            .use('url-loader')
            .loader('url-loader')
            .options({
              limit: 10,
              publicPath: `http://${process.env.PKG_HOST}/fonts`,
              outputPath: 'static/fonts',
              name: '[name].[ext]'
            })
            .end()
        }
      )

    config
      .when(process.env.NODE_ENV === 'production',
        config => {
          config
            .plugin('ScriptExtHtmlWebpackPlugin')
            .after('html')
            .use('script-ext-html-webpack-plugin', [{
              // `runtime` must same as runtimeChunk name. default is `runtime`
              inline: /runtime\..*\.js$/
            }])
            .end()
          config.module.rule('images')
            .test(/\.(jpg|png|gif)$/)
            .use('url-loader')
            .loader('url-loader')
            .options({
              limit: 10,
              publicPath: `/img`,
              outputPath: 'img',
              name: '[name].[ext]'
            })
            .end()
          config
            .optimization.splitChunks({
              chunks: 'all',
              cacheGroups: {
                libs: {
                  name: 'chunk-libs',
                  test: /[\\/]node_modules[\\/]/,
                  priority: 10,
                  chunks: 'initial' // only package third parties that are initially dependent
                },
                elementUI: {
                  name: 'chunk-elementUI', // split elementUI into a single package
                  priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                  test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
                },
                commons: {
                  name: 'chunk-commons',
                  test: resolve('src/components'), // can customize your rules
                  minChunks: 3, //  minimum common number
                  priority: 5,
                  reuseExistingChunk: true
                }
              }
            })
          config.optimization.runtimeChunk('single')
        }
      )
  }
}
