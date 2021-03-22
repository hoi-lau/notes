---
title: 从0配置webpack
date: 2021-01-10
categories:
 - utils
tags:
 - webpack
---

> 基于webpack5.x. 

完整代码: <a href="https://github.com/imLiukai/webpack-template" target="_blank">github</a>

## 目录结构

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

`vue-loader`, `react hot loader`, `angular HMR` 已经实现了热更新, 开发时只需要开启webpack的热更新, 无需手动实现

## 处理文件

### 图片

```js
{
    test: /\.(jpg|png|gif|bmp|jpeg)$/,
        use: [
            {
                loader: 'url-loader',
                options: {
                    limit: 8 * 1024,
                    name: '[hash:8]-[name].[ext]',
                    outputPath: 'image',
                    esModule: false
                }
            }
        ]
},
```

### 字体

```js
{
    test: /\.(ttf|woff2|svg|eot|svg|woff)$/,
        use: [
            {
                loader: 'url-loader',
                options: {
                    outputPath: 'font',
                    esModule: false
                }
            }
        ]
}
```

## 配置babel

> bebel只会转换语法,不会转换API. 

```sh
npm i babel-loader @babel/core @babel/preset-env -D
```

### 配置rule

```js
{
    test: /\.m?js$/,
    exclude: /node_modules/,
    use: {
        loader: "babel-loader",
        options: {
        	presets: ['@babel/preset-env']
        }
    }
}
```

### 两种转换到es5的方式

- polyfill 配合useBuiltIns，常用于web应用的构建；
- transform-runtime 配合corejs，常用于组件方法类库的开发

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
        test: /\.(styl|stylus)$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'stylus-loader'
          }
        ]
      },
      {
        test: /\.(styl|stylus|css)$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'stylus-loader']
      }
    ]
  }
```

## 配置eslint

使用`eslint`的好处

-  静态分析代码以快速发现问题 
- 自动修复问题
- 有利于团队协作

### 安装eslint

```sh
npm i eslint -D
# 初始化eslint,根据项目类型选择对应的选项
npx eslint --init

npx eslint src/**/*.{js} --fix
```

以一个`vue`项目为例,一个简单的`.eslintrc.js`配置:

```js
module.exports = {
  env: {
    browser: true,
    es2020: true
  },
  extends: [
    'standard'
  ],
  globals: {window: true},
  parserOptions: {
    ecmaVersion: 11,
    sourceType: 'module'
  },
  rules: {
    'no-eval': 0, // 允许eval 0 <==> off
    'no-unused-expressions': 0,
    'no-new': 0,
    'no-sparse-arrays': 0,
    'handle-callback-err': 0,
    'standard/no-callback-literal': 0
  }
}

```

<a href=" https://eslint.org/docs/rules/" target="_blank">查看完整rules</a>

<a href=" https://github.com/standard/standard/blob/master/docs/RULES-zhcn.md#javascript-standard-style" target="_blank">js代码规范</a>

### 配合githooks做预检查

```sh
npm i husky lint-staged -D
```

`package.json`增加配置

```json
"lint-staged": {
    "src/**/*.{js}": [
        "eslint --fix"
    ]
},
"husky": {
    "hooks": {
        "pre-commit": "lint-staged"
    }
}
```

配置完之后每次`commit`代码之前,`eslint`都会对**暂存区**的代码进行检查,如果检查不通过将会提交失败.

## webpack优化

### 压缩代码

**使用`TerserWebpackPlugin`压缩js代码**

webpack5 自带 `TerserWebpackPlugin`, 并且默认支持多进程, 可以显著提高编译速度.

```js
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()]
  }
}
```

**使用compression-webpack-plugin开启gzip压缩**

`npm i compression-webpack-plugin -D`

```js
const CompressionPlugin = require('compression-webpack-plugin')
module.exports = {
  plugins: [
    new CompressionPlugin()
  ]
}
```

### treeshaking

移除 JavaScript 上下文中的未引用代码, 依赖于 ES2015 模块语法的静态结构特性

webpack默认开启`tree-Shaking`

**side-effect-free:**

1. 将文件标记为`side-effect-free`, 在`package.json`中定义`"sideEffects": ["./src/some-side-effectful-file.js"]`
2. 将函数标记为`side-effect-free`, 在函数调用前面加上注释`/*#__PURE__*/ fn();`

### 代码分离

#### 入口起点

```js
module.exports = {
	entry: {
    app: {
      import: pathResolve('src/index.js'),
      dependOn: 'lodash'
    },
    lodash: pathResolve('node_modules/lodash')
  }
}
```

#### 动态代码拆分

```js
import('lodash').then(({ default: _ }) => {
    console.log(_)
})
```

#### SplitChunksPlugin

webpack5中只需要进行如下配置:

```js
module.exports = {
  optimization: {
    splitChunks: {
      // 分离异步chunk
      chunks: 'async',
      // size大于这个值(gzip前)的三方库将被拆分
      minSize: 20 * 1024
    }
  }
}
```

#### bundle分析

`npm i -D  webpack-bundle-analyzer`

```js
module.exports = {
	plugins: [
		new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: pathResolve('report.html'),
      openAnalyzer: false
    })
  ]
}
```

### 优化构建

## webpack5新特性

### 官方描述

1. 尝试用持久性缓存来提高构建性能。
2. 尝试用更好的算法和默认值来改进长期缓存。
3. 尝试用更好的 Tree Shaking 和代码生成来改善包大小。
4. 尝试改善与网络平台的兼容性。
5. 尝试在不引入任何破坏性变化的情况下，清理那些在实现 v4 功能时处于奇怪状态的内部结构。
6. 试图通过现在引入突破性的变化来为未来的功能做准备，使其能够尽可能长时间地保持在 v5 版本上。
7. 废弃了V4的一些能力