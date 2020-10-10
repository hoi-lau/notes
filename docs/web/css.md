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

### 修正图片的预设方向 

`image-orientation: from-image`, 使用图片的 EXIF 数据

### filter

**`filter `**CSS属性将模糊或颜色偏移等图形效果应用于元素。滤镜通常用于调整图像，背景和边框的渲染。

## dom element

### 宽度

element.scrollWidth  内容+内边距+溢出尺寸-----**不包括边框和外边距** ==实际内容

element.offsetWidth 元素的宽度（**内容+内边距+边框+滚动条**）==整体，整个控件

element.clientWidth  内容+内边距,-----**不包括边框和外边距、滚动条** == 可视内容

### 获取元素最终属性

``window.getComputedStyle(element, null)` `

## 文本

### **单行文本溢出显示省略号**

- overflow: hidden; //溢出隐藏
- text-overflow: ellipsis;//超出显示省略号
- white-space: nowrap;//强制文本在一行内显示

### **文本显示行数控制**

- overflow: hidden;
- text-overflow: ellipsis; // 超出显示'...'
- display: -webkit-box; // 将元素作为弹性伸缩盒子模型显示 。
- -webkit-line-clamp: 2; // 用来限制在一个块元素显示的文本的行数
- -webkit-box-orient: vertical; // 设置或检索伸缩盒对象的子元素的排列方式
- word-break break-all //所有字符生效

### js判断文本是否溢出

思路: clone一份文本并设置` visibility `为 `hidden`,如果该文本高度高于原来的,那么文本溢出了

## 居中