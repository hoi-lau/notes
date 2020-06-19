# 常用loader #

## babel-loader ##

[Babel 中文文档 - 印记中文](https://babel.docschina.org/)

所需要的依赖：babel-loader、babel-core、babel-preset-env、babel-polyfill、babel-runtime和babel-plugin-transform-runtime

`babel-loader`：在import或加载模块时，对es6代码进行预处理，es6语法转化为es5语法。
`babel-core`：允许我们去调用babel的api，可以将js代码分析成ast（抽象语法树），方便各个插件分析语法进行相应的处理.
`babel-preset-env`：指定规范，比如es2015，es2016，es2017，latest，env（包含前面全部）
`babel-polyfill`：它效仿一个完整的ES2015+环境，使得我们能够使用新的内置对象比如 Promise，静态方法比如Array.from 或者 Object.assign, 实例方法比如 Array.prototype.includes 和生成器函数（提供给你使用 regenerator 插件）。为了达到这一点， polyfill 添加到了全局范围，就像原生类型比如 String 一样。
`babel-runtime babel-plugin-transform-runtime`：与babel-polyfill作用一样，使用场景不一样。

```bash
npm install babel-loader@8.0.0-beta.0 @babel/core @babel/preset-env webpack
```

## css-loader && style-loader ##

` npm i css-loader style-loader -D `

`css-loader` 解释(interpret) `@import` 和 `url()` ，会 `import/require()` 后再解析(resolve)它们

```javascript
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

## url-loader ##
<https://www.webpackjs.com/loaders/url-loader/>
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
