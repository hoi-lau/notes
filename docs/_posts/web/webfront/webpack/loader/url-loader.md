## [url-loader](<https://www.webpackjs.com/loaders/url-loader/>) ##

` npm i url-loader -D `

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192
            }
          }
        ]
      }
    ]
  }
}

```

