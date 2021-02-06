---
title: 从0开始配置webpack
date: 2021-01-10
categories:
 - utils
tags:
 - js
publish: false
---

> 本文基于webpack5.x. 

完整代码: 

## 新建一个项目

```sh
mkdir my-app
cd my-app
npm init -y
mkdir src build public
# build文件夹下放置webpack配置文件
```

## 配置webpack

```sh
npm i webpack webpack-cli -D
```

### 安装一些关键的plugin

```sh
npm i html-webpack-plugin@next clean-webpack-plugin copy-webpack-plugin mini-css-extract-plugin css-minimizer-webpack-plugin webpack-merge -D
```

- `html-webpack-plugin@next`:  捆绑js bundle
- `clean-webpack-plugin`:  每次成功构建后清除旧的构建
- `copy-webpack-plugin`:  构建时赋值整个目录
- `mini-css-extract-plugin`:  将css文件从js中分离
- `css-minimizer-webpack-plugin`:  优化.压缩css
- `webpack-merge`:  合并webpack配置

#### 配置这些plugins

```js
const { pathResolve, publicPath } = require('./utils')
const readEnv = require('./utils/readEnv')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
module.exports = {
    // webpack5 需要设置target
    target: 'web',
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
          favicon: pathResolve('public/favicon.ico'),
          filename: 'index.html',
          template: pathResolve('public/index.html'),
          title: 'my app'
        }),
        // copy src/static to dist/static
        new CopyWebpackPlugin({
          patterns: [
            {
              from: pathResolve('src/static'),
              to: './static'
            }
          ]
        }),
        // define global variable
        new webpack.DefinePlugin(readEnv('.env')),
        new MiniCssExtractPlugin({
          filename: 'css/[name].[contenthash].css'
        })
  ],
}
```

### 安装一些关键的loader

> loader的执行顺序是从后到前

```sh
npm i style-loader css-loader postcss-loader file-loader url-loader babel-loader -D
```

- `style-loader && css-loader && postcss-loader`: 处理css
- `file-loade`:  处理文件
- `url-loader`:  将一些小文件转化为`base64`URIs
- `babel-loader`:  babel转译
- `cache-loader`:  构建缓存,加快build

### 安装dev-server

```sh
npm i webpack-dev-server -D
```

配置webpack开发配置

```js
const commonConfig = require('./webpack.common')
const webpackMerge = require('webpack-merge')
// merge config
module.exports = webpackMerge.merge(commonConfig, {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  devServer: {
    open: false,
    host: 'localhost',
    port: 5000,
    hot: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
})
```

### 关于热更新

> vue-loader, react hot loader, angular HMR 已经实现了热更新, 开发时只需要开启webpack的热更新

## 添加postcss

 autoprefixer可以自动在样式中添加浏览器厂商前缀，避免手动处理样式兼容问题 

```sh
npm install  postcss-loader postcss autoprefixer  -D
```

修改`css rules`

```js
{
    test: /\.css$/,
    use: ['style-loader', 'css-loader', 'postcss-loader']
}
```

`package.json`新增`browserslist`

```json
"browserslist": [
    "> 1%",
    "last 3 versions",
    "not ie <= 8"
]
```

项目根目录新增`postcss.config.js`

```js
module.exports = {
  plugins: [require('autoprefixer')()]
}
```

## 添加css预处理器

以`stylus`为例

```sh
npm install stylus stylus-loader --save-dev
```

添加`rules`

```js
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// ...
module: {
    rules: [
      {
        test: /\.(styl|stylus|css)$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'stylus-loader']
      }
    ]
  }
```

