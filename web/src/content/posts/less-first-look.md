---
title: "Less 初试"
date: "2020-01-25"
excerpt: "Less 入门笔记：环境安装、变量、嵌套、混合等核心语法，配合示例快速上手 CSS 预处理器。"
tags:
  - "Less"
  - "CSS"
  - "预处理器"
---

##  less 初试

#### 一: 使用

---

1. 在node 环境中。

> 1. 安装
>
> npm install -g less 
>
> 或者用 yarn
>
> yarn add less
>
> 2. 编译
>
> lessc styles.less style.css

2. 在浏览器中

```html
<link rel="stylesheet/less" type="text/css" href="styles.less" />
<script src="//cdnjs.cloudflare.com/ajax/libs/less.js/3.9.0/less.min.js" ></script>
```


#### 二：变量

---

这是显而易见的：Less 允许我们使用像JS 一样能声明并使用变量， 看下面的例子

```less
@width: 10px;
@height: @width + 10px;

#header {
  width: @width;
  height: @height;
}
```

编译成 css 后

```css
#header {
  width: 10px;
  height: 20px;
}
```

**[查看更多变量相关](<http://lesscss.org/features/#mixins-feature>)**


#### 三：Mixins

---

`Less` 允许我们将已有的 `class` 和 `id` 的样式应用到另一个不同的选择器上，请看下面的例子：

```less
.bordered {
  border-top: dotted 1px black;
  border-bottom: solid 2px black;
}
```

然后我们想要上面声明的属性能在其他的选择器上生效。我们只需要像下面这么写：

```less
#menu a {
  color: #111;
  .bordered();
}

.post a {
  color: red;
  .bordered();
}
```

当然我们也可以用 id 选择器 作为 Mixins

**[查看更多Minxs相关](<http://lesscss.org/features/#mixins-feature>)**

#### 四：嵌套

---

Less 允许你使用嵌套，不需要你像css 那样。 假设我们现在有这样的css：

``` css
#header {
  color: black;
}
#header .navigation {
  font-size: 12px;
}
#header .logo {
  width: 300px;
}
```

在less 中我们可以这么写：

```less
#header {
  color: black;
  .navigation {
    font-size: 12px;
  }
  .logo {
    width: 300px;
  }
}
```

**[学习更多 父选择器](<http://lesscss.org/features/#parent-selectors-feature>)**

#### 五： 运算符

---

算术运算符 `+`, `-`, `*`, `/` 能操作任何 数字，颜色，或者变量。数学运算会在加，减或比较它们之前把单位考虑进去并转换数字。结果就是：最左侧作为最后转换的单位类型。 如果这个转换不成功或者没有意义的话， 单位会被忽略。`px -> cm` ，`rad（弧度）-> %` 这些转换后的单位都是会被忽略的。

```css
// numbers are converted into the same units
@conversion-1: 5cm + 10mm; // result is 6cm
@conversion-2: 2 - 3cm - 5mm; // result is -1.5cm

// conversion is impossible
@incompatible-units: 2 + 5px - 3cm; // result is 4px

// example with variables
@base: 5%;
@filler: @base * 2; // result is 10%
@other: @base + @filler; // result is 15%
```

`*, /` 乘除运算 并不会转换成 数值。 在大部分情况下，这种转换时没有意义的。因为 一个长度 * 另一个长度，结果时一个区域，或者说是一个面积。但是css 是不支持指定区域表示的。Less将按原样对数字进行运算，并为结果指定明确声明的单位类型。

```less
@base: 2cm * 3mm; // result is 6cm
```

你也能对颜色进行运算

```less
@color: #224488 / 2; //results in #112244
background-color: #112244 + #111; // result is #223355
```

然而你会发现Less 的[颜色函数](<http://lesscss.org/functions/#color-operations>)更有用。

**calc() **

为了 与 css 兼容， calc() 并不支持数学表达式，但是支持嵌套函数中的算术运算和变量

```less
@var: 50vh/2;
width: calc(50% + (@var - 20px));  // result is calc(50% + (25vh - 20px))
```

#### 六: 函数

---

Less提供了一系列的函数来 改变颜色, 操作字符串， 和做运算。 [更完整的函数下相关链接](<http://lesscss.org/functions/>)

使用这些函数是相当简单的。下面的这个例子 使用了 `percentage` 把 0.5 转化成 50%， 把颜色的饱和度增加5%， 然后背景色设置成 先饱和度减轻25%， 然后色相角再旋转 8°。

```less
@base: #f04615;
@width: 0.5;

.class {
  width: percentage(@width); // returns `50%`
  color: saturate(@base, 5%);
  background-color: spin(lighten(@base, 25%), 8);
}
```

#### 七: 命名空间和提取器

---

有时候你可能会 为了组织你的项目或者只是单纯的提供一些封装，而对你的minxins 进行分组。 在Less中你能很方便的做到这些。，为了之后的重用，以及分发，假设你想在'#bundle'中封装一些mixins和 变量。

```less
#bundle() {
  .button {
    display: block;
    border: 1px solid black;
    background-color: grey;
    &:hover {
      background-color: white;
    }
  }
  .tab { ... }
  .citation { ... }
}
```

现在假设你想在 `#header a`中使用 `.button`这个类名，我们可以这么做：

```less
#header a {
  color: orange;
  #bundle.button();  //#bundle > .button 这样写也行
}
```

#### 八: 作用域

---

Less 中作用域和 css 中很像。 变量和 Mixins 首先会在当前作用域中找，如果找不到就重'父'作用域中继承。

```less
@var: red;

#page {
  @var: white;
  #header {
    color: @var; // white
  }
}
```

像css 自定义属性一样，mixin 和变量的定义不必放在引用他们之前。因此下面的 Less 代码与前面的示例相同：

```less
@var: red;

#page {
  #header {
    color: @var; // white
  }
  @var: white;
}
```

###  九: 注释

---

块注释 和单行注释可以像下面这样

```less
/**
*  块注释
*/
@var: red;

// 行注释
@var:white;
```

### 十: 引用

---

引用就像我们所知道的一样。 你可以 引入一个 .less 文件，所有在这个文件里面的变量都能被访问。

可以为.less 文件指定扩展名。

```less
@import "library"; // library.less
@import "typo.css";
```

**[学习更多 Import](<http://lesscss.org/features/#imports-feature>)**

【完】


