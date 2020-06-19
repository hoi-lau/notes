# context

## RequestContextHolder

以线程绑定的形式公开当前web请求

```java
ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
```



