# 注解(元数据)

## 本质

注解的本质是接口,默认继承java.lang.annotation.Annotation

反编译结果:

```java
public interface MyAnnotation extends java.lang.annotation.Annotation {}
```

## 属性

* 要求

  * 属性返回值有以下取值
    * 基本数据类型
    * String
    * 枚举
    * 注解
    * 以上类型的数组
  * 定义了属性,使用时需要赋值
    * 可以定义`default`值,使用时不需要传值
    * 如果只有一个属性需要赋值,且属性值为`value`,`value`可以省略
    * 数组使用时用{}包裹,如果数组只有一个值,可以省略

## 内置注解

- **@Deprecated** 方法已过时
- **@Override** 这是一个复写的方法
- **@SuppressWarnings** 消除编译器警告

1. 抑制单类型的警告：@SuppressWarnings("unused")；

2. 抑制多类型的警告：@SuppressWarnings("unused"，"unchecked")；

3. 抑制所有类型的警告：@SuppressWarnings("all")

- **@FunctionalInterface** 指定接口必须为函数式接口
- **@SafeVarargs** 这个注解用来抑制堆污染警告

## 元注解

**负责注解其他的注解**

* @Target 表示注解可以用于什么地方 ep: @Target(value={ElementType.Type})
  * ElementType常用取值
    * TYPE :  可以作用于类上
    * METHOD : 可以作用于方法上
    * FIELD : 可以作用于成员变量上
    * ...
* @Retention 表示需要在什么级别保存该注解信息 
  * @Retention(RetentionPolicy.RUNTIME) : 当前注解会保存到class字节码中
* @Documented Javadoc  
* @Inherited 允许子类集成父类中的注解

## 自定义注解