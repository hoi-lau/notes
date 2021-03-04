const CompressionWebpackPlugin = require('compression-webpack-plugin')

module.exports = {
  chainWebpack: (config, isServer) => {
    config.plugin('CompressionWebpackPlugin').init(() => {
      return new CompressionWebpackPlugin({
        algorithm: 'gzip',
        threshold: 8 * 1024
      })
    })
  }
}
