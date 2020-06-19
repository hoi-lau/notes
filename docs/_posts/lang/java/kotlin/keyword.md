# 关键字

## lateinit 与 by lazy

``` kotlin
// 都表示表示延迟加载
val name:String by lazy { "junlyuan" }
// 只能用于val
lateinit  var person: Person
// 只能用于 var
```

## var & val

- `var `代表可变变量,与java中声明变量方式一样
- `val `代表只读变量,相当于java中的`final`

## Companion Objects

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



## Object

`object` 关键字可以表达两种含义：一种是`对象表达式`,另一种是 `对象声明`。

1. ### 对象表达式



2. ### 对象声明

用object 修饰的类为静态类，里面的方法和变量都为静态的。

