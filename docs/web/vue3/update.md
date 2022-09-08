---
title: 「vue3」组件更新过程
date: 2022-08-08
categories:
 - JavaScript
tags:
 - vue
publish: false
---

## 批量更新

```JavaScript

export default {
  name: "App",
  template: `
  <div>
    {{count}}
  </div>
  <button @click="handleClick">btn</button>
  `,
  setup() {
    const count = ref(1);
    function handleClick() {
      count.value++;
      count.value++;
    }
    return {
      count,
      handleClick,
    };
  },
};

```

handleClick触发, 调用栈

```log
queueFlush
queueJob
(anonymous)
triggerEffect
triggerEffects
triggerRefValue
set value
handleClick

```

与vue2中的批量更新策略基本一致.
