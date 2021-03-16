---
title: vue知识点汇总
date: 2019-04-03
tags:
 - vue
publish: false
---

## 原理相关

### 双向绑定原理

`数据劫持` + `观察者模式`

### 响应式原理

**vue.js 采用数据劫持结合观察者模式,通过 Object.defineproperty 来劫持各个属性的 setter,getter,在数据变动时发布消息给订阅者,触发响应的监听回调**

#### 核心实现类:

Observer : 它的作用是给对象的属性添加 getter 和 setter，用于依赖收集和派发更新

Dep : 用于收集当前响应式对象的依赖关系,每个响应式对象包括子对象都拥有一个 Dep 实例（里面 subs 是 Watcher 实例数组）,当数据有变更时,会通过 dep.notify()通知各个 watcher。

Watcher : 观察者对象 , 实例分为渲染 watcher (render watcher),计算属性 watcher (computed watcher),侦听器 watcher（user watcher）三种

### key的作用

key 是给每一个 vnode 的唯一 id,依靠 key,我们的 diff 操作可以更准确、更快速 (对于简单列表页渲染来说 diff  节点也更快,但会产生一些隐藏的副作用,比如可能不会产生过渡效果,或者在某些节点有绑定数据（表单）状态，会出现状态错位。)

**diff 算法的过程中,先会进行新旧节点的首尾交叉对比,当无法匹配的时候会用新节点的 key 与旧节点进行比对,从而找到相应旧节点.**

更准确 : 因为带 key 就不是就地复用了,在 sameNode 函数  a.key === b.key 对比中可以避免就地复用的情况。所以会更加准确,如果不加 key,会导致之前节点的状态被保留下来,会产生一系列的 bug。

更快速 : key 的唯一性可以被 Map 数据结构充分利用,相比于遍历查找的时间复杂度 O(n).

### 谈谈 Vue 事件机制,手写$on,$off,$emit,$once

```js
class Vue {
  constructor() {
    //  事件通道调度中心
    this._events = Object.create(null);
  }
  $on(event, fn) {
    if (Array.isArray(event)) {
      event.map(item => {
        this.$on(item, fn);
      });
    } else {
      (this._events[event] || (this._events[event] = [])).push(fn);
    }
    return this;
  }
  $once(event, fn) {
    function on() {
      this.$off(event, on);
      fn.apply(this, arguments);
    }
    on.fn = fn;
    this.$on(event, on);
    return this;
  }
  $off(event, fn) {
    if (!arguments.length) {
      this._events = Object.create(null);
      return this;
    }
    if (Array.isArray(event)) {
      event.map(item => {
        this.$off(item, fn);
      });
      return this;
    }
    const cbs = this._events[event];
    if (!cbs) {
      return this;
    }
    if (!fn) {
      this._events[event] = null;
      return this;
    }
    let cb;
    let i = cbs.length;
    while (i--) {
      cb = cbs[i];
      if (cb === fn || cb.fn === fn) {
        cbs.splice(i, 1);
        break;
      }
    }
    return this;
  }
  $emit(event) {
    let cbs = this._events[event];
    if (cbs) {
      const args = [].slice.call(arguments, 1);
      cbs.map(item => {
        args ? item.apply(this, args) : item.call(this);
      });
    }
    return this;
  }
}
```

### 父子组件生命周期

父beforeCreate -> 父created -> 父beforeMount -> 子beforeCreate  -> 子created -> 子beforeMount -> 子mounted -> 父mounted

## 用法相关

### Vue中computed和watch的区别

**计算属性computed :** 

 - 1. 支持缓存，只有依赖数据发生改变，才会重新进行计算

 - 2. 不支持异步，当computed内有异步操作时无效，无法监听数据的变化

 - 3. computed 属性值会默认走缓存，计算属性是基于它们的响应式依赖进行缓存的，也就是基于data中声明过或者父组件传递的props中的数据通过计算得到的值

 - 4. 如果一个属性是由其他属性计算而来的，这个属性依赖其他属性，是一个多对一或者一对一，一般用computed

 -  5 .如果computed属性属性值是函数，那么默认会走get方法；函数的返回值就是属性的属性值；在computed中的，属性都有一个get和一个set方法，当数据变化时，调用set方法。

**侦听属性watch：**

 - 1. 不支持缓存，数据变，直接会触发相应的操作；

 - 2. watch支持异步；

 - 3. 监听的函数接收两个参数，第一个参数是最新的值；第二个参数是输入之前的值；

 - 4. 当一个属性发生变化时，需要执行对应的操作；一对多；

 - 5. 监听数据必须是data中声明过或者父组件传递过来的props中的数据，当数据变化时，触发其他操作，函数有两个参数:
immediate：组件加载立即触发回调函数执行，
deep: 深度监听，为了发现**对象内部值**的变化，复杂类型的数据时使用，例如数组中的对象内容的改变，注意监听数组的变动不需要这么做。注意：deep无法监听到数组的变动和对象的新增，参考vue数组变异,只有以响应式的方式触发才会被监听到。

## vue的渲染过程

1. 项目运行编译时，vue组件中的template会被vue-loader编译成render函数，并添加到组件选项对象里。组件通过components引用该组件选项，创建组件（Vue实例），渲染页面。main.js根组件template转化成render函数是由vue插件中的编译器实现的。

2. 组件渲染页面时会先调用render函数，render函数返回组件内标签节点（VNode实例）。每个标签(包括文本和组件标签等)会创建一个节点，先创建子标签的节点，再父节点创建时将它添加父节点的children数组中，形成与标签结构相同的树形结构。

3. 如果标签是组件标签，通过components获取的组件选项，并使用extend方法生成组件的构造函数，将构造函数和组件选项保存在组件标签节点上。

4. render函数生成组件内标签节点，并设置根节点的parent指向组件节点。将节点作为新节点，传入到patch方法中，组件页面初始更新时，不存在旧节点，直接根据新节点创建DOM。

5. 在patch方法中，根据节点创建DOM，并在节点上保存它的DOM引用，再根据节点的children值，创建子节点的DOM，再添加到父节点的DOM中，完成组件的渲染。

6. 在根据节点创建DOM的过程中，如果节点包含组件构造器信息（即是组件节点），会先使用构造器创建组件，调用组件render方法，执行以上操作，生成组件内标签对应的节点，再根据节点生成DOM，并将根标签节点的DOM保存在组件上，然后添加到父节点的DOM上，完成组件的渲染。DOM添加到页面的过程是从下往上依次添加，DOM添加到父级DOM中，父级DOM添加到它的父级DOM中，迭代添加，最后将最上级的DOM添加到页面。

## keep-alive原理

## diff原理

**总结**

- diff 算法的本质是`找出两个对象之间的差异`

- diff 算法的核心是`子节点数组对比`,思路是通过 `首尾两端对比`

- key 的作用 主要是

- - 决定节点是否可以复用
  - 建立key-index的索引,主要是替代遍历，提升性能 

## vuex原理