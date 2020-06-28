---
title: java之io
publish: false
---

使用缓冲流能提升性能

## File

```java
// 构造方法 文件夹也是一个File
new File(String path);// 绝对路径或者相对路径(默认定位到项目的绝对路径)
new File(String parentPath, String fileName);// 文件夹路径 文件名
new File(File file, String fileName);
new File(URI uri)
```

## 字节流

### InputStream

- ByteArrayInputStream  允许将内存的缓冲区当作`InputStream`使用
- StringBufferInputStream  将`String`转换成`InputStream`
- FileInputStream  从文件读取信息
- PipedInputStream  管道化
- SequenceInputStream  将多个`InputStream`转为为一个`InputStream`
- FilterInputStream  抽象类,作为装饰器的接口

### OutputStream

- ByteArrayOutputStream 在内存中创建缓冲区
- FileOutputStream 将信息写到文件
- PipedOutputStream 管道化
- FilterOutputStream 抽象类,作为装饰器的接口

## 字符流

底层基于字节流操作,自动搜寻指定的编码表

### Reader

### Writer