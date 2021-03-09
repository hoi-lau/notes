---
title: 使用eslint规范代码
date: 2020-08-14
categories:
 - utils
tags:
 - js
meta:
 - name: description
   content: 使用eslint规范代码
 - name: keywords
   content: eslint
lang: zh-CN
---

>  eslint是用于识别和报告JavaScript代码中的模式的工具，目的是使代码更加一致并避免错误 

使用`eslint`的好处

-  静态分析代码以快速发现问题 
- 自动修复问题
- 有利于团队协作

## 安装eslint

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
    'plugin:vue/essential',
    'standard'
  ],
  globals: {window: true},
  parserOptions: {
    ecmaVersion: 11,
    sourceType: 'module'
  },
  plugins: [
    'vue'
  ],
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

## 配置.editorconfig

```
# https://github.com/editorconfig/editorconfig/wiki/EditorConfig-Properties

root = true

[*]
charset = utf-8
indent_style = space
indent_size = 2
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true

[*.md]
insert_final_newline = false
trim_trailing_whitespace = false

[*.js]
quote_type = single
```

## 配置.prettierrc.js

```javascript
module.exports = {
  trailingComma: 'none',
  bracketSpacing: true,
  jsxBracketSameLine: false,
  singleQuote: true,
  semi: false,
  proseWrap: 'preserve',
  htmlWhitespaceSensitivity: 'css',
  endOfLine: 'lf'
}
```

## 配合githooks做预检查

```sh
npm i husky lint-staged -D
```

`package.json`增加配置

```json
"lint-staged": {
    "src/**/*.{js,vue}": [
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