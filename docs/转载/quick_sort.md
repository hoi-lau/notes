---
title: 「转载」证明快速排序的时间复杂度为O(nlogn)？
date: 2021-04-09
hideSidebar: true
tags: 
 - algorithm
categories:
 - 转载
---

直接设对规模 `n`的数组排序需要的**时间期望**为 `T(n)`, 期望其实就是平均复杂度换个说法.

空表的时候不用排, 所以初值条件就是 `T(0)=0` .

所谓快排就是随便取出一个数,一般是第一个数,然后小于等于他的放左边, 大于他的的排右边.

比如左边 `k`个那接下来还要排: `T(k-1) + T(n-k)`的时间.

然后 `k`多少那是不确定的, 遍历`1 ~ n` , 出现概率都是相等的. 

另外分割操作本身也要时间 `P(n)` , 操作花费是线性时间 `P(n)=cn` , 这也要加进去, 所以一共是:

![[公式]](https://www.zhihu.com/equation?tex=T%28n%29%3DP%28n%29%2B%5Cfrac%7B1%7D%7Bn%7D%5Csum_%7Bk%3D1%7D%5En%5Cleft%28T%28k-1%29%2BT%28n-k%29%5Cright%29)

注意和式展开就是`T(0)`到`T(n)` 加了两遍

![[公式]](https://www.zhihu.com/equation?tex=T%28n%29%3DP%28n%29%2B%5Cfrac%7B2%7D%7Bn%7D%5Csum_%7Bk%3D0%7D%5E%7Bn-1%7DT%28k%29%3DP%28n%29%2B%5Cfrac%7B2%7D%7Bn%7DS%28n-1%29)

然后就是喜闻乐见的解递推了:

![[公式]](https://www.zhihu.com/equation?tex=%5Cbegin%7Baligned%7D+S%28n%29-S%28n-1%29%26%3D%5Cfrac%7B1%7D%7B2%7D+%28n%2B1%29+%28T%28n%2B1%29-P%28n%2B1%29%29-%5Cfrac%7B1%7D%7B2%7D+n+%28T%28n%29-P%28n%29%29%5C%5C+T%28n%29%26%3D%5Cfrac%7Bc+n%5E2%7D%7B2%7D%2B%5Cfrac%7B1%7D%7B2%7D+%28n%2B1%29+%28T%28n%2B1%29-c+%28n%2B1%29%29-%5Cfrac%7B1%7D%7B2%7D+n+T%28n%29%5C%5C+0%26%3D2+c+n%2Bc%2B%28n%2B2%29+T%28n%29-%28n%2B1%29+T%28n%2B1%29+%5Cend%7Baligned%7D)

这个一阶非线性齐次差分方程的解是:

![[公式]](https://www.zhihu.com/equation?tex=T%28n%29%3D2+c+%28n%2B1%29+H_n-3+c+n)

嗯, 所以确切的说快排算法的小常数是两倍的分割速度.

让函数在无穷远处展开

![[公式]](https://www.zhihu.com/equation?tex=T%28n%29%3Dc+n+%282+%5Clog+%28n%29%2B2+%5Cgamma+-3%29%2Bc+%282+%5Clog+%28n%29%2B2+%5Cgamma+%2B1%29%2B%5Cfrac%7B5+c%7D%7B6+n%7D%2BO%5Cleft%28%5Cfrac%7B1%7D%7Bn%5E2%7D%5Cright%29)

最高阶是`2cn㏒n` 所以就是`O(n㏒n)`了.

原文链接:<a target="_blank" href="https://www.zhihu.com/question/22393997/answer/406278523"> https://www.zhihu.com/question/22393997/answer/406278523</a>