---
title: js 原型
date: 2020-10-13
categories: 
 - web
tags:
 - js
---

## 几个重要的方法

###  **Object.getPrototypeOf()** 

 返回指定对象的[隐式原型](#implicit)(\__proto__)

```js
const prototype1 = {}
const object1 = Object.create(prototype1)
Object.getPrototypeOf(object1) === prototype1 // true
Object.getPrototypeOf(object1) === object1.__proto__ // true
```

### Object.create()

 **`Object.create()`**方法创建一个新对象，使用现有的对象来提供新创建的对象的\__proto__。 

```js
const person = {
  isHuman: false,
  print: function() {
    console.log(`My name is ${this.name}. Am I human? ${this.isHuman}`);
  }
};

const me = Object.create(person);
me.name = 'Matthew'; // "name" is a property set on "me", but not on "person"
me.isHuman = true; // inherited properties can be overwritten
me.print();
// "My name is Matthew. Am I human? true"
```

### Function.prototype.bind()

 `bind()` 方法创建一个新的函数，在 `bind()` 被调用时，这个新函数的 `this` 被指定为 `bind()` 的第一个参数，而其余参数将作为新函数的参数，供调用时使用。 

## prototype(显式原型)

 每一个函数在创建之后都会有一个名为`prototype`的属性, 这个属性指向该函数的原型对象, 该原型对象有一个名为`constructor `的属性, 这个属性指向原构造函数.

> 通过bind方法创建的函数没有prototype

```js
function fn() {}
fn.prototype.constructor === fn // true
const copy = fn.bind(this)
copy.prototype // undefined
```

## <span id="implicit">\__proto__</span>(隐式原型)

JavaScript中任意对象都有一个内置属性[[prototype]]，在ES5之前没有标准的方法访问这个内置属性，但是大多数浏览器都支持通过\__proto__来访问。ES5中有了对于这个内置属性标准的Get方法`Object.getPrototypeOf()`.

一个对象的隐式原型指向构造该对象的构造函数的显式原型 

```js
function Base() {
    this.name = 'name'
}
var obj = new Base()
Object.getPrototypeOf(obj) === Base.prototype // true
// Base函数的构造函数就是 Function
Object.getPrototypeOf(Base) === Function.prototype // true
// 函数的显式原型也是对象,指向它的构造函数的原型对象,也就是Object.prototype
Object.getPrototypeOf(Function.prototype) === Object.prototype // true
// Object.prototype的__proto__属性指向null
Object.getPrototypeOf(Object.prototype) // null
```

## Object.prototype.constructor

##  **instanceof** 操作符

 instanceof 操作符的内部实现机制和隐式原型、显式原型有直接的关系 

```js
function fn() {this.name = 'fn'}
fn instanceof Function // true
const obj = new fn()
obj instanceof fn // true
const obj1 = Object.create(obj)
obj1 instanceof fn
```

**instanceof运算符定义**

```js
function instance_of(L, R) {//L 表示左表达式，R 表示右表达式
  let RP = R.prototype;// 取 R 的显示原型
  let LP = Object.getPrototypeOf(L);// 取 L 的隐式原型
  while (true) {
    if (LP === null)
      return false;
    if (RP === LP)// 这里重点：当 O 严格等于 L 时，返回 true
      return true;
    LP = Object.getPrototypeOf(LP);
  }
 }
// Object.__proto__.__proto__ === Object.prototype
Object instanceof Object // true
// Function.__proto__ === Function.prototype
Function instanceof Function // true
// Object.__proto__ === Function.prototype
Object instanceof Function // true
// Function.__proto__.__proto__ === Object.prototype
Function instanceof Object // true
```

## new到底做了什么

```js
function Base() {
    this.name = 'base'
	return 'call'
}
const obj = new Base() // Base {name: "base"}
const res = Base() // "call"
```

**`new`** 关键字会进行如下的操作：

1. 新建一个 ECMAScirpt 原生对象 obj；
2. 为 obj 添加所有对象的内部方法；
3. 将 obj 的内部属性 [[Class]] 设为“Object”；
4. 将 obj 的内部属性 [[Extensible]] 设为 true；
5. 调用 F 的 [[Get]] 内部方法，传入参数“prototype”，结果保存到 proto（即获取 F 的prototype 属性，相当于 var proto = F.prototype）；
6. 如果 proto 的类型是 Object，将 obj 的内部属性 [[Prototype]] 设为 proto；
7. 如果 proto 的类型不是 Object，将 obj 的内部属性 [[Prototype]] 设为内建 Object 原型对象；
// 到这为止，已经有一个对象存在于内存，这个对象有标准的 Object 都有的内部属性、方法以及原型。
8. 调用 F 的 [[Call]] 内部方法，将 obj 作为 this 值传入，将传入 [[Construct]] 方法的参数列表作为参数传入，结果保存到 result（result 可看作函数的返回）；
9. 如果 result 的类型是 Object，则返回result；
10. 返回 obj
