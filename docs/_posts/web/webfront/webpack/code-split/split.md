## [配置externals ](<https://www.webpackjs.com/configuration/externals/#externals>)

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

## 使用SplitChunksPlugin