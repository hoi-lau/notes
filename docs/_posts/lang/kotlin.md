---
title: kotlin学习
categories:
 - java
date: 2020-02-15
---

## 基本类型

### 数字

#### 整数

| 类型  | 大小(比特) | 最小值 | 最大值 |
| ----- | ---------- | ------ | ------ |
| Byte  | 8          | -128   | 127    |
| Short | 16         | -32768 | 32767  |
| Int   | 32         | -2³¹   | 2³¹-1  |
| Long  | 64         | -2⁶³   | 2⁶³-1  |

所有以未超出 Int 最大值的整型值初始化的变量都会推断为 Int 类型。如果初始值超过了其最大值，那么推断为 Long 类型。 如需显式指定 Long 型值，请在该值后追加 L 后缀

#### 小数

| 类型   | 大小(比特) | 有效数字比特数 | 指数比特数 | 十进制位数 |
| ------ | ---------- | -------------- | ---------- | ---------- |
| Float  | 32         | 24             | 8          | 6~7        |
| Double | 64         | 53             | 11         | 15~16      |

对于以小数初始化的变量，编译器会推断为 Double 类型。 如需将一个值显式指定为 Float 类型，请添加 f 或 F 后缀

### 字符

字符用 Char 类型表示。它们不能直接当作数字

### 布尔

布尔用 Boolean 类型表示，它有两个值：true 与 false。

### 数组

数组在 Kotlin 中使用 Array 类来表示

``` kotlin
// 创建一个 Array<String> 初始化为 ["0", "1", "4", "9", "16"]
val asc = Array(5) { i -> (i * i).toString() }
asc.forEach { println(it) }
// arrayOf(1, 2, 3)  -> [1, 2, 3]
```

### 原生类型数组

Kotlin 也有无装箱开销的专⻔的类来表示原生类型数组: ByteArray、 ShortArray、IntArray等等.

### 字符串

#### 字符串字面值

字符串用 String 类型表示。字符串是不可变的。

``` kotlin
// 使用for迭代字符串
for (c in str) {    
  println(c)
}
```

#### 字符串模板

``` kotlin
val i = 10
println("i = $i") // 输出“i = 10”

val s = "123"
println("$s.length is ${s.length}") // 输出“abc.length is 3”

val price = """${'$'}9.99""" // 如果想要打印$
```

## 基本语法

### function

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

### variable

```kotlin
// 定义只读变量使用关键字 val
val a: Int = 1 // 立即赋值
val b = 2 //自动推断
val c: Int // 如果没有赋值类型不可省略

// 可重新赋值的变量使用var
var x = 5
x += 5
```

### 字符串模板

```kotlin
var a = 1 // 模板中的简单名称：
val s1 = "a is $a"
// s1: "a is 1"
a = 2 // 模板中的任意表达式：
val s2 = "${s1.replace("is", "was")}, but now is $a"
// s2: "s was 1, but now is 2"
```

### 空值与null检测

当某个变量的值可以为 null 的时候，必须在声明处的类型后添加 ? 来标识该引用可为空

```kotlin
fun parseInt(str: String): Int? {
  // to do
}
```

### 类型检测与自动类型转换

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

### for循环

``` kotlin
val items = listOf("apple", "banana", "kiwifruit")
for (item in items) {
  println(item)
}
```

### while循环

```kotlin
val items = listOf("apple", "banana", "kiwifruit")
var index = 0
while (index < items.size) {    
  println("item at $index is ${items[index]}")    
  index++
}
```

### when表达式

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

### 使用区间(range)

使用` in `运算符来检测某个数字是否在指定区间内

``` kotlin
val x = 10
val y = 9
if (x in 1..y+1) {    
  println("fits in range")
}
```

### Collections

对集合进行迭代:

``` kotlin
for (item in items) {
  println(item)
}
```

### 创建基本类及其实例

``` kotlin
val rectangle = Rectangle(5.0, 2.0)
```

## function

### inline函数

为什么会有inline函数?

### 方法调用流程

调用一个方法是一个压栈和出栈的过程，调用方法时将栈针压入方法栈，然后执行方法体，方法结束时将栈针出栈，这个压栈和出栈的过程会耗费资源，这个过程中传递形参也会耗费资源。

<b>对于一些简单的方法,且不会将形参传给其他方法的方法,我们可以在编译期间直接执行方法体,这样会提升程序的性能</b>

<b>inline 关键字应该只用在需要内联特性的函数中，比如高阶函数作为参数和具体化的类型参数时</b>

频繁使用inline会导致生成代码量大

### 禁用内联

在inline函数中无法将内联函数传递给其他非inline函数(无法通过编译)

给参数添加` noinline `关键字禁用内联

``` kotlin
inline fun submit(str: String, cb: (String, String) -> Unit) {
    println(str)
    cb("ajdla", "wq")
    send(cb)
  // send函数必须为inline或者参数前添加 noinline 
}

inline fun send(cb: (String, String) -> Unit) {
}
```

### 高阶函数

高阶函数：以另一个函数作为参数，或者返回值是函数 称为 高阶函数

### 不带参数的函数 作为形参

``` kotlin
fun main() {
  // lambda调用
  action("123", {
    println("iii")
  }) 
  // 显示调用
  val method: () -> Unit = {
    println("xian")
  }
  action("123", method)
}

fun action(str, cb) {
  cb()
}
```

### 带参数和返回值得函数 作为形参

``` kotlin
fun main() {
    // lambda可写在()里面或者外面
    action(1){it-> //Lambda语法，回调参数在这里
        println("回调函数参数= : $it")

        true//Lambda语法，最后一行返回值就是闭包的返回值
    }
}

/**
 * 函数作为 形参
 */
fun action(first:Int, callback:(Int)->Boolean){

    //调用
    if(callback(first)){
        println("回调函数返回值 true")
    }else{
        println("回调函数返回值 false")
    }
}
```

### 返回另一个函数

函数作为返回值，没有函数作为参数，用的场景广

## 习惯用法

### 创建DTO

``` kotlin
data class Customer(val name: String, val email: String)
```

会为` Customer ` 类提供以下功能：

所有属性的 ` getters ` （对于` var `定义的还有` setters `）

` equals() `

` hashCode() ` 

` toString() `

` copy() `

所有属性的` component1()、 component2()...... ` 等等（参⻅数据类）

### 函数的默认参数

``` kotlin
fun foo(a: Int = 0) {}
```

### 过滤list

``` kotlin
val positives = list.filter { x -> x > 0 }
// val positives = list.filter { it > 0 }
```

### 检测元素是否存在于集合中

``` kotlin
if ("john@example.com" in emailsList) { ...... }
```

### 字符串内插

``` kotlin
var str = "name: $name"
```

### 类型判断

``` kotlin
when (x) {
  is Foo -> ...
  is Bar -> ...
  else ->
}
```

### 遍历map/pair型list

``` kotlin
for ((key, value) in map) {
  
}
```

### 使用区间

``` kotlin
for (i in 1..100) { ...... }  // 闭区间：包含 100
for (i in 1 until 100) { ...... } // 半开区间：不包含 100
for (x in 2..10 step 2) { ...... }
for (x in 10 downTo 1) { ...... }
if (x in 1..10) { ...... }
```

### 只读list

``` kotlin
 val list = listOf("a", "b", "c")
```

### 只读map

``` kotlin
val map = mapOf("a" to 1, "b" to 2, "c" to 3)
```

### 扩展函数

``` kotlin
fun String.spaceToCamelCase() { ...... }
"Convert this to camelcase".spaceToCamelCase()
```

### 创建单例

``` kotlin
object Resource {
  val name = "Name"
}
```

### if 相关

``` kotlin
// If not null缩写
val files = File("/").listFiles()
println(files?.size)
// if not null and else
// val files = File("/").listFiles()
println(files?.size ?: "empty")
// if null 执行一个语句
// val files = File("/").listFiles()
println(files?.size ?: "empty")
// if not null 执行代码
files?.let {
  
}
```

### 在可能会空的集合中取第一元素

``` kotlin
val emails = listOf("1", "2") // 可能会是空集合
val mainEmail = emails.firstOrNull() ?: ""
```

### 返回when表达式

``` kotlin
fun transform(color: String): Int {
  return when (color) {
    "Red" -> 0
    "Green" -> 1
    "Blue" -> 2
    else -> throw IllegalArgumentException("Invalid color param value")
  }
}
```

### try catch 表达式

``` kotlin
fun testTry() {
    val result = try {
        val count = 1 / 0
    } catch (e: Exception) {
        println(e.message)
        throw Exception(e)
    }
    println(result)
}

```

### if 表达式

``` kotlin
fun testIf (param: Int): Any {
    var result = if (param == 1) {
        "1"
    } else if (param == 2) {
        "2"
    } else {
        344
    }
    return result
}
```

### 单表达式函数

```kotlin
fun theAnswer() = 42
```

### 对一个对象实例调用多个方法 （with）

``` kotlin
class Turtle{
  fun penDown()
  fun penUp()
  fun turn(degrees: Double)
  fun forward(pixels: Double)
}
val myTurtle = Turtle()
with(myTurtle) { 
  // 画一个 100 像素的正方形    
  penDown()
  for(i in1..4) {        
    forward(100.0)        
    turn(90.0)    
  }    
  penUp()
}
```

### 配置对象的属性

``` kotlin
val myRectangle = Rectangle().apply {    
  length = 4    
  breadth = 5    
  color = 0xFAFAFA
}
```

### 交换两个变量

``` kotlin
var a = 1
var b = 2
a = b.also { b = a }
```

## 关键字

### lateinit 与 by lazy

``` kotlin
// 都表示表示延迟加载
val name:String by lazy { "junlyuan" }
// 只能用于val
lateinit  var person: Person
// 只能用于 var
```

### var & val

- `var `代表可变变量,与java中声明变量方式一样
- `val `代表只读变量,相当于java中的`final`

### Companion Objects

Companion Objects中定义的成员类似于Java中的静态成员，因为Kotlin中没有static成员

```kotlin
interface Foo{
	companionobject {
    @JvmField
    val answer: Int = 42
    @JvmStatic
    fun sayHello() {            
      println("Hello, world!")        
    }   
  }
}
```

等价于java代码

```java
interface Foo{
  public static int answer = 42;
  public static void sayHello(){
    // ..
  }
}
```

### Object

`object` 关键字可以表达两种含义：一种是`对象表达式`,另一种是 `对象声明`。

1. 对象表达式

2. 对象声明

用object 修饰的类为静态类，里面的方法和变量都为静态的。

