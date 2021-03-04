const CompressionPlugin = require('compression-webpack-plugin')

module.exports = {
  configureWebpack: {
    plugins: [
      new CompressionPlugin({
        test: /\.(js|css|html)$/i,
        algorithm: 'gzip',
        compressionOptions: {
          level: 2
        }
      })
    ]
  }
}
