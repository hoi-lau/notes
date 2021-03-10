---
title: 在macos上调试chromium
date: 2020-12-24
categories:
 - web
tags:
 - chromium
publish: false
---

拉取代码用了1个多小时(需要一个高速代理), 编译用了4~5个小时.(风扇声音巨大, intel i9还是压不住)

## 环境

1. macos catalina 10.15.7
2. xcode12.3

## 拉取代码

### 设置git代理

```sh
git config --global http.proxy 'socks5://127.0.0.1:1089'
git config --global https.proxy 'socks5://127.0.0.1:1089'
# 取消代理
git config --global --unset http.proxy
git config --global --unset https.proxy
```

### 安装`depot_tools`

```sh
git clone https://chromium.googlesource.com/chromium/tools/depot_tools.git
```

添加到环境变量

```sh
# gn tools
export PATH=$PATH:/Users/liuk/project/chrome/depot_tools
```

source一下

### 拉取代码

```sh
mkdir chromium && cd chromium && fetch chromium
# 不带历史记录
# fetch --no-history chromium
```

### 同步代码

```sh
gclient sync
gclient runhooks
```

### 开始编译

```sh
gn gen out/chromium
```

## debug with xcode

使用xcode打开`out/chromium/all.xcodeproj`