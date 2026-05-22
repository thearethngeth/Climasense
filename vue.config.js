const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  pages: {
    index: {
      entry: 'src/main.js',
      title: 'ClimaSense | Live Weather Intelligence'
    }
  },
  publicPath: '/',
  devServer: {
    proxy: {
      '/api': {
        target: 'https://api.openweathermap.org',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
})
