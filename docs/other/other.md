---
title: null
publish: false
---

## 常见编码

英文字母：
·字节数 : 1;编码：GB2312

字节数 : 1;编码：GBK

字节数 : 1;编码：GB18030

字节数 : 1;编码：ISO-8859-1

字节数 : 1;编码：UTF-8

字节数 : 4;编码：UTF-16

字节数 : 2;编码：UTF-16BE

字节数 : 2;编码：UTF-16LE

中文汉字：
字节数 : 2;编码：GB2312

字节数 : 2;编码：GBK

字节数 : 2;编码：GB18030

字节数 : 1;编码：ISO-8859-1

字节数 : 3;编码：UTF-8

字节数 : 4;编码：UTF-16

字节数 : 2;编码：UTF-16BE

字节数 : 2;编码：UTF-16LE

## 查看文件指纹

### windows

certutil -hashfile [filename] MD5

certutil -hashfile [filename] SHA1

certutil -hashfile [filename] SHA256

### linux

md5sum [filename]

sha1sum [filename]

sha256sum [filename]

### mac

```bash
brew install md5sha1sum
```