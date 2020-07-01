---
title: spring框架学习
date: 2020-05-12
categories:
 - java
tags:
 - spring
---

## springboot initializr

<a href="https://start.spring.io/" _target="_blank">https://start.spring.io/</a>

### application.yml 示例

```yaml
spring:
  profiles:
    active: dev # 默认开发环境
  mvc:
    throw-exception-if-no-handler-found: true
  resources:
    add-mappings: false
# mybatis映射文件
mybatis:
  mapper-locations: classpath*:com/meelinked/zcChain/mapper/*.xml
```

### application-dev.yml 示例

```yaml
server:
  port: 8009
#logback配置文件
logging:
  config: classpath:logback-dev.xml

logback:
  path: /Users/liuk/log/zc_chain

spring:
  datasource:
    username: root
    password:
    url: jdbc:mysql://localhost:3306/zc_chain_test?useUnicode=true&characterEncoding=utf-8&useSSL=true&serverTimezone=Hongkong
    druid:
      initial-size: 5 #连接池初始化大小
      min-idle: 10 #最小空闲连接数
      max-active: 20 #最大连接数
    #    type: com.alibaba.druid.pool.DruidDataSource
    #    driver-class-name: com.mysql.cj.jdbc.Driver

```

### logback.xml

```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
    <!--    定义日志路径,对应application.yml logback配置   -->
    <springProperty scope="context" name="log.path" source="logback.path"/>
    <!-- 由于 logback 在 application.properties 之前加载，所以无法读取 application.properties 中的变量，此时需要使用 springProperty 属性 -->
    <appender name="consoleLog" class="ch.qos.logback.core.ConsoleAppender">
        <layout class="ch.qos.logback.classic.PatternLayout">
            <pattern>%d - %msg%n</pattern>
        </layout>
    </appender>
    <appender name="fileInfoLog" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <filter class="ch.qos.logback.classic.filter.LevelFilter">
            <level>ERROR</level>
            <onMatch>DENY</onMatch>
            <onMismatch>ACCEPT</onMismatch>
        </filter>
        <encoder>
            <pattern>[%date{yyyy-MM-dd HH:mm:ss}] [%-5level] [%logger:%line] --%mdc{client} %msg%n</pattern>
        </encoder>
        <!--滚动策略-->
        <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
            <!--路径-->
            <fileNamePattern>${log.path}/info/%d.info.log</fileNamePattern>
            <maxHistory>30</maxHistory>
        </rollingPolicy>
    </appender>
    <appender name="fileErrorLog" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <filter class="ch.qos.logback.classic.filter.ThresholdFilter">
            <level>ERROR</level>
        </filter>
        <encoder>
            <pattern>%msg%n</pattern>
        </encoder>
        <!--滚动策略-->
        <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
            <!--路径-->
            <fileNamePattern>${log.path}/error/%d.error.log</fileNamePattern>
            <maxHistory>30</maxHistory>
        </rollingPolicy>
    </appender>
    <root level="info">
        <appender-ref ref="consoleLog" />
        <appender-ref ref="fileInfoLog" />
        <appender-ref ref="fileErrorLog" />
    </root>
</configuration>
```

### 配置元数据

1. xml配置
2. spring2.5, 基于注解的配置
3. 基于java的配置

### 启用热更新

```xml
<dependency>
         <groupId>org.springframework.boot</groupId>
         <artifactId>spring-boot-devtools</artifactId>
         <optional>true</optional> <!-- 这个需要为 true 热部署才有效 -->
         <scope>runtime</scope>
</dependency>
```

## spring常用注解

## 常用注解

### @Component

**元注解**

在类上使用,只有一个参数value: String,为该组件创建一个别名,当类名重复时应该添加别名,组件名默认为首字母小写的类名

添加了@Component注解的类,ioc会去管理这个bean.

### @bean

### @scope

ioc容器的一个作用域.有以下几种作用域:

- singleton.  在整个应用中，只创建bean的一个实例 
- prototype.  每次注入或者通过spring应用上下文获取的时候，都会创建一个新的bean实例。 
- request.  在Web应用中，为每个请求创建一个bean实例。 
- session.  在web应用中，为每个会话创建一个bean实例。 
- globalsession.  global session作用域类似于标准的HTTP Session作用域，不过它仅仅在基于portlet的web应用中才有意义 

 对于Spring而言，在默认情况下其所有的bean都是以单例的形式创建的。即无论给定的一个bean被注入到其他bean多少次，每次所注入的都是同一个实例.

**proxyMode**

使用基于会话的作用域时,spring会生成代理:接口代理,类代理(cglib)

### @Value

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

### @Lazy

spring在启动的时候默认会去加载所有的bean

@Lazy用于指定该Bean是否取消预初始化。使用该Annotation时可以指定一个boolean型的value属性，该属性决定是否要

预初始化该Bean

当项目中出现循环引用时,可以使用该注解

### @ControllerAdvice 

增强controller

处理全局异常优先使用@ControllerAdvice 

- 处理异常 方法上声明异常的处理类型,注解@ExceptionHandler(Exception.class),捕获异常
- 全局数据绑定  我们可以将一些公共的数据定义在添加了`@ControllerAdvice`注解的类中，这样，可以在需要的时候，在每一个controller中访问到这些数据
- 全局数据预处理

### @ResponseBody

### @RestControllerAdvice

等同于@ControllerAdvice + @ResponseBody

### @SpringBootApplication

```java
// 声明禁用自动配置数据库
exclude= {DataSourceAutoConfiguration.class}
```

### @AutoWired

 **依赖注入：Dependency Injection，简称DI，说白了就是利用反射机制为类的属性赋值的操作** 

 自动装配 bean 对象

### @Qualifier

如果某个service有多个实现类,需要指定实现类名称

 @Qualifier(value = "userServiceImpl01") 

### @Order

### @DependsOn

**1：直接或者间接标注在带有@Component注解的类上面;**

**2：直接或者间接标注在带有@Bean 注解的方法上面;**

通过依赖关系改变bean的初始化顺序

### @AutoConfigureAfter 

### @ Configuration 

用@Conﬁguration注释类表明其主要目的是作为bean定义的源(取代xml配置)

@Conﬁguration类允许通过调用同一类中的其他@Bean方法来定义bean之间的依赖关系

### @Configurable

为非Spring容器管理的对象注入依赖

 告诉`Spring`在构造函数运行之前将依赖注入到对象中。 

### @RequestMapping

### @GetMapping

## 整合aop

开启aop: 配置文件中  spring.aop.auto = true

## 5种通知类型

1. <b>前置通知</b>  在连接点前面执行，前置通知不会影响连接点的执行，除非此处抛出异常。
2. <b>正常返回通知</b>  在连接点正常执行完成后执行，如果连接点抛出异常，则不会执行。
3. <b>异常返回通知</b>  在连接点抛出异常后执行。 
4. <b>返回通知</b>  在连接点执行完成后执行，不管是正常执行完成，还是抛出异常，都会执行返回通知中的内容。 
5. <b>环绕通知</b>  环绕通知围绕在连接点前后，比如一个方法调用的前后。这是最强大的通知类型，能在方法调用前后自定义一些操作。环绕通知还需要负责决定是继续处理join point(调用ProceedingJoinPoint的proceed方法)还是中断执行。

#### ProceedingJoinPoint

只能在环绕通知中使用

## bean的初始化过程

## spring整合缓存

## spring上下文

## spring扩展接口

### MethodInvokingFactoryBean

**作用:**

1. 让某个实例的某个方法的返回值注入为Bean的实例
2. 让某个类的静态方法的返回值注入为Bean的实例

### ApplicationContextAware

**作用:** 获取容器ApplicationContext

**spring初始化完bean之后**会去检查bean是否实现了该接口,所以需要将实现类注册为`bean`.

`ApplicationContext`是 `Spring`中的容器，可以用来获取容器中的各种`bean`组件，注册监听事件，加载资源文件等功能。 获取`ApplicationContext`有多种方式,官方推荐实现`ApplicationContextAware`接口

## ioc

对象仅通过构造函数参数，工厂方法的参数,或在对象实例上设置的属性来定义其依赖项.容器创建bean时会注入依赖项.

 此过程从根本上讲是通过使用类的直接构造或诸如服务定位器模式之类的方法来控制其依赖项的实例化或位置的bean本身的逆过程（因此称为Control Inversion）。 

### Bean加载顺序

spring初始化bean顺序: 包从上到下,类从上到下...  **不应该依赖它**

由`ioc`管理的bean默认是单例的

使用`@DependsOn`注解可以控制bean初始化顺序

### DI

推荐使用构造器注入,可以确保依赖项不是null,如果构造函数有过多的参数,此时class应该重构.

1. 字段注入。 不推荐.

   - 优点: 简洁,容易扩展
   - 缺点: 容易空指针

2. 构造器注入。强依赖

   当你使用构造器方式注入，构造器参数的数量就会变得太多以至于很容易出现错误。拥有太多的依赖通常意味着你的类要承担更多的责任，明显违背了单一职责原则和关注点分离，这表明该类需要进一步检查和重构。

3. set注入。弱依赖

### 循环依赖

 Class A 需要通过构造函数注入实现 class B，而 class B 需要通过构造函数注入实现 class A.如果为 classes A 和 B 配置 beans 以相互注入，则 Spring IoC 容器会在运行时检测到此循环 reference，并抛出`BeanCurrentlyInCreationException` 

 一种可能的解决方案是编辑某些 classes 的 source code，以便由 setter 而不是构造函数配置。或者，避免构造函数注入并仅使用 setter 注入。换句话说，尽管不推荐使用，但您可以使用 setter 注入配置循环依赖项 

### spring是如何解决循环依赖?

**spring无法解决构造器注入引发的循环依赖**

spring现将Bean对象实例化(通过无参构造器)=>设置对象属性

### 如何检测是否有循环依赖?

在Bean创建时打个标记(创建中),如果递归调用回来发现还是处于创建中的状态=>循环依赖

## spring 定时任务

### @EnableScheduling

启动类加上注解` @EnableScheduling` 启用定时功能

Task类加上` @Component` 注解, 在需要启用的任务方法上加上` @Scheduled`

### @ Scheduled 

