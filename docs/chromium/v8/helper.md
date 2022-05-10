---
title: v8一些重要的
date: 2022-03-28
categories:
 - chromium
tags:
 - v8
publish: false

---

## class

### Local

模板类

> 由 v8 垃圾收集器管理的对象引用。
>
> 从 v8 返回的所有对象都必须由垃圾收集器跟踪，因此它知道对象还活着。另外，因为垃圾收集器可能会移动对象，直接指向一个对象是不安全的。相反，所有对象都存储在垃圾已知的句柄中收集器并在对象移动时更新。句柄应始终按值传递（除了像 out-parameters 这样的情况），他们不应该在堆上分配。
>
> 有两种类型的句柄：local and persistent。本地句柄是轻量级和瞬态的，通常用于本地操作。它们由 HandleScopes 管理。这意味着 HandleScope必须在创建时存在于堆栈中并且它们仅有效HandleScope 在创建期间处于活动状态。对于通过本地外部 HandleScope、EscapableHandleScope 及其 Escape() 的句柄必须使用方法。跨多个存储对象时可以使用持久句柄独立操作，当它们不存在时必须显式释放使用时间更长。通过取消引用来提取存储在句柄中的对象是安全的句柄（例如，从 Local<Object> 中提取 Object*）；value仍将由幕后的句柄管理，并且适用相同的规则这些值作为它们的句柄。

### Handle

由于历史原因，Handle 是 Local 的别名。

### HandleScope

### Zone

AST对象都是基于Zone进行内存管理的，Zone是多次分配临时块对象，然后可以一次性释放掉。

### ZoneObject

基于Zone分配，v8封装了ZoneObject来作为AST对象的基类

### AstRawString

> Ast(Raw|Cons)String 和 AstValueFactory 用于存储字符串和  独立于 V8 堆的值并在以后将它们内部化。解析时，它们被创建并存储在堆外的 AstValueFactory 中。解析后，字符串和值被内部化（移动到 V8 堆中）。

### AstNode

```c++
class AstNode: public ZoneObject {
 public:
#define DECLARE_TYPE_ENUM(type) k##type,
  enum NodeType : uint8_t {
    AST_NODE_LIST(DECLARE_TYPE_ENUM) /* , */
    FAILURE_NODE_LIST(DECLARE_TYPE_ENUM)
  };
#undef DECLARE_TYPE_ENUM

  NodeType node_type() const { return NodeTypeField::decode(bit_field_); }
  int position() const { return position_; }

#ifdef DEBUG
  void Print(Isolate* isolate);
#endif  // DEBUG

  // Type testing & conversion functions overridden by concrete subclasses.
#define DECLARE_NODE_FUNCTIONS(type) \
  V8_INLINE bool Is##type() const;   \
  V8_INLINE type* As##type();        \
  V8_INLINE const type* As##type() const;
  AST_NODE_LIST(DECLARE_NODE_FUNCTIONS)
  FAILURE_NODE_LIST(DECLARE_NODE_FUNCTIONS)
#undef DECLARE_NODE_FUNCTIONS

  IterationStatement* AsIterationStatement();
  MaterializedLiteral* AsMaterializedLiteral();

 private:
  int position_;
  using NodeTypeField = base::BitField<NodeType, 0, 6>;

 protected:
  uint32_t bit_field_;

  template <class T, int size>
  using NextBitField = NodeTypeField::Next<T, size>;

  AstNode(int position, NodeType type)
      : position_(position), bit_field_(NodeTypeField::encode(type)) {}
};
```



### FunctionLiteral

### Scanner

JavaScript扫描器

## struct

### Scanner > Location

负责记录词法位置信息

### LiteralBuffer

存储 OneByte、TwoByte(unicode, utf16).

> src > parsing > literal-buffer.cc:27

```c++
int LiteralBuffer::NewCapacity(int min_capacity) {
  return min_capacity < (kMaxGrowth / (kGrowthFactor - 1))
             ? min_capacity * kGrowthFactor
             : min_capacity + kMaxGrowth;
}

void LiteralBuffer::ExpandBuffer() {
  int min_capacity = std::max({kInitialCapacity, backing_store_.length()});
  base::Vector<byte> new_store =
      base::Vector<byte>::New(NewCapacity(min_capacity));
  if (position_ > 0) {
    MemCopy(new_store.begin(), backing_store_.begin(), position_);
  }
  backing_store_.Dispose();
  backing_store_ = new_store;
}
```

> src > parsing > literal-buffer.h:76

```c++
  static const int kInitialCapacity = 16;
  static const int kGrowthFactor = 4;
  static const int kMaxGrowth = 1 * MB;
  // MB = 1024 * 1024
```

第一次添加字符时扩容为64, 之后每次扩容 * 4, **单个token的解析长度是有上限的，最大约2mb**

### TokenDesc

词法描述

> src > parsing > scanner.h:430

```c++
  struct TokenDesc {
    Location location = {0, 0};
    LiteralBuffer literal_chars;
    LiteralBuffer raw_literal_chars;
    Token::Value token = Token::UNINITIALIZED; // token 类型
    MessageTemplate invalid_template_escape_message = MessageTemplate::kNone;
    Location invalid_template_escape_location;
    uint32_t smi_value_ = 0;
    bool after_line_terminator = false;
  }
```

