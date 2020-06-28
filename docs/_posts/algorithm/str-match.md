---
title: 字符串匹配算法
date: 2019-04-10
categories:
 - algorithm
---

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