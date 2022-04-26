---

title: socket编程
date: 2021-10-08
categories: 
 - linux
tags:
 - socket
publish: false
---

## 结构体

### 地址

#### sockaddr && sockaddr_in

```cpp
// 头文件 <sys/socket.h>
struct sockaddr {
        unsigned char sa_len; /* total length; 存在于freeBSD上, https://www.ibm.com/docs/en/i/7.4?topic=characteristics-socket-address-structure */
        ushort  sa_family; /* AF_INET: UDP, TCP, etc AF_INET6: ipv6 AF_UNIX: 本机 */
        char    sa_data[14]; /* 1.实际上可能超过14 2.在unix中不指定长度 */
};
// 头文件 <netinet/in.h>
struct sockaddr_in {
        short   sin_family;
        u_short sin_port; // 端口
        struct  in_addr sin_addr; // 地址
        char    sin_zero[8]; // 保留
};

struct in_addr {
	in_addr_t s_addr;
};
```

### 文件描述符

#### fd_set

```c
FD_SET(int fd, fd_set *fdset);       //将fd加入set集合
FD_CLR(int fd, fd_set *fdset);       //将fd从set集合中清除
FD_ISSET(int fd, fd_set *fdset);     //检测fd是否在set集合中，不在则返回0
FD_ZERO(fd_set *fdset);              //将set清零使集合中不含任何fd
```



## 函数

### 套接字

#### socket

```c
socket(int domain, int type, int protocol);
```

#### bind

> socket() 函数用来创建套接字，确定套接字的各种属性，然后服务器端要用 bind() 函数将套接字与特定的 IP 地址和端口绑定起来

```c
int bind(int, const sockaddr *, socklen_t)
```

#### connect

> connect() 函数用来建立连接, 客户端使用.

#### listen && accept	

> 对于服务器端程序，使用 bind() 绑定套接字后，还需要使用 listen() 函数让套接字进入被动监听状态，再调用 accept() 函数，就可以随时响应客户端的请求了。

```c
int listen(int socket, int backlog);
// backlog 参数定义 连接未完成的缓冲队列。 如果连接请求到达时队列已满，客户端可能会收到带有 ECONNREFUSED 指示的错误。 或者，如果底层协议支持重传，则可以忽略该请求，以便重试可能会成功。
int accept(int socket, struct sockaddr *restrict address, socklen_t *restrict address_len);
```

### 转换函数

htonl()--"Host to Network Long"
ntohl()--"Network to Host Long"
htons()--"Host to Network Short"
ntohs()--"Network to Host Short"

#### inet_addr && inet_ntoa

```c
#include <arpa/inet.h>
// 转换ip地址 eg: 192.168.0.1
in_addr_t	 inet_addr(const char *);
// 互转
char		*inet_ntoa(struct in_addr);
```

#### inet_pton && inet_ntop

```c
#include <arpa/inet.h>
// 将点分十进制的ip地址转化为用于网络传输的数值格式, 兼容ipv6
int inet_pton(int af, const char * restrict src, void * restrict dst);
// 将数值格式转化为点分十进制的ip地址格式
const char *inet_ntop(int af, const void * restrict src, char * restrict dst, socklen_t size);
```

### 传输数据

#### write && read

#### send && recv

**只能用于socket**

```c
ssize_t send(int socket, const void *buffer, size_t length, int flags);
// flags
// | MSG_DONTROUTE | 不查找表 |
// | MSG_OOB | 接受或者发送带外数据 |
ssize_t recv(int socket, void *buffer, size_t length, int flags);
// | MSG_OOB | 接受或者发送带外数据 |
// | MSG_PEEK | 查看数据,并不从系统缓冲区移走数据 |
// | MSG_WAITALL | 等待所有数据 |

```

