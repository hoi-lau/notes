# spring常用接口

## MethodInvokingFactoryBean

**作用:**

1. 让某个实例的某个方法的返回值注入为Bean的实例
2. 让某个类的静态方法的返回值注入为Bean的实例

## ApplicationContextAware

**作用:** 获取容器ApplicationContext

**spring初始化完bean之后**会去检查bean是否实现了该接口,所以需要将实现类注册为`bean`.

`ApplicationContext`是 `Spring`中的容器，可以用来获取容器中的各种`bean`组件，注册监听事件，加载资源文件等功能。 获取`ApplicationContext`有多种方式,官方推荐实现`ApplicationContextAware`接口