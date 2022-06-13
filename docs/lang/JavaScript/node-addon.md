---
title: 在nodejs中使用c++模块
date: 2022-06-13
categories:
 - JavaScript
tags:
 - C++ addons
 - nodejs

---

以tesseract为例,在nodejs中调用tesseract的ocr功能. <a href="https://github.com/imLiukai/node-addon-samples">github完整示例</a>

## dependencies

```shell
mkdir node-addon && cd node-addon
npm init -y
# 全局安装node-gyp 打包工具
npm i node-gyp -g
npm i node-addon-api
# 安装tesseract
brew install tesseract 
brew install leptonica
```

## binding.gyp

打包配置. <a href="https://gyp.gsrc.io/docs/UserDocumentation.md">参考gyp user docs</a>

```
{
  "targets": [
    {
      "target_name": "tess",
      # 被编译的 cpp 源文件
      "sources": [
        "tess.cpp"
      ],
      "cflags!": [ "-fno-exceptions"],
      "cflags_cc!": ["-fno-exceptions"],
      # 增加一个头文件搜索路径
      "include_dirs": [
        "<!@(node -p \"require('node-addon-api').include\")",
        "/usr/local/include"
      ],
      # 使用到的三方库
      'libraries': [
        '/usr/local/lib/libtesseract.dylib',
        '/usr/local/lib/libleptonica.dylib'
      ],
      # 添加一个预编译宏，避免编译的时候并行抛错
      'defines': [ 'NAPI_DISABLE_CPP_EXCEPTIONS' ],
    }
  ]
}
```

## cpp源文件

**tess.cpp**
```c++
#include <tesseract/baseapi.h>
#include <leptonica/allheaders.h>
#include <napi.h>

#define EXPORT_JS_FUNCTION_PARAM(name) exports.Set(#name, Napi::Function::New(env, name));

tesseract::TessBaseAPI *api = new tesseract::TessBaseAPI();

// clang++   tess.o  -std=c++20 -v  -ltesseract -llept  -stdlib=libc++  -o tess
void InitTess(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  if (info.Length() == 0 || !info[0].IsString()) {
    Napi::TypeError::New(env, "Language code expected").ThrowAsJavaScriptException();
    return;
  }
  // 0 is ok
  if (api->Init(NULL, (info[0].As<Napi::String>()).Utf8Value().c_str())) {
    Napi::TypeError::New(env, "Init failed").ThrowAsJavaScriptException();
    return;
  }
}

void SetImage(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  if (info.Length() == 0 || !info[0].IsString()) {
    Napi::TypeError::New(env, "String expected").ThrowAsJavaScriptException();
    return ;
  }
  Pix *image = pixRead((info[0].As<Napi::String>()).Utf8Value().c_str());
  api->SetImage(image);
}

Napi::String GetUTF8Text(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  char *outText = api->GetUTF8Text();
  Napi::String str = Napi::String::New(env, outText);
  delete outText;
  return str;
}

void ChangeLang(const Napi::CallbackInfo& info) {
  api->End();
  InitTess(info);
}

void DestroyTess(const Napi::CallbackInfo& info) {
  api->End();
  delete api;
}

// 导出注册函数
Napi::Object Init(Napi::Env env, Napi::Object exports) {
  EXPORT_JS_FUNCTION_PARAM(InitTess)
  EXPORT_JS_FUNCTION_PARAM(DestroyTess)
  EXPORT_JS_FUNCTION_PARAM(ChangeLang)
  EXPORT_JS_FUNCTION_PARAM(SetImage)
  EXPORT_JS_FUNCTION_PARAM(GetUTF8Text)
  return exports;
}
// node-addon-api 中用于注册函数的宏
// hello 为 key, 可以是任意变量
// Init 则会注册的函数
NODE_API_MODULE(Tess, Init);
```

## js测试文件

```javascript
// 引入模块
const { InitTess, SetImage, GetUTF8Text, DestroyTess } = require("./build/Release/tess.node")

InitTess("eng")
// 测试文件
SetImage("./WX20220610-160540@2x.png")
console.log(GetUTF8Text())
DestroyTess()

```

## build

```shell
node-gyp configure build
node test_tess.js
# output
# David Ungar
# Computer Science Division
# Department of Electrical Engineering and Computer Sciences
# University of California
# Berkeley, California 94720
```