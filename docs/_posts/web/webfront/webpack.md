---
title: webpack学习笔记
date: 2018-09-10
categories:
 - js
 - utils
tags:
 - webpack
---

## webpack基本配置

### context(上下文):  string

```js
// 基础目录,默认使用当前目录 __dirname当前目录  package.json的当前目录
context: path.resolve(__dirname, "../")
```

### entry(入口):  string | [string] | object { [key]: string | [string] } | (function: () => string | [string] | object { [key]: string | [string] })

起点或是应用程序的起点入口。从这个起点开始，应用程序启动执行。如果传递一个数组，那么数组的每一项都会执行

### output(出口):  指示 webpack 如何去输出、以及在哪里输出你的「bundle、asset 和其他你所打包或使用 webpack 载入的任何内容」

```js
/** 只用于 target 是 web，使用了通过 script 标签的 JSONP 来按需加载 chunk。
 * 禁用跨域加载 | 不带凭据启用跨域加载 | 带凭据启用跨域加载
**/
crossOriginLoading: false | 'anonymous' | 'use-credentials'

/** 
* 此选项决定了每个输出 bundle 的名称。这些 bundle 将写入到 output.path 选项指定的目录下
* [hash] 模块标识符(module identifier)的 hash
* [chunkhash] chunk 内容的 hash
* [name] 模块名称
* [id] 模块标识符(module identifier)
* [query] 模块的 query，例如，文件名 ? 后面的字符串
**/
!filename: 'string' | 'function'

// 输出的绝对路径
!path: 'string' // 常用path.resolve(__dirname, '../dist')

// 此选项指定在浏览器中所引用的「此输出目录对应的公开 URL」
publicPath: 'string' | 'function'
```

### module

```js
// 忽略的文件中不应该含有 import, require, define 的调用，或任何其他导入机制。忽略大型的 library 可以提高构建性能
noParse: RegExp | function 
// 创建模块时，匹配请求的**规则**数组
rules: 'array'
// rule规则: condition(条件), result(结果), rule(规则)
// rule condition:  resource issuser
// resource：请求文件的绝对路径。它已经根据 resolve 规则解析。
// issuer: 被请求资源(requested the resource)的模块文件的绝对路径。是导入时的位置。

// 指定loader的种类,没有值就是普通的loader
rule.enforce: 'pre' | 'post'
```

### resolve

```js
alias: object // 创建import或require的别名，来确保模块引入变得更简单
extensions: ['.js', '.vue', '.css', '.json'] // 自动解析确定的扩展
mainFields: ["browser", "module", "main"] // 此选项将决定在 package.json 中使用哪个字段导入模块
```

### devtool

```js
type: 'string'
// 开发一般用 'cheap-module-eval-source-map'
// 生产一般用 'source-map' | none
```

### externals:`externals` 配置选项提供了「从输出的 bundle 中排除依赖」的方法

## 常用loader ##

### babel-loader ###

[Babel 中文文档 - 印记中文](https://babel.docschina.org/)

所需要的依赖：babel-loader、babel-core、babel-preset-env、babel-polyfill、babel-runtime和babel-plugin-transform-runtime

`babel-loader`：在import或加载模块时，对es6代码进行预处理，es6语法转化为es5语法。
`babel-core`：允许我们去调用babel的api，可以将js代码分析成ast（抽象语法树），方便各个插件分析语法进行相应的处理.
`babel-preset-env`：指定规范，比如es2015，es2016，es2017，latest，env（包含前面全部）
`babel-polyfill`：它效仿一个完整的ES2015+环境，使得我们能够使用新的内置对象比如 Promise，静态方法比如Array.from 或者 Object.assign, 实例方法比如 Array.prototype.includes 和生成器函数（提供给你使用 regenerator 插件）。为了达到这一点， polyfill 添加到了全局范围，就像原生类型比如 String 一样。
`babel-runtime babel-plugin-transform-runtime`：与babel-polyfill作用一样，使用场景不一样。

```sh
npm install babel-loader@8.0.0-beta.0 @babel/core @babel/preset-env webpack
```

### css-loader && style-loader ###

` npm i css-loader style-loader -D `

`css-loader` 解释(interpret) `@import` 和 `url()` ，会 `import/require()` 后再解析(resolve)它们

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      }
    ]
  }
}
```

### url-loader ###

<https://www.webpackjs.com/loaders/url-loader/>
` npm i url-loader -D `

```js
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

## 代码分割

### [配置externals ](<https://www.webpackjs.com/configuration/externals/#externals>)

```js
// 从CDN引入 <script src="https://cdn.bootcss.com/vue/2.5.13/vue.min.js"></script>
externals: {
  vue: 'Vue',
  subtract: ['./math', 'subtract'],
  lodash : {
    commonjs: "lodash",
    amd: "lodash",
    root: "_" // 指向全局变量
  }
}
// 父模块 , 子模块
```

### 使用SplitChunksPlugin

## 常用plugin

### clean-webpack-plugin ### 

作用: 构建之前清理旧的构建文件

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

### mini-css-extract-plugin

作用: 从js中抽离css

` npm i mini-css-extract-plugin -D `



