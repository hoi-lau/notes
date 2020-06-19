# 反射

**java反射机制:** 将类的各个组成部分封装成其他对象

## 好处

1. 可以再程序运行过程中,操作这些对象(比如编辑器代码提示)
2. 解耦,提高程序的可扩展性

## 获取Class对象

1. Class.forName("全类名")
   多用于配置文件,比如jdbc, 读取文件,加载类
2. 类名.class
   多用于参数传递
3. 对象.getClass(). (Object的方法)
   多用于对象获取字节码的方法

同一个字节码文件在一次运行过程中,只会被加载一次
