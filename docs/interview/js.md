---
title: js
date: 2021-03-14
tags:
 - js
publish: false
---

## 优化

### 防抖节流

#### debounce

```js
 function debounce(fun, delay = 150) {
   let timer
   return function (args) {
     //获取函数的作用域和变量
     const that = this
     const _args = args
     //每次事件被触发，都会清除当前的timeer，然后重写设置超时调用
     clearTimeout(timer)
     timer = setTimeout(function () {
       fun.call(that, _args)
     }, delay)
   }
 }
```

#### throttle

```js
function throttle(fun, delay = 150) {
  let last, deferTimer
  return function (args) {
    const that = this;
    let _args = arguments;
    let now = new Date();
    if (last && now < last + delay) {
      clearTimeout(deferTimer);
      deferTimer = setTimeout(function () {
        last = now;
        fun.apply(that, _args);
      }, delay)
    } else {
      last = now;
      fun.apply(that, _args);
    }
  }
}
```

## 手写

### Apply

```js
function _apply() {
  const that = arguments[0] || globalThis
  const fn = Symbol('fn')
  that[fn] = this
  const result = that[fn](...arguments[1])
  delete that[fn]
  return result
}
```

### list2tree

```javascript
function list2tree(arr, rootId = 0, id = 'id', pid = 'parentId', children = 'children') {
  const res = [];
  const map = new Map();
  let index = 0;
  let preLen;
  while (index >= 0) {
    console.log(arr[index], index, arr.length);
    map.set(arr[index][id], arr[index]);
    if (arr[index][pid] === rootId) {
      res.push(arr[index]);
      arr.splice(index, 1);
    } else if (map.has(arr[index][pid])) {
      const target = map.get(arr[index][pid]);
      if (!target[children]) target[children] = [];
      target[children].push(arr[index]);
      arr.splice(index, 1);
    } else {
      index++;
    }
    if (index >= arr.length) {
      if (preLen === arr.length) {
        index = -1;
      } else {
        preLen = arr.length;
        index = 0;
      }
    }
    if (arr.length === 0) {
      index = -1;
    }
  }
  return res;
}
```

### Promise

```js
/**
 * 自定义Promsie函数
 */

(function (window) {
  const PENDING = "pending";
  const RESOLVED = "resolved";
  const REJECTED = "rejected";

  class Promise {
    constructor(excutor) {
      const self = this;

      self.status = PENDING; // promise对象状态
      self.data = undefined; // promise对象指定一个用于存储结果数据的属性
      self.callbacks = []; // 待执行的回调函数

      function resolve(value) {
        if (self.status === PENDING) {
          self.status = RESOLVED;
          self.data = value;
          if (self.callbacks.length > 0) {
            setTimeout(() => {
              // 模拟宏队列任务
              self.callbacks.forEach((callbanckObj) => {
                callbanckObj.onResolved(value);
              });
            });
          }
        }
      }

      function reject(reason) {
        if (self.status === PENDING) {
          self.status = REJECTED;
          self.data = reason;
          if (self.callbacks.length > 0) {
            setTimeout(() => {
              // 模拟宏队列任务
              self.callbacks.forEach((callbanckObj) => {
                callbanckObj.onRejected(reason);
              });
            });
          }
        }
      }

      try {
        excutor(resolve, reject);
      } catch (error) {
        reject(error);
      }
    }

    /**
     * Promise原型对象的then()
     * 指定成功和失败的回调函数
     * 返回一个新的Promise
     */
    then(onResolved, onRejected) {
      const self = this;

      onResolved =
        typeof onResolved === "function" ? onResolved : (value) => value;

      onRejected =
        typeof onRejected === "function"
          ? onRejected
          : (reason) => {
              throw reason;
            };

      return new Promise((resolve, reject) => {
        function handle(callback) {
          try {
            const result = callback(self.data);
            if (result instanceof Promise) {
              result.then(resolve, reject);
            } else {
              resolve(result);
            }
          } catch (error) {
            reject(error);
          }
        }

        if (self.status === PENDING) {
          self.callbacks.push({
            onResolved() {
              handle(onResolved);
            },
            onRejected() {
              handle(onRejected);
            },
          });
        } else if (self.status === RESOLVED) {
          setTimeout(() => {
            handle(onResolved);
          });
        } else if (self.status === REJECTED) {
          setTimeout(() => {
            handle(onRejected);
          });
        }
      });
    }

    /**
     * Promise原型对象的catche()
     * 失败的回调函数
     * 返回一个新的Promise
     */
    catch(onRejected) {
      return this.then(undefined, onRejected);
    }

    /**
     * Promise函数对象resolve()
     * 返回一个指定结果成功的Promise
     */
    static resolve = function (value) {
      return new Promise((resolve, reject) => {
        if (value instanceof Promise) {
          value.then(resolve, reject);
        } else {
          resolve(value);
        }
      });
    };

    /**
     * Promise函数对象reject()
     * 返回一个指定rason的失败的Promise
     */
    static reject = function (reason) {
      return new Promise((resolve, reject) => {
        reject(reason);
      });
    };

    /**
     * Promise函数对象all()
     * 返回一个Promsise，只有当所有promise都成功时才成功，否则失败
     */
    static all = function (promises) {
      const values = new Array(promises.length);
      let count = 0;

      return new Promise((resolve, reject) => {
        promises.forEach((promise, index) => {
          Promise.resolve(promise).then(
            (value) => {
              count++;
              values[index] = value;
              if (count === promises.length) {
                resolve(values);
              }
            },
            (reason) => {
              reject(reason);
            }
          );
        });
      });
    };

    /**
     * Promise函数对象race()
     * 返回一个Promsise，其结果由第一个完成的promise决定
     */
    static race = function (promises) {
      return new Promise((resolve, reject) => {
        promises.forEach((promise) => {
          Promise.resolve(promise).then(resolve, reject);
        });
      });
    };
  }

  // 向外暴露Promise函数
  window.Promise = Promise;
})(window);

```

### instanceof

<a herf="https://imliuk.com/web/js-proto.html#instanceof-%E6%93%8D%E4%BD%9C%E7%AC%A6" target="_blank">instanceof 实现</a>

### deepClone

```js
function deepCopy(obj, map = new Map()) {
  if (typeof obj === 'object') {
    let res = Array.isArray(obj) ? [] : {};
	  if(map.get(obj)){
		  return map.get(obj);
	  }
	  map.set(obj,res);
    for(var i in obj){
		  res[i] = deepCopy(obj[i],map);
	  } 
	  return map.get(obj);
  } else {
  	return obj;
  }
};
```

### new操作符

```js
function newFn() {
    // 1 获取构造函数，以便实现作用域的绑定
    var _constructor = Array.prototype.shift.call(arguments);
    // 2 创建一个对象
    var o = Object.create(_constructor.prototype);
    // 4.作用域的绑定
    _constructor.apply(o, arguments);
    return o;
}
```

### 实现继承

1. 原型链
2. 构造函数
3. 实例继承

```js
/**
 * 构造函数实现继承
 * 原理：改变父类构造函数运行时的this指向，从而实现了继承
 * 不足：只实现部分继承，父类原型对象上的属性/方法子类取不到。
 */
function Parent1 () {
    this.name="parent1"
}
function Child1 () {
    Parent.call(this);
    this.type = "child1";
}
/**
 * 原理：原理：new Child2 => new Child2.__proto__ === Child2.prototype => new Parent2() => new Parent2().__proto__ === Parent2.prototype，所以实现了Child2实例继承自Parent2的原型对象。
 * 不足：多个实例共用一个父类的实例对象，修改其中一个实例上的引用对象，会对其他实例造成影响。
 */
function Parent2 () {
    this.name = "parent2";
}
function Child2 () {
    this.name = "child2";
}
Child2.prototype = new Parent2();

/**
 * 优点：弥补了原型链继承的缺点，实例修改父类上的引用对象时，不会对其他实际造成影响
 * 不足：父级构造函数执行两次，子类构造函数指向父类构造函数
 */
function Parent3 () {
    this.name = "parent3";
}
function Child3 () {
    Parent3.call(this);
}
Child3.prototype = new Parent3();

/**
 * 组合方式优化
 * 不足：子类构造函数仍旧指向父类构造函数
 */
function Parent4 () {
    this.name = "parent4";
}
function Child4 () {
    Parent4.call(this);
}
Child4.prototype = Parent4.prototype;
/**
 * 优点：Object.create()生成中间对象，隔离了子/父类原型对象，使之不会互相影响。
 */
function Parent5 () {
    this.name = "parent5";
}
function Child5 () {
    Parent5.call(this);
}
Child5.prototype = Object.create(Parent5.prototype);
Child5.prototype.constructor = Child5;

```

### 图片懒加载

- 图片全部加载完成后移除事件监听
- 加载完的图片，从 imgList 移除

```js
let imgList = [...document.querySelectorAll('img')]
let length = imgList.length

const imgLazyLoad = function() {
    let count = 0
    return function() {
        let deleteIndexList = []
        imgList.forEach((img, index) => {
            let rect = img.getBoundingClientRect()
            if (rect.top < window.innerHeight) {
                img.src = img.dataset.src
                deleteIndexList.push(index)
                count++
                if (count === length) {
                    document.removeEventListener('scroll', imgLazyLoad)
                }
            }
        })
        imgList = imgList.filter((img, index) => !deleteIndexList.includes(index))
    }
}

// 最好加上防抖处理
document.addEventListener('scroll', imgLazyLoad)
```

## ==比较规则

相等运算符（`==`和`!=`）使用抽象相等比较算法比较两个操作数。可以大致概括如下：

- 如果两个操作数都是对象，则仅当两个操作数都引用同一个对象时才返回`true`。

- 如果一个操作数是`null`，另一个操作数是`undefined`，则返回`true`。

- 如果两个操作数是不同类型的，就会尝试在比较之前将它们转换为相同类型：

  - 当数字与字符串进行比较时，会尝试将字符串转换为数字值。

  - 如果操作数之一是布尔值, 则将布尔操作数转换为1或0。

    - 如果是`true`，则转换为`1`。
- 如果是 `false`，则转换为`0`。
  
  - 如果操作数之一是对象，另一个是数字或字符串，会尝试使用对象的`valueOf()`和`toString()`方法将对象转换为原始值。

- 如果操作数具有相同的类型，则将它们进行如下比较：

  - `String`：`true`仅当两个操作数具有相同顺序的相同字符时才返回。
  - `Number`：`true`仅当两个操作数具有相同的值时才返回。`+0`并被`-0`视为相同的值。如果任一操作数为`NaN`，则返回`false`。
  - `Boolean`：`true`仅当操作数为两个`true`或两个`false`时才返回`true`。

此运算符与严格等于（`===`）运算符之间最显着的区别在于，严格等于运算符不尝试类型转换。相反，严格相等运算符始终将不同类型的操作数视为不同。

## 函数式编程

### 函数柯里化

```js
function add () {
    var args = Array.prototype.slice.call(arguments);
    var fn = function () {
        var fn_args = Array.prototype.slice.call(arguments);
        return add.apply(null, args.concat(fn_args));
    };
    fn.valueOf = function () {
        return args.reduce(function (a, b) {
            return a + b;
        });
    };
    return fn;
}
```

