```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
    plugins: [
		new HtmlWebpackPlugin({
			template: './src/index.html', // 
			filename: 'index.html', // 打包后的文件名
			minify: {
				removeAttributeQuotes: true, // 删除双引号
				collapseWhitespace: true // 折叠空行
			},
			hash: true
		})
	]
}
```

` npm i html-webpack-plugin -D  `

## [详细配置](<https://github.com/jantimon/html-webpack-plugin#configuration>) ##