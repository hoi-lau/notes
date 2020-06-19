# Vue init

## 初始化

使用vue-cli.

```bash
npm install -g @vue/cli
```

1. vue  create app
2. 根目录创建 vue.config.js

## vuex

 Vuex 是一个专为 Vue.js 应用程序开发的**状态管理模式**。它采用集中式存储管理应用的所有**组件的状态**，并以相应的规则保证状态以一种可预测的方式发生变化 

### vuex 页面刷新时store数据丢失问题

思路: vuex是将数据保存在内存中的,当页面刷新时,页面会重新加载vue实例(vuex重新初始化),最佳解决办法:刷新之前将vuex数据保存在sessionStorage中.(监听浏览器刷新事件,组件加载时赋值)

 [https://developer.mozilla.org/en-US/docs/Web/API/Window/pagehide_event](https://links.jianshu.com/go?to=https%3A%2F%2Fdeveloper.mozilla.org%2Fen-US%2Fdocs%2FWeb%2FAPI%2FWindow%2Fpagehide_event) 

## 身份认证(通用)

https://blog.csdn.net/Zoctan/article/details/79440161

https://www.iteye.com/blog/globeeip-1236167

### 基于token认证

### 基于session认证