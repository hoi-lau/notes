---

title: common
date: 2020-03-12
tags: 
  - other
publish: false
---

### MVVM

MVVM 由 Model、View、ViewModel 三部分构成 

- Model 代表数据模型，也可以在 Model 中定义数据修改和业务逻辑； 
- View 代表 UI 组件，它负责将数据模型转化成 UI 展现出来； 
- ViewModel 是一个同步View 和 Model的对象； 

**严格的MVVM要求View不能和Model直接通信，而Vue在组件提供了$refs这个属性，让Model可以直接操作View，违反了这一规定，所以说Vue没有完全遵循MVVM。**

### MVC

特点：

1. `View` 传送指令到 `Controller`
2. `Controller` 完成业务逻辑后，要求 `Model` 改变状态
3. `Model` 将新的数据发送到 `View`，用户得到反馈

`view` -> `controller` -> `model` -> `view`

这三层是紧密联系在一起的，但又是互相独立的，每一层内部的变化不影响其他层。每一层都对外提供接口（Interface），供上面一层调用。这样一来，软件就可以实现模块化，修改外观或者变更数据都不用修改其他层，大大方便了维护和升级。

**问题:**

- 开发者在代码中大量调用相同的 DOM API, 处理繁琐 ，操作冗余，使得代码难以维护。 
- 大量的DOM 操作使页面渲染性能降低，加载速度变慢，影响用户体验。 
- 当 Model 频繁发生变化，开发者需要主动更新到View ；当用户的操作`UI`导致 Model 发生变化，开发者同样需要将变化的数据同步到Model 中，这样的工作不仅繁琐，而且很难维护复杂多变的数据状态。 

## 数组flat

### 递归实现

```js
function flat(arr) {
  const result = [];
  function _flat(arr) {
    arr.forEach(element => {
      if(Array.isArray(element)) { // 递归条件
        _flat(element);
      } else { // 基准条件
        result.push(element); // 将符合结果的值推入我们的结果数组中
      }
    })
  }
  _flat(arr);
  arr = result;
  return arr;
}
const flat = arr => [].concat(...arr.map(v => Array.isArray(v) ? flat(v) : v));
```

