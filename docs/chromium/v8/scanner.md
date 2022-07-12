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

### ECMAScript 词法规则

<a href="https://262.ecma-international.org/13.0/#sec-ecmascript-language-lexical-grammar" target="_blank">ECMAScript 词法规则 https://262.ecma-international.org/13.0/#sec-ecmascript-language-lexical-grammar</a>

在 src/parsing/token.h 预定义了TOKEN_LIST,包含但不限于JavaScript中的词法.

token.h 部分代码:

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

## 入口函数

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

## scanner初始化

Scanner有3个指针用于记录TOKEN.

```cpp
  TokenDesc* current_;    // desc for current token (as returned by Next())
  TokenDesc* next_;       // desc for next token (one token look-ahead)
  TokenDesc* next_next_;  // desc for the token after next (after PeakAhead())
```

结构体TokenDesc用来记录Token信息(源码中的坐标等), 类LiteralBuffer用于收集字符.

LiteralBuffer的扩容机制: 第一次添加字符时Vector长度扩容为64, 之后每次扩容 * 4 直到大于 (1MB / 3), 之后每次扩容1MB.

```cpp
struct TokenDesc {
  Location location = {0, 0};
  LiteralBuffer literal_chars;
  LiteralBuffer raw_literal_chars;
  Token::Value token = Token::UNINITIALIZED;
  MessageTemplate invalid_template_escape_message = MessageTemplate::kNone;
  Location invalid_template_escape_location;
  uint32_t smi_value_ = 0;
  bool after_line_terminator = false;
};
```
### Init()

从源码流中拷贝最多512个字符到缓存区,初始化内部指针指向,初始化Scanner一些内部状态.

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

调用ScanSingleToken(),扫描一个TOKEN,在遇到某些TOKEN时还会向后预读,比如`< <= << <<= <!-- + ++ +=`等, 在解析错误时会返回Token::ILLEGAL.

```cpp
void Scanner::Scan(TokenDesc* next_desc) {
  DCHECK_EQ(next_desc, &next());

  next_desc->token = ScanSingleToken();
  DCHECK_IMPLIES(has_parser_error(), next_desc->token == Token::ILLEGAL);
  next_desc->location.end_pos = source_pos();
}
```

ScanSingleToken源码: 
```cpp
V8_INLINE Token::Value Scanner::ScanSingleToken() {
  Token::Value token;
  do {
    next().location.beg_pos = source_pos();

    if (V8_LIKELY(static_cast<unsigned>(c0_) <= kMaxAscii)) {
      token = one_char_tokens[c0_];

      switch (token) {
        case Token::LPAREN:
        case Token::RPAREN:
        case Token::LBRACE:
        case Token::RBRACE:
        case Token::LBRACK:
        case Token::RBRACK:
        case Token::COLON:
        case Token::SEMICOLON:
        case Token::COMMA:
        case Token::BIT_NOT:
        case Token::ILLEGAL:
          // One character tokens.
          return Select(token);

        case Token::CONDITIONAL:
          // ? ?. ?? ??=
          Advance();
          if (c0_ == '.') {
            Advance();
            if (!IsDecimalDigit(c0_)) return Token::QUESTION_PERIOD;
            PushBack('.');
          } else if (c0_ == '?') {
            return Select('=', Token::ASSIGN_NULLISH, Token::NULLISH);
          }
          return Token::CONDITIONAL;

        case Token::STRING:
          return ScanString();

        case Token::LT:
          // < <= << <<= <!--
          Advance();
          if (c0_ == '=') return Select(Token::LTE);
          if (c0_ == '<') return Select('=', Token::ASSIGN_SHL, Token::SHL);
          if (c0_ == '!') {
            token = ScanHtmlComment();
            continue;
          }
          return Token::LT;

        case Token::GT:
          // > >= >> >>= >>> >>>=
          Advance();
          if (c0_ == '=') return Select(Token::GTE);
          if (c0_ == '>') {
            // >> >>= >>> >>>=
            Advance();
            if (c0_ == '=') return Select(Token::ASSIGN_SAR);
            if (c0_ == '>') return Select('=', Token::ASSIGN_SHR, Token::SHR);
            return Token::SAR;
          }
          return Token::GT;

        case Token::ASSIGN:
          // = == === =>
          Advance();
          if (c0_ == '=') return Select('=', Token::EQ_STRICT, Token::EQ);
          if (c0_ == '>') return Select(Token::ARROW);
          return Token::ASSIGN;

        case Token::NOT:
          // ! != !==
          Advance();
          if (c0_ == '=') return Select('=', Token::NE_STRICT, Token::NE);
          return Token::NOT;

        case Token::ADD:
          // + ++ +=
          Advance();
          if (c0_ == '+') return Select(Token::INC);
          if (c0_ == '=') return Select(Token::ASSIGN_ADD);
          return Token::ADD;

        case Token::SUB:
          // - -- --> -=
          Advance();
          if (c0_ == '-') {
            Advance();
            if (c0_ == '>' && next().after_line_terminator) {
              // For compatibility with SpiderMonkey, we skip lines that
              // start with an HTML comment end '-->'.
              token = SkipSingleHTMLComment();
              continue;
            }
            return Token::DEC;
          }
          if (c0_ == '=') return Select(Token::ASSIGN_SUB);
          return Token::SUB;

        case Token::MUL:
          // * *=
          Advance();
          if (c0_ == '*') return Select('=', Token::ASSIGN_EXP, Token::EXP);
          if (c0_ == '=') return Select(Token::ASSIGN_MUL);
          return Token::MUL;

        case Token::MOD:
          // % %=
          return Select('=', Token::ASSIGN_MOD, Token::MOD);

        case Token::DIV:
          // /  // /* /=
          Advance();
          if (c0_ == '/') {
            base::uc32 c = Peek();
            if (c == '#' || c == '@') {
              Advance();
              Advance();
              token = SkipSourceURLComment();
              continue;
            }
            token = SkipSingleLineComment();
            continue;
          }
          if (c0_ == '*') {
            token = SkipMultiLineComment();
            continue;
          }
          if (c0_ == '=') return Select(Token::ASSIGN_DIV);
          return Token::DIV;

        case Token::BIT_AND:
          // & && &= &&=
          Advance();
          if (c0_ == '&') return Select('=', Token::ASSIGN_AND, Token::AND);
          if (c0_ == '=') return Select(Token::ASSIGN_BIT_AND);
          return Token::BIT_AND;

        case Token::BIT_OR:
          // | || |= ||=
          Advance();
          if (c0_ == '|') return Select('=', Token::ASSIGN_OR, Token::OR);
          if (c0_ == '=') return Select(Token::ASSIGN_BIT_OR);
          return Token::BIT_OR;

        case Token::BIT_XOR:
          // ^ ^=
          return Select('=', Token::ASSIGN_BIT_XOR, Token::BIT_XOR);

        case Token::PERIOD:
          // . Number
          Advance();
          if (IsDecimalDigit(c0_)) return ScanNumber(true);
          if (c0_ == '.') {
            if (Peek() == '.') {
              Advance();
              Advance();
              return Token::ELLIPSIS;
            }
          }
          return Token::PERIOD;

        case Token::TEMPLATE_SPAN:
          Advance();
          return ScanTemplateSpan();

        case Token::PRIVATE_NAME:
          if (source_pos() == 0 && Peek() == '!') {
            token = SkipSingleLineComment();
            continue;
          }
          return ScanPrivateName();

        case Token::WHITESPACE:
          token = SkipWhiteSpace();
          continue;

        case Token::NUMBER:
          return ScanNumber(false);

        case Token::IDENTIFIER:
          return ScanIdentifierOrKeyword();

        default:
          UNREACHABLE();
      }
    }

    if (IsIdentifierStart(c0_) ||
        (CombineSurrogatePair() && IsIdentifierStart(c0_))) {
      return ScanIdentifierOrKeyword();
    }
    if (c0_ == kEndOfInput) {
      return source_->has_parser_error() ? Token::ILLEGAL : Token::EOS;
    }
    token = SkipWhiteSpace();

    // Continue scanning for tokens as long as we're just skipping whitespace.
  } while (token == Token::WHITESPACE);

  return token;
}
```

scanner到这里就已经初始化完了,后面由Parser驱动它进行工作.