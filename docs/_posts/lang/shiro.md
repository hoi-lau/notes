---
title: shiro学习
category: 
 - java
tags: 
 - shiro
---

shiro是一个Java安全框架，提供了认证、授权、加密和会话管理功能 

```xml
// 在springboot中使用如下依赖, shiro自动配置
<dependency>
    <groupId>org.apache.shiro</groupId>
    <artifactId>shiro-spring-boot-web-starter</artifactId>
    <version>1.4.0</version>
</dependency>
// 在ssm下使用如下依赖
<dependency>
    <groupId>org.apache.shiro</groupId>
    <artifactId>shiro-web</artifactId>
    <version>1.4.0</version>
</dependency>
<dependency>
    <groupId>org.apache.shiro</groupId>
    <artifactId>shiro-spring</artifactId>
    <version>1.4.0</version>
</dependency>
```



## 核心概念

### Subject 

 主体，代表了当前 “用户”，这个用户不一定是一个具体的人，与当前应用交互的任何东西都是 Subject，如网络爬虫，机器人等；即一个抽象概念；所有 Subject 都绑定到 SecurityManager，与 Subject 的所有交互都会委托给 SecurityManager；可以把 Subject 认为是一个门面,我们的应用程序直接与Subject交互；SecurityManager 才是实际的执行者； 

```java
import org.apache.shiro.subject.Subject;
import org.apache.shiro.SecurityUtils;
...
// 获取当前`用户`,就是这么简单!
Subject currentUser = SecurityUtils.getSubject();
```

### SecurityManager 

 安全管理器；即所有与安全有关的操作都会与 SecurityManager 交互；且它管理着所有 Subject；可以看出它是 Shiro 的核心，它负责与后边介绍的其他组件进行交互，如果学习过 SpringMVC，你可以把它看成 DispatcherServlet 前端控制器； 

###  Realm

 域，Shiro 从从 Realm 获取安全数据（如用户、角色、权限），就是说 SecurityManager 要验证用户身份，那么它需要从 Realm 获取相应的用户进行比较以确定用户身份是否合法；也需要从 Realm 得到用户相应的角色 / 权限进行验证用户是否能进行操作；可以把 Realm 看成 DataSource，即安全数据源.

`realm`是一个安全组件，它可以访问特定于应用程序的安全实体，如用户、角色和权限，以确定身份验证和授权操作。

`realm`通常与数据源(如关系数据库、文件系统或其他类似资源)具有1对1的对应关系。

一般不会直接实现Realm接口，但是会扩展其中一个子类，<del>AuthenticatingRealm</del>或AuthorizingRealm，从而大大减少从头实现Realm所需的工作。

## 功能

**Authentication**：身份认证 / 登录，验证用户是不是拥有相应的身份；

**Authorization**：授权，即权限验证，验证某个已认证的用户是否拥有某个权限；即判断用户是否能做事情，常见的如：验证某个用户是否拥有某个角色。或者细粒度的验证某个用户对某个资源是否具有某个权限；

**Session Manager**：会话管理，即用户登录后就是一次会话，在没有退出之前，它的所有信息都在会话中；会话可以是普通 JavaSE 环境的，也可以是如 Web 环境的；

**Cryptography**：加密，保护数据的安全性，如密码加密存储到数据库，而不是明文存储；

**Web Support**：Web 支持，可以非常容易的集成到 Web 环境；

**Caching**：缓存，比如用户登录后，其用户信息、拥有的角色 / 权限不必每次去查，这样可以提高效率；

**Concurrency**：shiro 支持多线程应用的并发验证，即如在一个线程中开启另一个线程，能把权限自动传播过去；

**Testing**：提供测试支持；

**Run As**：允许一个用户假装为另一个用户（如果他们允许）的身份进行访问；

**Remember Me**：记住我，这个是非常常见的功能，即一次登录后，下次再来的话不用登录了。

## 身份认证流程

1. 首先调用 Subject.login(token) 进行登录，其会自动委托给 Security Manager，调用之前必须通过 SecurityUtils.setSecurityManager() 设置；
2. SecurityManager 负责真正的身份验证逻辑；它会委托给 Authenticator 进行身份验证；
3. Authenticator 才是真正的身份验证者，Shiro API 中核心的身份认证入口点，此处可以自定义插入自己的实现；
4. Authenticator 可能会委托给相应的 AuthenticationStrategy 进行多 Realm 身份验证，默认 ModularRealmAuthenticator 会调用 AuthenticationStrategy 进行多 Realm 身份验证；
5. Authenticator 会把相应的 token 传入 Realm，从 Realm 获取身份验证信息，如果没有返回 / 抛出异常表示身份验证失败了。此处可以配置多个 Realm，将按照相应的顺序及策略进行访问。

## filter

### shiro自带过滤器

// 查看类DefaultFilter

这些过滤器分为两组：

u 认证过滤器：**anon(不认证也可以访问)**，authcBasic, **authc(必须认证后才可**

**访问),user**

u 授权过滤器：**perms（指定资源需要哪些权限才可以访问）**，Roles, ssl,rest, port

1. `/admin/**=anon` ：无参，表示可匿名访问
2. `/admin/user/**=authc` ：无参，表示需要认证才能访问
3. `/admin/user/**=authcBasic` ：无参，表示需要httpBasic认证才能访问
4. `/admin/user/**=ssl` ：无参，表示需要安全的URL请求，协议为https
5. `/home=user` ：表示用户不一定需要通过认证，只要曾被 Shiro 记住过登录状态就可以正常发起 /home 请求
6. `/edit=authc,perms[admin:edit]`：表示用户必需已通过认证，并拥有 admin:edit 权限才可以正常发起 /edit 请求
7. `/admin=authc,roles[admin]` ：表示用户必需已通过认证，并拥有 admin 角色才可以正常发起 /admin 请求
8. `/admin/user/**=port[8081]` ：当请求的URL端口不是8081时，跳转到schemal://serverName:8081?queryString
9. `/admin/user/**=rest[user]` ：根据请求方式来识别，相当于 `/admins/user/**=perms[user:get]或perms[user:post]` 等等
10. `/admin**=roles["admin,guest"]` ：允许多个参数（逗号分隔），此时要全部通过才算通过，相当于hasAllRoles()
11. `/admin**=perms["user:add:*,user:del:*"]`：允许多个参数（逗号分隔），此时要全部通过才算通过，相当于isPermitedAll()

| Filter Name             | Class                                                        |
| ----------------------- | ------------------------------------------------------------ |
| anon(任何人都可以访问)  | org.apache.shiro.web.filter.authc.AnonymousFilter            |
| authc(需要认证)         | org.apache.shiro.web.filter.authc.FormAuthenticationFilter   |
| authcBasic              | org.apache.shiro.web.filter.authc.BasicHttpAuthenticationFilter |
| logout(登出)            | org.apache.shiro.web.filter.authc.LogoutFilter               |
| noSessionCreation       | org.apache.shiro.web.filter.session.NoSessionCreationFilter  |
| perms(必须得到资源权限) | org.apache.shiro.web.filter.authz.PermissionsAuthorizationFilter |
| port                    | org.apache.shiro.web.filter.authz.PortFilter                 |
| rest                    | org.apache.shiro.web.filter.authz.HttpMethodPermissionFilter |
| roles                   | org.apache.shiro.web.filter.authz.RolesAuthorizationFilter   |
| ssl                     | org.apache.shiro.web.filter.authz.SslFilter                  |
| user                    | org.apache.shiro.web.filter.authc.UserFilter                 |

 Shiro提供了与Web集成的支持，其通过一个`ShiroFilter`入口来拦截需要安全控制的URL，然后进行相应的控制.

```java
@Bean
public ShiroFilterFactoryBean factoryBean(DefaultWebSecurityManager securityManager) {
    ShiroFilterFactoryBean factoryBean = new ShiroFilterFactoryBean();

    // 添加自己的过滤器
    // Map<String, Filter> filterMap = new LinkedHashMap<>();
    // filterMap.put("httpFilter", new HttpFilter());
    // factoryBean.setFilters(filterMap);
    factoryBean.setSecurityManager(securityManager);
    // 设置未授权url
    // factoryBean.setUnauthorizedUrl("/401.html");
    // 设置登录url 默认是login.jsp
    // factoryBean.setLoginUrl("/login.html");
    factoryBean.setLoginUrl("/api/unauth");
    /*
         * 自定义url规则
         * http://shiro.apache.org/web.html#urls-
         */
    Map<String, String> filterRuleMap = new HashMap<>();
    // 所有请求通过我们自己的JWT Filter
    // 访问401和404页面不通过我们的Filter
    filterRuleMap.put("/401", "anon");
    filterRuleMap.put("/404", "anon");
    filterRuleMap.put("/api/unauth", "anon");
    filterRuleMap.put("/index.html", "user");
    // filterRuleMap.put("/api/**", "httpFilter");
    filterRuleMap.put("/api/login", "anon");
    filterRuleMap.put("/**", "user");
    factoryBean.setFilterChainDefinitionMap(filterRuleMap);
    return factoryBean;
}
```

###  AccessControlFilter 

自定义拦截器

## 并发控制

思路: 将session标记为`kicked`,下次请求时返回被踢出信息(而不是调用logout()),然后再注销

## session

session会话管理.可以使用shiro默认的DefaultWebSessionManager,或者继承它覆盖默认获取session方式,**然后交给DefaultWebSecurityManager管理**

```java
import org.apache.shiro.web.servlet.ShiroHttpServletRequest;
import org.apache.shiro.web.session.mgt.DefaultWebSessionManager;
import org.apache.shiro.web.util.WebUtils;
import org.springframework.util.StringUtils;

import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import java.io.Serializable;

public class MySessionManager extends DefaultWebSessionManager {

    private static final String AUTHORIZATION = "Authorization";

    private static final String REFERENCED_SESSION_ID_SOURCE = "Stateless request";

    public MySessionManager() {
        super();
    }
    // 修改获取session的方式
    @Override
    protected Serializable getSessionId(ServletRequest request, ServletResponse response) {
        String id = WebUtils.toHttp(request).getHeader(AUTHORIZATION);
        //如果请求头中有 Authorization 则其值为sessionId
        if (!StringUtils.isEmpty(id)) {
            request.setAttribute(ShiroHttpServletRequest.REFERENCED_SESSION_ID_SOURCE, REFERENCED_SESSION_ID_SOURCE);
            request.setAttribute(ShiroHttpServletRequest.REFERENCED_SESSION_ID, id);
            request.setAttribute(ShiroHttpServletRequest.REFERENCED_SESSION_ID_IS_VALID, Boolean.TRUE);
            return id;
        } else {
            //否则按默认规则从cookie取sessionId
            return super.getSessionId(request, response);
        }
    }

}
```

## cache

 Shiro 提供了类似于 Spring 的 Cache 抽象，即 Shiro 本身不实现 Cache，但是对 Cache 进行了又抽象，方便更换不同的底层 Cache 实现。 

eg: 使用`ehcache`缓存权限信息,一般不缓存认证信息.

```xml
<dependency>
    <groupId>net.sf.ehcache</groupId>
    <artifactId>ehcache</artifactId>
    <version>2.10.6</version>
</dependency>
<dependency>
    <groupId>org.apache.shiro</groupId>
    <artifactId>shiro-ehcache</artifactId>
    <version>1.4.1</version>
</dependency>
```

基于`java`的配置

```java
// 权限更改后可以在MyRealm中清除缓存
@Bean("myRealm")
public MyRealm getMyRealm() {    
    MyRealm myRealm = new MyRealm();    
    myRealm.setCachingEnabled(true);    
    // 身份认证一般不缓存,没有必要    
    myRealm.setAuthenticationCachingEnabled(false);
    // myRealm.setAuthenticationCacheName("authenticationCache");
    // 缓存权限信息    
    myRealm.setAuthorizationCachingEnabled(true);    
    // 设置缓存名
    myRealm.setAuthorizationCacheName("authorizationCache");    
    return myRealm;
}

// shiro缓存管理器;需要添加到securityManager中
@Bean("ehCacheManager")
public EhCacheManager ehCacheManager() {
    EhCacheManager cacheManager = new EhCacheManager();
    cacheManager.setCacheManagerConfigFile("classpath:ehcache.xml");
    return cacheManager;
}
```

**over !!!**

## FAQ

### 第一次重定向url带有JSSESSIONID问题

`sessionManager.setSessionIdUrlRewritingEnabled(false);`