---
title: web api 之复制内容到剪切板
date: 2020-07-02
categories:
 - web
tags:
 - web-api
 - js
---

需要将网页部分内容复制到剪切板,总结出以下方案

1. document.execCommand('copy' )
2. navigator.clipboard
3. window.clipboardData

## document.execCommand('copy' )

常与  [Selection API](https://developer.mozilla.org/en-US/docs/Web/API/Selection)  一起使用

```js
// 判断是否支持copy
if (document.queryCommandSupported('copy')) {
    // 移除所有的range
    window.getSelection().removeAllRanges();
    const range = document.createRange()
    // 要复制的内容dom节点
    range.selectNode(document.getElementById('target'))
    window.getSelection().addRange(range)
    try {
        // 返回true 表示成功
        const successful = document.execCommand('copy')
    } catch(err) {}
    // 移除所有的range
    window.getSelection().removeAllRanges();
}
```

**功能强大,可以复制链接,表格,样式,图片...而不仅仅是纯文本**

点击上方代码块右上角'copy',粘贴到类markdown软件中,效果如图:

<img src="https://s1.ax1x.com/2020/07/05/UShdVP.png">

## navigator.clipboard

> ie浏览器不支持clipboard.
>
> 为了安全,域名必须是127.0.0.1(localhost) 或者 https

clipboard有两个api可以将数据写入到剪切板

- write() 兼容性不好,但是更强大.可以写入各种数据image,blob...
- writeText() 写入文本

### write

```html
<!-- body中插入以下代码-->
<canvas id="myCanvas"></canvas>
<script>
   const canvas = document.getElementById("myCanvas")
   const ctx = canvas.getContext('2d')
   ctx.fillStyle = 'green'
   ctx.fillRect(0, 0, 300, 150)
   navigator.permissions.query({ name: 'clipboard-write' }).then(result => {
       // 判断是否可以使用
       if (result.state === 'granted') {
           canvas.toBlob(blob => {
               // blob
               // clipboarditem: https://w3c.github.io/clipboard-apis/#clipboarditem
               navigator.clipboard.write([
                   new ClipboardItem({
                       [blob.type]: blob
                   })
               ]).then().catch()
           })
       }
   }).catch(err => {})
</script>
```

> 在断点调试过程中遇到以下错误:
>
> Uncaught (in promise) DOMException: Document is not focused.
>
>  如异常消息所述，使文档处于主动集中状态才能使用此API。 关掉F12就不会有这个错误了

如果成功,这个canvas已经复制到了剪切板,可以粘贴到类word文档软件.

### writeText

```js
navigator.permissions.query({ name: 'clipboard-write' }).then(result => {
    // 判断是否可以使用
    if (result.state === 'granted') {
        // writeText则是直接写入文本
        navigator.clipboard.writeText('这是一段文本')
    }
}).catch(err => {})
```

## window.clipboardData

**仅ie支持**

window.clipboardData.clearData()
window.clipboardData.setData('Text', 'txt')

参考链接

1. [w3.org](https://www.w3.org/TR/clipboard-apis/)

2. [mdn web docs]( https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/)

3. [google developers](https://developers.google.com/web/updates/2015/04/cut-and-copy-commands )
