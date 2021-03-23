---
title: 从源码看Vue如何解决循环引用
date: 2021-03-17
categories:
 - web
tags: 
 - vue
 - js

---

**问题抛出**

当递归遍历对象时,如果不对循环引用进行处理,将会导致堆栈溢出

```js
const a = {}
const b = {}
a.b = b 
b.a = a

function cout(a) {
    for (const key in a) {
        if (Object.prototype.toString.call(a[key]).slice(8, -1) === 'Object') {
            cout(a[key])
        } else {
            console.log(a[key])
        }
    }
}
cout(a)
// Uncaught RangeError: Maximum call stack size exceeded
```

尝试以下代码

```js
new Vue({
    el: '#app',
    data() {
        let a = {}
        let b = {}
        b.a = a
        a.b = b
        return {
            a: a
        }
    }
})
```

众所周知, new一个vue实例会对data函数中返回的对象进行递归遍历, 并且没有抛出堆栈溢出异常,可见vue内部已经对循环引用做了处理.

贴一段源码:

```js
// src/core/observer/index.js
// line 35 ~ 76
export class Observer {
  value: any;
  dep: Dep;
  vmCount: number;
  constructor (value: any) {
    this.value = value
    // 每一个观察者对象都有一个依赖收集器
    this.dep = new Dep()
    this.vmCount = 0
    // 将当前对象绑定到value的__ob__属性上
    def(value, '__ob__', this)
    // 数组和对象处理方式不一致
    if (Array.isArray(value)) {
      const augment = hasProto
        ? protoAugment
        : copyAugment
      augment(value, arrayMethods, arrayKeys)
      this.observeArray(value)
    } else {
      this.walk(value)
    }
  }
  // 对于对象的处理
  walk (obj: Object) {
    const keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i], obj[keys[i]])
    }
  }
  // 对于数组的处理
  observeArray (items: Array<any>) {
    for (let i = 0, l = items.length; i < l; i++) {
      observe(items[i])
    }
  }
}

// line 107 ~ 127
export function observe (value: any, asRootData: ?boolean): Observer | void {
  // 对于非引用类型不处理
  if (!isObject(value) || value instanceof VNode) {
    return
  }
  let ob: Observer | void
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__
  } else if (
    observerState.shouldConvert &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    // 为value创建一个Observer对象并绑定到__ob__属性上
    ob = new Observer(value)
  }
  if (asRootData && ob) {
    ob.vmCount++
  }
  return ob
}

// 为一个对象声明响应式
// line 132 ~ 186
export function defineReactive (
  obj: Object,
  key: string,
  val: any,
  customSetter?: ?Function,
  shallow?: boolean
) {
  // 为每一个属性创建一个Dep的实例
  const dep = new Dep()
  const property = Object.getOwnPropertyDescriptor(obj, key)
  if (property && property.configurable === false) {
    return
  }
  const getter = property && property.get
  const setter = property && property.set
  // observe(val) val为对象
  let childOb = !shallow && observe(val)
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      const value = getter ? getter.call(obj) : val
      if (Dep.target) {
        dep.depend()
        if (childOb) {
          childOb.dep.depend()
          if (Array.isArray(value)) {
            dependArray(value)
          }
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      const value = getter ? getter.call(obj) : val
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      if (process.env.NODE_ENV !== 'production' && customSetter) {
        customSetter()
      }
      if (setter) {
        setter.call(obj, newVal)
      } else {
        val = newVal
      }
      childOb = !shallow && observe(newVal)
      dep.notify()
    }
  })
}
```

上述代码声明响应式的全过程(initData过程)

1. 调用`data`函数返回一个新的对象`rootData`.
2. observe(rootData, true). 为`rootData`创建一个观察者
3. walk(rootData). 遍历对象`rootData`的每一个属性,此时`rootData`仅有属性`'a'`
4. defineReactive(rootData, 'a', a) => observe(a). 为对象`a`创建一个观察者
5. walk(a). 遍历对象`a`的每一个属性,此时对象`a`仅有属性`'b'`
6. defineReactive(a, 'b', b) => observe(b). 为对象`b`创建一个观察者
7. walk(b). 遍历对象`b`的每一个属性,此时对象`b`仅有属性`'a'`
8. defineReactive(b, 'a', a) => observe(a). 此时对象`a`已经创建过观察者`a.__ob__`, 递归结束

**关键代码位于 112 行**

```js
// 如果已经为该对象创建过观察者对象,复用之前的观察者对象
if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__
}
```

## 总结

vue声明响应式数据阶段处于beforeCreate和created生命周期之间, 对每一个对象创建一个观察者
