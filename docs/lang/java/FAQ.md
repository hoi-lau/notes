---
title: java之faq
publish: false
---

## serialVersionUID

作用: 序列化版本号 

serialVersionUID作用： 
    序列化时为了保持版本的兼容性，即在版本升级时反序列化仍保持对象的唯一性。
 有两种生成方式：
    一个是默认的1L，比如：private static final long serialVersionUID = 1L;
    一个是根据类名、接口名、成员方法及属性等来生成一个64位的哈希字段，比如：
    private static final  long   serialVersionUID = xxxxL;
关于其定义，可参考JDK文档：http://download.oracle.com/javase/1.5.0/docs/api/java/io/Serializable.html

 在Eclipse中，提供两种方式让我们快速添加SerialVersionUid。

 add default serial version ID：
 Adds a default serial version ID to the selected type
 Use this option to add a user-defined ID in combination with custom  serialization code if the type did undergo structural change since its  first release.

 add generated serial version ID：
 Adds a generated serial version ID to the selected type
 Use this option to add a compiler-generated ID if the type didnot undergo structural change since its first release.

 一种就是1L，一种是生成一个很大的数，这两种有什么区别呢？

 看上去，好像每个类的这个类不同，似乎这个SerialVersionUid在类之间有某种关联。其实不然，两种都可以，从JDK文档也看不出这一点。我们只要保证在同一个类中，不同版本根据兼容需要，是否更改SerialVersionUid即可。

 对于第一种，需要了解哪些情况是可兼容的，哪些根本就不兼容。 参考文档：http://java.sun.com/j2se/1.4/pdf/serial-spec.pdf

 在可兼容的前提下，可以保留旧版本号，如果不兼容，或者想让它不兼容，就手工递增版本号。

 1->2->3.....

 第二种方式，是根据类的结构产生的hash值。增减一个属性、方法等，都可能导致这个值产生变化。我想这种方式适用于这样的场景：

 开发者认为每次修改类后就需要生成新的版本号，不想向下兼容，操作就是删除原有serialVesionUid声明语句，再自动生成一下。

总的来说，serialVersionUID属性相当于Java对象的序列化版本号（类似于人类指纹），编译器会根据这个值来判断能否反序列化，在我们没指定对象的serialVersionUID属性时，对象也会有一个自动生成的serialVersionUID属性。

因此，如果我们需要对象在序列化后改变不影响反序列化，就必须指定实体类的serialVersionUID属性。
