---
title: css常用布局
categories: 
 - web
tags:
 - layout
publish: false
---

## layout

### flex(弹性盒子)

- align-content	 多根轴线的对齐方式 
- align-items	侧轴对齐方式
- flex-direction	主轴方向	
- flex-wrap	换行
- justify-content	主轴对齐方式

[MDN flex]( https://wiki.developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Flexible_Box_Layout ).

### grid(网格布局)

兼容性太差!!!

## 滚动

### 让滚动更丝滑

```css
html,body {
  scroll-behavior: smooth
}
```

或者使用dom api`scrollIntoView`

## 图片

## element

### 宽度

element.scrollWidth  内容+内边距+溢出尺寸-----**不包括边框和外边距** ==实际内容

element.offsetWidth 元素的宽度（**内容+内边距+边框+滚动条**）==整体，整个控件

element.clientWidth  内容+内边距,-----**不包括边框和外边距、滚动条** == 可视内容