# 习惯用法

## 创建DTO

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

## 函数的默认参数

``` kotlin
fun foo(a: Int = 0) {}
```

## 过滤list

``` kotlin
val positives = list.filter { x -> x > 0 }
// val positives = list.filter { it > 0 }
```

## 检测元素是否存在于集合中

``` kotlin
if ("john@example.com" in emailsList) { ...... }
```

## 字符串内插

``` kotlin
var str = "name: $name"
```

## 类型判断

``` kotlin
when (x) {
  is Foo -> ...
  is Bar -> ...
  else ->
}
```

## 遍历map/pair型list

``` kotlin
for ((key, value) in map) {
  
}
```

## 使用区间

``` kotlin
for (i in 1..100) { ...... }  // 闭区间：包含 100
for (i in 1 until 100) { ...... } // 半开区间：不包含 100
for (x in 2..10 step 2) { ...... }
for (x in 10 downTo 1) { ...... }
if (x in 1..10) { ...... }
```

## 只读list

``` kotlin
 val list = listOf("a", "b", "c")
```

## 只读map

``` kotlin
val map = mapOf("a" to 1, "b" to 2, "c" to 3)
```

## 扩展函数

``` kotlin
fun String.spaceToCamelCase() { ...... }
"Convert this to camelcase".spaceToCamelCase()
```

## 创建单例

``` kotlin
object Resource {
  val name = "Name"
}
```

## if 相关

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

## 在可能会空的集合中取第一元素

``` kotlin
val emails = listOf("1", "2") // 可能会是空集合
val mainEmail = emails.firstOrNull() ?: ""
```

## 返回when表达式

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

## try catch 表达式

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

## if 表达式

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

## 单表达式函数

```kotlin
fun theAnswer() = 42
```

## 对一个对象实例调用多个方法 （with）

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

## 配置对象的属性

``` kotlin
val myRectangle = Rectangle().apply {    
  length = 4    
  breadth = 5    
  color = 0xFAFAFA
}
```

## 交换两个变量

``` kotlin
var a = 1
var b = 2
a = b.also { b = a }
```

