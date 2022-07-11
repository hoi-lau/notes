---
title: 「v8」词法分析
date: 2022-04-16
categories:
 - chromium
tags:
 - v8

---

要运行JavaScript代码,首先要对源代码进行处理

## 词法分析的作用

词法分析器负责读取源程序,过滤注释和空白字符,生成词法单元(Token).在v8中词法分析器的实现是Scanner.

![](https://img.imliuk.com/202207112147660.png)

## TOKEN_LIST

在 src/parsing/token.h 预定义了TOKEN_LIST,包含但不限于JavaScript中的词法.

token.h 截取部分代码:

```cpp
#define TOKEN_LIST(T, K)                                           \
                                                                   \
  /* BEGIN PropertyOrCall */                                       \
  /* BEGIN Member */                                               \
  /* BEGIN Template */                                             \
  /* ES6 Template Literals */                                      \
  T(TEMPLATE_SPAN, nullptr, 0)                                     \
  T(TEMPLATE_TAIL, nullptr, 0)                                     \
  /* END Template */                                               \
                                                                   \
  /* Punctuators (ECMA-262, section 7.7, page 15). */              \
  /* BEGIN Property */                                             \
  T(PERIOD, ".", 0)                                                \
  T(LBRACK, "[", 0)                                                \
  /* END Property */                                               \
  /* END Member */                                                 \
  T(QUESTION_PERIOD, "?.", 0)                                      \
  T(LPAREN, "(", 0)                                                \
  /* END PropertyOrCall */                                         \
  T(RPAREN, ")", 0)                                                \
  T(RBRACK, "]", 0)                                                \
  T(LBRACE, "{", 0)                                                \
  T(COLON, ":", 0)                                                 \
  T(ELLIPSIS, "...", 0)                                            \
  T(CONDITIONAL, "?", 3)                                           \
  /* BEGIN AutoSemicolon */                                        \
  T(SEMICOLON, ";", 0)                                             \
  T(RBRACE, "}", 0)
```

<a href="https://262.ecma-international.org/13.0/#sec-ecmascript-language-lexical-grammar" target="_blank">ECMAScript 词法规则 https://262.ecma-international.org/13.0/#sec-ecmascript-language-lexical-grammar</a>

## scanner初始化

词法分析的入口: scanner_.Initialize(). 

```cpp
void Scanner::Initialize() {
  // Need to capture identifiers in order to recognize "get" and "set"
  // in object literals.
  Init();
  next().after_line_terminator = true;
  Scan();
}
```

### Init()

拷贝最多512个字符到缓存区,初始化内部指针指向,初始化Scanner一些内部状态.

```cpp
void Init() {
  // Set c0_ (one character ahead)
  STATIC_ASSERT(kCharacterLookaheadBufferSize == 1);
  Advance();

  current_ = &token_storage_[0];
  next_ = &token_storage_[1];
  next_next_ = &token_storage_[2];

  found_html_comment_ = false;
  scanner_error_ = MessageTemplate::kNone;
}
```

### Scan()

调用ScanSingleToken(),向扫描一个TOKEN
