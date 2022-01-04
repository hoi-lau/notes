---
title: vue首屏优化总结
date: 2020-07-05
category: 
 - web
tags: 
 - vue
publish: false
---

## 骨架屏

## 分包加载

## 控制加载顺序

## cdn加速

## 缓存

### http缓存

### service worker

## ssr

## 压缩资源

### 压缩代码

### 服务端gzip压缩

nginx配置

```conf
    gzip on;
    gzip_min_length 10k;
    gzip_comp_level 2;
    gzip_types text/plain application/javascript application/x-javascript text/css application/xml text/javascript application/x-httpd-php image/jpeg image/gif image/png;
    gzip_vary on;
    gzip_disable "MSIE [1-6]\.";
    # gzip_static on; #静态压缩
```

### 图片不失真压缩

