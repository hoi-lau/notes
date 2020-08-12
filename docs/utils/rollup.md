---
title: js模块打包器rollup
date: 2020-08-10
lang: zh-CN
categories:
 - util
tags: 
 - js
publish: false
---

> rollup通常用来构建js库

## 安装

```sh
npm install rollup -D
```

## 配置

默认文件名为`rollup.config.js`

>  bundle类型 --amd（异步模块定义），cjs（commonjs），es（将软件包保存为es模块文件），iife（适合作为<script>标签），umd（以amd、cjs、iife为一体） 

```js
export default {
  input: 'src/main.js',
  output: {
    file: 'bundle.js',
    format: 'cjs'
  }
}
```

在`package.json`中指定`scripts`

```json
{
    "scripts": {
        "dev": "rollup --config rollup.config.dev.js",
        "build": "rollup --config rollup.config.js"
    }
}
```

打包`npm run build`

## 使用babel

安装依赖`npm i -D @rollup/plugin-babel @rollup/plugin-node-resolve @babel/core @babel/preset-env`

更改`rollup.config.js`

```js
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';

export default {
  input: 'xxx',
  output: {
    file: 'xxx',
    format: 'es'
  },
  // ...
  plugins: [
    resolve(),
    babel({ babelHelpers: 'bundled' })
  ]
};
```

在src下增加文件`.babel.json`

```json
{
  "presets": [
    ["@babel/env", {"modules": false}]
  ]
}
```

## 使用typescript

```sh
npm install @rollup/plugin-typescript typescript tslib --save-dev
```

配置文件:

```js
// rollup.config.js
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/index.ts',
  output: {
    dir: 'output',
    format: 'cjs'
  },
  plugins: [typescript({lib: ["es5", "es6", "dom"], target: "es5"})]
}
```

## 常用插件

 https://github.com/rollup/awesome 