# 基本语法

## function

```kotlin
// 带有两个int参数,返回int的函数
fun sum(a: Int, b: Int): Int {
  return a + b
}

// 将表达式作为函数体,返回值类型自动推断的函数
fun sum(a: Int, b: Int) = a + b

// 函数返回无意义的值
fun printSum(a: Int, b: Int): Unit {
  println("sum of $a and $b is ${a + b}")
}
```

## variable

```kotlin
// 定义只读变量使用关键字 val
val a: Int = 1 // 立即赋值
val b = 2 //自动推断
val c: Int // 如果没有赋值类型不可省略

// 可重新赋值的变量使用var
var x = 5
x += 5
```

## 字符串模板

```kotlin
var a = 1 // 模板中的简单名称：
val s1 = "a is $a"
// s1: "a is 1"
a = 2 // 模板中的任意表达式：
val s2 = "${s1.replace("is", "was")}, but now is $a"
// s2: "s was 1, but now is 2"
```

## 空值与null检测

当某个变量的值可以为 null 的时候，必须在声明处的类型后添加 ? 来标识该引用可为空

```kotlin
fun parseInt(str: String): Int? {
  // to do
}
```

## 类型检测与自动类型转换

` is ` 运算符检测一个表达式是否某类型的一个实例

```kotlin
fun getStringLength(obj: Any): Int? {
  if (obj is String) {
    // `obj` 在该条件分支内自动转换成 `String`
    return obj.length
  }
  // 在离开类型检测分支后，`obj` 仍然是 `Any` 类型
  return null
}
```

## for循环

``` kotlin
val items = listOf("apple", "banana", "kiwifruit")
for (item in items) {
  println(item)
}
```

## while循环

```kotlin
val items = listOf("apple", "banana", "kiwifruit")
var index = 0
while (index < items.size) {    
  println("item at $index is ${items[index]}")    
  index++
}
```

## when表达式

``` kotlin
fun describe(obj: Any): String =
  when (obj) {
    1          -> "One"
    "Hello"    -> "Greeting"
    is Long    -> "Long"        
    !is String -> "Not a string"
    else       -> "Unknown"    
  }
```

## 使用区间(range)

使用` in `运算符来检测某个数字是否在指定区间内

``` kotlin
val x = 10
val y = 9
if (x in 1..y+1) {    
  println("fits in range")
}
```

## Collections

对集合进行迭代:

``` kotlin
for (item in items) {
  println(item)
}
```

## 创建基本类及其实例

``` kotlin
val rectangle = Rectangle(5.0, 2.0)
```

