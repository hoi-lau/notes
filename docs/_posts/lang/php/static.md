## 静态变量

静态变量仅在局部函数域中存在，但当程序执行离开此作用域时，其值并不丢失

```php
<?php
function test()
{
    static $count = 0;

    $count++;
    echo $count;
    if ($count < 10) {
        test();
    }
    $count--;
}
?> 
// 如果在声明中用表达式的结果对其赋值会导致解析错误
 <?php
static $int = 0;          // correct
static $int = 1+2;        // wrong  (as it is an expression)
?>
```

