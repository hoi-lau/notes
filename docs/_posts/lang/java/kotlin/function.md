# function

## inline函数

为什么会有inline函数?

### 方法调用流程

调用一个方法是一个压栈和出栈的过程，调用方法时将栈针压入方法栈，然后执行方法体，方法结束时将栈针出栈，这个压栈和出栈的过程会耗费资源，这个过程中传递形参也会耗费资源。

<b>对于一些简单的方法,且不会将形参传给其他方法的方法,我们可以在编译期间直接执行方法体,这样会提升程序的性能</b>

<b>inline 关键字应该只用在需要内联特性的函数中，比如高阶函数作为参数和具体化的类型参数时</b>

频繁使用inline会导致生成代码量大

## 禁用内联

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

## 高阶函数

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