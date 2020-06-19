[TOC]

## webpack配置

### context(上下文):  string

```json
// 基础目录,默认使用当前目录 __dirname当前目录  package.json的当前目录
context: path.resolve(__dirname, "../")
```

### entry(入口):  string | [string] | object { [key]: string | [string] } | (function: () => string | [string] | object { [key]: string | [string] })

```json
// 起点或是应用程序的起点入口。从这个起点开始，应用程序启动执行。如果传递一个数组，那么数组的每一项都会执行
```

### output(出口):  指示 webpack 如何去输出、以及在哪里输出你的「bundle、asset 和其他你所打包或使用 webpack 载入的任何内容」

```json
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

```json
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

```json
alias: object // 创建import或require的别名，来确保模块引入变得更简单
extensions: ['.js', '.vue', '.css', '.json'] // 自动解析确定的扩展
mainFields: ["browser", "module", "main"] // 此选项将决定在 package.json 中使用哪个字段导入模块
```

### devtool

```json
type: 'string'
// 开发一般用 'cheap-module-eval-source-map'
// 生产一般用 'source-map' | none
```

### externals:`externals` 配置选项提供了「从输出的 bundle 中排除依赖」的方法