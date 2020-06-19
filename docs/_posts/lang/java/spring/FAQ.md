# FAQ

## [MyBatis]诡异的Invalid bound statement (not found)错误

如下,在`application.yml`中定义`mapper`位置后, 找不到`mapper`(idea环境下)

```yaml
mybatis:  mapper-locations: classpath*:com/meelinked/mapper/*.xml
```

将`mapper`放到`resources`后,问题解决.<b>属实诡异</b>

```yaml
mybatis:  mapper-locations: classpath*:mapper/*.xml
```

