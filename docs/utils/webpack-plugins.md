---
title: webpack常用plugin
date: 2020-09-22
categories:
 - utils
tags:
 - webpack
---

## clean-webpack-plugin

**作用**: 构建之前清理旧的构建文件

` npm i clean-webpack-plugin -D `

```js
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const path = require('path')
const pathToClean = [path.resolve(__dirname, '../dist')]
module.exports = {
	plugins:[
		new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: pathToClean
        })
	]
}
```

### HtmlWebpackPlugin ### 

作用: 处理html

` npm i html-webpack-plugin -D  `

```js
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

## mini-css-extract-plugin

**作用**: 从js中抽离css

` npm i mini-css-extract-plugin -D `