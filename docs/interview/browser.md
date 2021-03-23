---
title: browser
date: 2021-03-14
publish: false
tags: 
 - web
---

## 知识点

### dom的宽高

clientHeight,clientWidth: 元素宽高和padding, 不包括边框和margin, 如果有滚动条，还要减去滚动条的宽高。注意，这个值始终是整数，如果是小数会被四舍五入。

`clientLeft`属性等于元素节点左边框（left border）的宽度（单位像素），不包括左侧的`padding`和`margin`。如果没有设置左边框，或者是行内元素（`display: inline`），该属性返回`0`。该属性总是返回整数值，如果是小数，会四舍五入。

`clientTop`属性等于网页元素顶部边框的宽度（单位像素），其他特点都与`clientLeft`相同。

`scrollHeight`属性返回一个整数值（小数会四舍五入），表示当前元素的总高度（单位像素），包括溢出容器、当前不可见的部分。它包括`padding`，但是不包括`border`、`margin`以及水平滚动条的高度（如果有水平滚动条的话），还包括伪元素（`::before`或`::after`）的高度。只读。

`offsetParent`属性返回最靠近当前元素的、并且 CSS 的`position`属性不等于`static`的上层元素。

`offsetHeight`属性返回一个整数，表示元素的 CSS 垂直高度（单位像素），包括元素本身的高度、padding 和 border，以及水平滚动条的高度（如果存在滚动条）。

`offsetWidth`属性表示元素的 CSS 水平宽度（单位像素），其他都与`Element.offsetHeight`一致。

`offsetLeft`返回当前元素左上角相对于`Element.offsetParent`节点的水平位移，`Element.offsetTop`返回垂直位移，单位为像素。通常，这两个值是指相对于父节点的位移。

### `defer` & `async`

```html
<script src="script.js"></script>
<!--浏览器会立即加载并执行指定的脚本,停止渲染 -->

<script async src="script.js"></script>
<!-- 加载完执行 -->

<script defer src="script.js"></script>
<!-- 加载后续文档元素的过程将和 `script.js` 的加载并行进行（异步），但是 `script.js` 的执行要在所有元素解析完成之后，`DOMContentLoaded` 事件触发之前完成 -->
```

### `preload` & `prefetch`

`preload`让浏览器提前加载资源, 不阻塞渲染

`prefetch`告诉浏览器可能需要的资源

### 重排 & 重绘

**重排:**  DOM中每个元素都有自己的盒模型, 需要浏览器根据样式计算, 并且根据计算结果将元素放到特定的位置

触发条件:

1. 可见DOM元素增删
2. DOM元素的size, position, 内容改变(DOM影响了布局)
3. Resize窗口
4. 页面渲染初始化

**重绘:**  重绘负责元素的样式更新.重排必然导致重绘

触发条件

#### 减少repaint reflow

合并修改,预先定义好className, 脱离文档流

### 事件委托

## 缓存策略

```js
//缓存位置
Service Worker
Memory Cache
Disk Cache
Push Cache
// 强缓存
Expires:Wed, 22 Oct 2018 08:41:00 GMT
Cache-control: max-age=30
// 协商缓存
Last-Modified
If-Modified-Since
ETag
If-None-Match
```



**iframe的优点：**
 1.iframe能够原封不动的把嵌入的网页展现出来。
 2.如果有多个网页引用iframe，那么你只需要修改iframe的内容，就可以实现调用的每一个页面内容的更改，方便快捷。
 3.网页如果为了统一风格，头部和版本都是一样的，就可以写成一个页面，用iframe来嵌套，可以增加代码的可重用。
 4.如果遇到加载缓慢的第三方内容如图标和广告，这些问题可以由iframe来解决。
 **iframe的缺点：**
 1.会产生很多页面，`不容易管理`。
 2.iframe框架结构有时会让人感到迷惑，如果框架个数多的话，可能会出现上下、左右滚动条，会分散访问者的注意力，`用户体验度差`。
 3.代码复杂，无法被一些搜索引擎索引到，这一点很关键，现在的搜索引擎爬虫还不能很好的处理iframe中的内容，所以使用iframe会`不利于搜索引擎优化`。
 4.很多的移动设备（PDA手机）无法完全显示框架，`设备兼容性`差。
 5.iframe框架页面会`增加服务器的http请求`，对于大型网站是不可取的。
 分析了这么多，`现在基本上都是用Ajax来代替iframe，所以iframe已经渐渐的退出了前端开发`。