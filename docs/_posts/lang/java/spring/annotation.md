# 常用注解

## @Component

**元注解**

在类上使用,只有一个参数value: String,为该组件创建一个别名,当类名重复时应该添加别名,组件名默认为首字母小写的类名

添加了@Component注解的类,ioc会去管理这个bean.

## @bean

## @scope

ioc容器的一个作用域.有以下几种作用域:

- singleton.  在整个应用中，只创建bean的一个实例 
- prototype.  每次注入或者通过spring应用上下文获取的时候，都会创建一个新的bean实例。 
- request.  在Web应用中，为每个请求创建一个bean实例。 
- session.  在web应用中，为每个会话创建一个bean实例。 
- globalsession.  global session作用域类似于标准的HTTP Session作用域，不过它仅仅在基于portlet的web应用中才有意义 

 对于Spring而言，在默认情况下其所有的bean都是以单例的形式创建的。即无论给定的一个bean被注入到其他bean多少次，每次所注入的都是同一个实例.

**proxyMode**

使用基于会话的作用域时,spring会生成代理:接口代理,类代理(cglib)

## @Value

使用@Value注入配置文件中的配置,spring调用构造器后注入值

```java
@Value("${config.backup-name.cn}")
private String cnName;
// 注入application.yml中的值

@Value("注入普通字符串")
private String str;

@Value("#{systemProperties['os.name']}") //2 注入操作系统属性
private String osName;

@Value("classpath:test.txt") //5  注入了文件资源
private Resource testFile;

// 注入静态变量
private static String txt;

@Value("${config.backup-name.cn}")
private void setTxt(String txt) {
    this.txt = txt;
}
```

```yaml
config:
  backup-name:
    cn: liuk
```

## @Lazy

spring在启动的时候默认会去加载所有的bean

@Lazy用于指定该Bean是否取消预初始化。使用该Annotation时可以指定一个boolean型的value属性，该属性决定是否要

预初始化该Bean

当项目中出现循环引用时,可以使用该注解

## @ControllerAdvice 

增强controller

处理全局异常优先使用@ControllerAdvice 

- 处理异常 方法上声明异常的处理类型,注解@ExceptionHandler(Exception.class),捕获异常
- 全局数据绑定  我们可以将一些公共的数据定义在添加了`@ControllerAdvice`注解的类中，这样，可以在需要的时候，在每一个controller中访问到这些数据
- 全局数据预处理

## @ResponseBody

## @RestControllerAdvice

等同于@ControllerAdvice + @ResponseBody

## @SpringBootApplication



```java
// 声明禁用自动配置数据库
exclude= {DataSourceAutoConfiguration.class}
```

## @AutoWired

 **依赖注入：Dependency Injection，简称DI，说白了就是利用反射机制为类的属性赋值的操作** 

 自动装配 bean 对象

## @Qualifier

如果某个service有多个实现类,需要指定实现类名称

 @Qualifier(value = "userServiceImpl01") 

## @Order

## @DependsOn

**1：直接或者间接标注在带有@Component注解的类上面;**

**2：直接或者间接标注在带有@Bean 注解的方法上面;**

通过依赖关系改变bean的初始化顺序

## @AutoConfigureAfter 

## @ Configuration 

用@Conﬁguration注释类表明其主要目的是作为bean定义的源(取代xml配置)

@Conﬁguration类允许通过调用同一类中的其他@Bean方法来定义bean之间的依赖关系

## @Configurable

为非Spring容器管理的对象注入依赖

 告诉`Spring`在构造函数运行之前将依赖注入到对象中。 

## @RequestMapping

## @GetMapping