---
title: css知识点汇总
date: 2021-03-12
tags: 
 - css
publish: false
---

## 选择器类型

## BFC

1. 元素选择器: ` h1 { } `

2. 通用选择器:  ` * { } `

3. 类选择器:  ` .box { } `

4. id选择器:  `#box {}`

5. 属性选择器:  ` a[title] { } `

6. 伪类选择器:  ` p:first-child { } `

7. 伪元素选择器:  ` p::first-line { } `

8. 后代选择器:  ` article p `

9. 子元素选择器:  ` article > p `

10. 兄弟选择器:   `h1 + p `

11. 通用同级组合器:  ` h1 ~ p `

**块级格式化上下文**

BFC就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素。

**生成规则:**

- 根元素
- float的值不为none
- overflow的值不为visible
- display的值为inline-block、table-cell、table-caption

### BFC的约束规则

- 完整的说法是：属于同一个BFC的两个相邻Box的margin会发生重叠（塌陷），与方向无关.
- 每个元素的左外边距与包含块的左边界相接触（从左向右），即使浮动元素也是如此。（这说明BFC中子元素不会超出他的包含块，而position为absolute的元素可以超出他的包含块边界）
- BFC的区域不会与float的元素区域重叠
- 计算BFC的高度时，浮动子元素也参与计算
- BFC就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面元素，反之亦然

## 布局

### 常见布局

1. 静态布局
2. 流式布局
3. 弹性布局
4. 浮动布局
5. 定位布局
6. 自适应布局

### 两栏布局

### 三栏布局

#### float实现

#### absolute实现

#### margin实现

#### flex实现

#### table实现

#### grid实现

## flex

### flex布局:

1. flex容器有两根轴:水平主轴就是x轴(main axis)和竖直轴也是y轴(cross axis),两轴相关位置标识如下:
2. flex容器属性:

- flex-direction:决定项目的排列方向。
- flex-wrap:即一条轴线排不下时如何换行。
- flex-flow:是flex-direction属性和flex-wrap属性的简写形式，默认值为row nowrap。
- justify-content:定义了项目在主轴上的对齐方式。(justify)
- align-items:定义项目在交叉轴上如何对齐。
- align-content:定义了多根轴线的对齐方式。如果项目只有一根轴线，该属性不起作用。(换行会产生多轴)

### Flex item属性:

- order:定义项目的排列顺序。数值越小，排列越靠前，默认为0。
- flex-grow:定义项目的放大比例,如果所有项目的flex-grow属性都为1，则它们将等分剩余空间（如果有的话）。如果一个项目的flex-grow属性为2，其他项目都为1，则前者占据的剩余空间将比其他项多一倍。
- flex-shrink:定义了项目的缩小比例，默认为1，如果所有项目的flex-shrink属性都为1，当空间不足时，都将等比例缩小。如果一个项目的flex-shrink属性为0，其他项目都为1，则空间不足时，前者不缩小。
- flex-basis:定义了在分配多余空间之前，项目占据的主轴空间（main size）。
- flex:是flex-grow, flex-shrink 和 flex-basis的简写，默认值为0 1 auto。后两个属性可选。
- align-self:允许单个项目有与其他项目不一样的对齐方式，可覆盖align-items属性。默认值为auto，表示继承父元素的align-items属性，如果没有父元素，则等同于stretch。

## 居中

### 垂直居中

#### 不知道自己高度和父容器高度

```css
parentElement{
  position:relative;
}
childElement{
   position: absolute;
   top: 50%;
   transform: translateY(-50%);
}
```

#### 相对定位

若父容器下只有一个元素，且父元素设置了高度，则只需要使用相对定位即可

```css
parentElement{
  height:xxx;
}

childElement {
  position: relative;
  top: 50%;
  transform: translateY(-50%);
}
```

#### **Flex 布局**

```css
parentElement{
    display:flex;/*Flex布局*/
    display: -webkit-flex; /* Safari */
    align-items:center;/*指定垂直居中*/
}
```

#### **table布局或者行内元素**

```css
parentElement{             
  display:table-cell;             
  vertical-align:middle;             
  text-align:center;
}
```

### 水平居中

#### 行内元素

`text-align: center `

#### 确定宽度的块级元素

1. `margin-left:auto; margin-right:auto;`
2. 绝对定位和margin-left: -(宽度值/2)

#### 未知宽度的块级元素

1.  **table标签配合margin左右auto实现水平居中** 
2.  **inline-block实现水平居中方法** (text-align: center)

#### flex布局

**flex容器:** ` display:flex;flex-direction:column `

**子元素:**  ` align-self:center; `

## 伪类vs伪元素

伪类用于当已有元素处于的某个状态时，为其添加对应的样式，这个状态是根据用户行为而动态变化的。如`a`标签点击过会有:`visited`状态

**伪元素用于创建一些不在文档树中的元素，并为其添加样式。**

## 常用动画

### transition

transition 属性是一个简写属性，用于设置四个过渡属性：

- transition-property
- transition-duration
- transition-timing-function
- transition-delay

### animation

animation 属性是一个简写属性，用于设置六个动画属性：

- animation-name:   为 @keyframes 动画规定一个名称 
- animation-duration:   定义动画完成一个周期所需要的时间 
- animation-timing-function:   规定动画的速度曲线.[ linear ,  ease ,  ease-in ,  ease-out ...]
- animation-delay:   定义动画开始前等待的时间 
- animation-iteration-count:   定义动画的播放次数 
- animation-direction:   是否应该轮流反向播放动画 

## 移动端1px解决方案

### 媒体查询

代码量多

```css
.div {
  border-width: 1px;
}
/* 两倍像素下 */
@media screen and (-webkit-min-device-pixel-ratio: 2) {
  .div {
    border-width: 0.5px;
  }
}
/* 三倍像素下 */
@media screen and (-webkit-min-device-pixel-ratio: 3) {
  .div {
    border-width: 0.333333px;
  }
}
```

### viewport + rem(flexible)

**缺点:**

- 由于JS对文档进行修改，所以性能上有一定影响
- 会对项目中所有使用`rem`单位的对象进行影响。不适合老项目改造。

```css
var viewport = document.querySelector("meta[name=viewport]");
var ppi = 1;
if (window.devicePixelRatio == 2) ppi = 2;
if (window.devicePixelRatio == 3) ppi = 3;

viewport.setAttribute('content', `width=device-width,initial-scale=${1/ppi}, maximum-scale=${1/ppi}, minimum-scale=${1/ppi}, user-scalable=no`);

// 设置根字体大小
var docEl = document.documentElement; 
var fontsize = 10 * (docEl.clientWidth / 320) + 'px'; 
docEl.style.fontSize = fontsize;

// 在CSS中用rem单位就行了
```

### rem和em的区别

当使用 rem 单位，他们转化为像素大小取决于页根元素的字体大小，即 html 元素的字体大小。 根元素字体大小乘以你 rem 值。

em转化为像素，大小取决于自身父级元素所设置的px值。父级元素字体大小乘以em值。

## 权重计算

第一等级：代表内联样式，如style=""，权值为 1000

第二等级：代表id选择器，如#content，权值为100

第三等级：代表类，伪类和属性选择器，如.content，权值为10

第四等级：代表标签选择器和伪元素选择器，如div p，权值为1