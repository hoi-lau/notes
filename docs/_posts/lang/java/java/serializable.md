# java序列化

要实现Java对象的序列化，只要将类**实现Serializable或Externalizable接口**即可。

## serializable

`java`将实现了`serializable`接口对象转换为一个字节序列, 并且能够将这个字节序列完全恢复为原来的对象.

<b>对象以它存储的二进制位为基础来构造,不会调用构造器.</b>

使用了`transient`关键字修饰的属性将不会被序列化

无法序列化被`static`修饰的属性,必须自己手动去实现



## Externalizable

对于一个实现了**Externalizable**接口的对象,序列化时会调用所有普通的默认构造器,然后调用`readExternal`

## 序列化

1. 创建`OutputStream`对象,将其封装在`ObjectOutputStream`中
2. 调用`writeObject` 
3. 关闭流(java会自动flush)

## 反序列化

1. 将一个`InputStream`封装在`ObjectInputStream`内
2. 调用`readObject`
3. 向下转型
4. 关闭流

## 序列化的控制