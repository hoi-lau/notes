---
title: 「v8」编译过程
date: 2022-04-13
categories:
 - chromium
tags:
 - v8
---

> 理解 JavaScript 引擎工作原理有助于写出高效的 JavaScript 代码,本文简单的了解一下v8编译前端部分


**一个编译程序的结构**

![](https://img.imliuk.com/20220512164409.JPG)

**V8 的编译过程**

![](https://img.imliuk.com//20220511170529.svg)

在v8中,编译的代码实现是v8::Script::Compile 方法.

## 编译器前端

用v8提供的samples断点调试,总结出编译过程中一些重要的方法:

![](https://img.imliuk.com/20220705113735.png)


```cpp
// Parser::ParseProgram源码(编译开始):
void Parser::ParseProgram(Isolate* isolate, Handle<Script> script,
                          ParseInfo* info,
                          MaybeHandle<ScopeInfo> maybe_outer_scope_info) {
  DCHECK_EQ(script->id(), flags().script_id());

  // It's OK to use the Isolate & counters here, since this function is only
  // called in the main thread.
  DCHECK(parsing_on_main_thread_);
  RCS_SCOPE(runtime_call_stats_, flags().is_eval()
                                     ? RuntimeCallCounterId::kParseEval
                                     : RuntimeCallCounterId::kParseProgram);
  TRACE_EVENT0(TRACE_DISABLED_BY_DEFAULT("v8.compile"), "V8.ParseProgram");
  base::ElapsedTimer timer;
  if (V8_UNLIKELY(FLAG_log_function_events)) timer.Start();

  // Initialize parser state.
  DeserializeScopeChain(isolate, info, maybe_outer_scope_info,
                        Scope::DeserializationMode::kIncludingVariables);

  DCHECK_EQ(script->is_wrapped(), info->is_wrapped_as_function());
  if (script->is_wrapped()) {
    maybe_wrapped_arguments_ = handle(script->wrapped_arguments(), isolate);
  }

  scanner_.Initialize();
  FunctionLiteral* result = DoParseProgram(isolate, info);
  MaybeProcessSourceRanges(info, result, stack_limit_);
  PostProcessParseResult(isolate, info, result);

  HandleSourceURLComments(isolate, script);

  if (V8_UNLIKELY(FLAG_log_function_events) && result != nullptr) {
    double ms = timer.Elapsed().InMillisecondsF();
    const char* event_name = "parse-eval";
    int start = -1;
    int end = -1;
    if (!flags().is_eval()) {
      event_name = "parse-script";
      start = 0;
      end = String::cast(script->source()).length();
    }
    LOG(isolate,
        FunctionEvent(event_name, flags().script_id(), ms, start, end, "", 0));
  }
}
```

Token的生成过程其实就是字符匹配,V8定义了宏TOKEN_LIST(包含JavaScript中所有的Token类型),switch case进行字符匹配,生成Token. ScanSingleToken源码:

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

`scanner_.Initialize()`会初始化`scanner`,也就是词法分析器,同时读取一个token.

`DoParseProgram(isolate, info)`表示语法分析的开始,返回的结果就是AST.

**后台编译**

从 Chrome 66 开始,V8 可以在后台线程上编译 JavaScript 源代码,后台编译可以让主线程空闲更长的时间.目前，只有顶层代码和立即调用的函数表达式（IIFE）在后台线程上编译,内部函数仍然在主线程上延迟编译。

**lazy parsing**

v8实现了lazy parsing(延迟编译),在遇到函数时进行预解析(pre-parse), 而不是完全解析, 这样可以减少编译时间提升应用启动速度,同时减少内存占用(代码对象也是要占用内存的).预解析不会生成ast语法树,函数在第一次被调用时,会进行完全解析和编译.预解析由PreParser类实现.

**顶层代码**

以下代码,除了function body部分,其他是顶层代码.

```JavaScript
const name = 'k'
function fullName(_name) {
  return _name + name
}
```

## AstNode

AstNode继承自ZoneObject. AstNode数据结构:

![](https://img.imliuk.com/20220705173119.png)

![](https://img.imliuk.com/20220705171918.png)
