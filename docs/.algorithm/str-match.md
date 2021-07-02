---
title: 常见字符串匹配算法
date: 2021-06-06
categories:
 - algorithm
tags:
 - 字符串搜索
lang: zh-CN
publish: false
---

在编辑文本程序过程中，我们经常需要在文本中找到某个模式的所有出现位置。典型情况 一段正在被编辑的文本构成 个文件，而所要搜寻的模式是用户正在输入的特定的关键字。做效地解决这个问题的算法叫做字符串匹配算法，该算法能够极大提高编机文本程序时的响应车，在其他很多应用中，字符串匹配算法用于在DNA序列中搜寻特定的序列。在网络搜索引草中也需要用这种方法来找到所要查询询的网页地址。

假设文本是一一个长度为n的数组T[..m].面模式是一

字符串匹配问题的形式化定义如下: 进一步假设P和了 的元素都是来自自一个有限字母集2长度为m的数组P[1.m],其中m≤n，

字符数组P和了通常称为字符申。1-

的字符。例如，2={0，1}或者E={a,b,并且T:+1.s+m]]二P[1.m](即如果T[s+j]=如图32-1所示，如果0≤s≤n-m，开EsT中出现，且偏移为Ss(或者等价地，模式P在文本 Pu]， 其中1≤j≤m)，那么称模式P在文本T中以偏移s出现，那么称，，是有效偏移;否则，开始的)。如果P在T中出现的位置是以s+1问题就是找到所有的有内有效偏移，使得在该有效效偏移下，所给的模式

家它为无效偏移。字符串匹配

P出现在给定的文本T中。

aa

文本T

ab

## KMP算法

时间复杂度: `O(n+m)`

``` java
public class KMP {

    // 创建next数组
    static int[] getNext(String target) {
        int len = target.length();
        int[] next = new int[len];
        next[0] = -1;
        int i = 0, j = -1;
        while (i < len - 1) {
            if (j == -1 || target.charAt(i) == target.charAt(j)) {
                i++;
                j++;
                next[i] = j;
            } else {
                j = next[j];
            }
        }
        return next;
    }

    static int kmp(String plain, String target) {
        int[] next = getNext(target);
        int i = 0, j = 0;
        while (i < plain.length() && j < target.length()) {
            if (j == -1 || plain.charAt(i) == target.charAt(j)) {
                i++;
                j++;
            } else {
                j = next[j];
            }
        }
        if (j == target.length()) {
            return i - j;
        } else {
            return -1;
        }
    }


    public static void main(String[] args) {
        int res = kmp("123711123123112312141236167273", "12311231214");
        System.out.println(res);
        // next[-1, 0, 0, 0, 1, 1, 2, 3, 4, 2, 1]
        // 9
    }
}

```

## bf算法

暴力破解算法

为什么jdk String.indexOf 方法使用了bf算法

更高级的字符串搜索算法具有很短的设置时间。如果要进行一次包含不大目标字符串的一次性字符串搜索，则会发现在设置上花费的时间比在字符串搜索期间节省的时间更多。

即使只是测试目标字符串和搜索字符串的长度，也无法给出使用高级算法是否“值得”的好答案。从（例如）Boyer-Moore获得的实际速度取决于字符串的值；即字符模式。

Java实现者采取了务实的方法。他们不能保证先进的算法可以平均或针对特定输入提供更好的性能。因此，他们把它留给程序员在必要时处理。

## bm算法

## sunday算法