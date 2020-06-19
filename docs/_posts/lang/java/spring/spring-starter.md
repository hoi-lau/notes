# springboot initializr

<a href="https://start.spring.io/" _target="_blank">https://start.spring.io/</a>

## application.yml 示例

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



## application-dev.yml 示例

```yml
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

## logback.xml

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

## 配置元数据

1. xml配置
2. spring2.5, 基于注解的配置
3. 基于java的配置

## 热更新

```xml
<dependency>
         <groupId>org.springframework.boot</groupId>
         <artifactId>spring-boot-devtools</artifactId>
         <optional>true</optional> <!-- 这个需要为 true 热部署才有效 -->
         <scope>runtime</scope>
</dependency>
```

