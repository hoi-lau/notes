---
title: 8种常用排序算法
date: 2018-09-20
tags:
 - algorithm
publish: false
---

| 排序算法 | 平均时间复杂度 |
| :------: | :------------: |
| 冒泡排序 |     O(n2)      |
| 选择排序 |     O(n2)      |
| 插入排序 |     O(n2)      |
| 希尔排序 |    O(n1.5)     |
| 快速排序 |   O(N*logN)    |
| 归并排序 |   O(N*logN)    |
|  堆排序  |   O(N*logN)    |
| 基数排序 |   O(d(n+r))    |
|  桶排序  |                |

## 排序算法

### 冒泡排序

**基本思想：**两个数比较大小，较大的数下沉，较小的数冒起来

**优化：**

- **针对问题：**
  数据的顺序排好之后，冒泡算法仍然会继续进行下一轮的比较，直到arr.length-1次，后面的比较没有意义的。
- **方案：**
  设置标志位flag，如果发生了交换flag设置为true；如果没有交换就设置为false。
  这样当一轮比较结束后如果flag仍为false，即：这一轮没有发生交换，说明数据的顺序已经排好，没有必要继续进行下去。

```js
// 冒泡排序
function bubbleSort(arr) {
  let times = 0;
  let flag = false;
  for (let i = 0; i < arr.length - 1; i++) {
    flag = false;
    for (let j = arr.length - i; j > 0; j--) {
      let temp;
      if (arr[j] < arr[j - 1]) {
        temp = arr[j];
        arr[j] = arr[j - 1];
        arr[j - 1] = temp;
        flag = true;
      }
      times++;
    }
    if (!flag) break;
  }
  console.log(times);
}
```

### 选择排序

**基本思想：**
在长度为N的无序数组中，第一次遍历n-1个数，找到最小的数值与第一个元素交换；
第二次遍历n-2个数，找到最小的数值与第二个元素交换；
...
第n-1次遍历，找到最小的数值与第n-1个元素交换，排序完成。

```js
function selectSort(arr) {
  let times = 0;
  for (let i = 0; i < arr.length - 1; i++) {
    let min = i;
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[j] < arr[min]) {
        min = j;
      }
      times++;
    }
    if (min !== i) {
      let temp = arr[i];
      arr[i] = arr[min];
      arr[min] = temp;
    }
  }
  console.log(times);
}
```

### 插入排序

**基本思想：**
在要排序的一组数中，假定前n-1个数已经排好序，现在将第n个数插到前面的有序数列中，使得这n个数也是排好顺序的。如此反复循环，直到全部排好顺序。

```js
function insertSort(arr) {
  let tmp;
  let times = 0;
  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = i + 1; j > 0; j--) {
      times++;
      if (arr[j] < arr[j - 1]) {
        tmp = arr[j];
        arr[j] = arr[j - 1];
        arr[j - 1] = tmp;
      } else {
        break;
      }
    }
  }
  console.log(times);
}
```

### 快速排序

**基本思想:**

- 先从数列中取出一个数作为key值；
- 将比这个数小的数全部放在它的左边，大于或等于它的数全部放在它的右边；
- 对左右两个小数列重复第二步，直至各区间只有1个数。

```js
function quickSort(arr) {
  const fn = (_arr, left, right) => {
    if (left >= right) return;
    let i = left;
    let j = right;
    let key = _arr[i];
    while (i < j) {
      while (i < j && _arr[j] >= key) {
        j--;
      }
      if (i < j) {
        _arr[i] = _arr[j];
        i++;
      }
      while (i < j && _arr[i] < key) {
        i++;
      }
      if (i < j) {
        _arr[j] = _arr[i];
        j--;
      }
    }
    _arr[i] = key;
    fn(_arr, left, i - 1);
    fn(_arr, i + 1, right);
  };
  fn(arr, 0, arr.length - 1);
}
```

### 希尔排序

### 归并排序

```js
function mergeSort(arr) {
  let len = arr.length;
  let result = Array.from(len);
  let block, start;
  for (block = 1; block < len * 2; block *= 2) {
    for (start = 0; start < len; start += 2 * block) {
      let low = start;
      let mid = start + block < len ? start + block : len;
      let high = start + 2 * block < len ? start + 2 * block : len;
      let start1 = low,
        end1 = mid;
      let start2 = mid,
        end2 = high;
      while (start1 < end1 && start2 < end2) {
        result[low++] =
          arr[start1] < arr[start2] ? arr[start1++] : arr[start2++];
      }
      while (start1 < end1) {
        result[low++] = arr[start1++];
      }
      while (start2 < end2) {
        result[low++] = arr[start2++];
      }
    }
    let temp = arr;
    arr = result;
    result = temp;
  }
}
```

### 堆排序

### 基数排序