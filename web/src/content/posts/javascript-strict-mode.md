---
title: "严格模式"
date: "2020-06-06"
excerpt: "ES6 引入的严格模式能在代码早期就暴露错误和潜在问题，本文梳理它的规则与使用场景。"
tags:
  - "JS"
  - "ES6"
  - "严格模式"
---

## 严格模式

[TOC]

我们都知道在 ES6 中 开始引入了严格模式，然后它有一些规则， 能让我们在写代码时提早知道代码中出现的错误，以及可能导致编程出错的 行为。

### 使用

在文件的开头 或者全局作用域中使用 字符串

```bash
"use static"
```

当然也能在 函数内部使用 

当 JS 引擎遇到这个语法的时候就会启动这种模式。 然后当遇到不支持的浏览器时， 解析为一个普通字符串字面量

### 相关规则

#### 1. 变量


- 不允许给灭有声明的变量赋值

  ```js
   // 未声明变量
  // 非严格模式 创建全局变量 name
  // 严格模式； ReferenceError: name is not defined
  
  name = 'mars';
  
  ```

  然后不能用 以下这些作为 变量名：`implements ,  interface  , let, package, private, protected, static, public, yield ` 这些都时保留字。


#### 2. 对象

- 为只读属性赋值会抛出错误 TypeError
- 删除 不可配置的属性  会报 TypeError
- 为不可扩展的对象添加属性会 TypeError


#### 3. 函数

- 在严格模式下 参数名必须唯一

```js
// 参数名重名
// 非严格模式没有报错， 但是只能访问第二个参数，如果想访问第一个参数，需要用 arguemenets 对象 arguements[0]
// 严格模式： 报错 Duplicate parameter name not allowed in this context
function func(name, name) {
  console.log(name);
}
func('mars')
```

- 严格模式下的 arguements 对象的表象也有所不同

```js
function func(name, age) {
  name = 'zht',
  arguments[1] = 19;
  console.log(arguments[0]);  // 严格： mars ； 非严格： zht
  console.log(age);   // 严格: 18, 非严格： 19
}
func('mars', 18);
```

也就是严格模式下，arguements 对象跟命名参数 完全独立， 互不影响， 但是非严格模式下， 他们相互影响？ 

- 淘汰了 arguments.callee 和 arguments.caller , 在非严格模式下 一个引用函数本身， 一个调用函数。严格模式下 抛出 TypeError。

  红宝书上的 `阶乘递归 `很经典的用法 

  ```js
// arguements 相关属性不能访问
  // 严格模式下： 
  // 报错：TypeError: 'caller', 'callee', and 'arguments' properties may not be accessed on strict mode functions or the arguments objects for calls to them
  // 非严格模式下：120
  function factorial(num) {
    if (num <=1) {
      return 1;
    }
    return num * arguments.callee(num -1);
  }
  factorial(5);
  ```
  
- 在if 条件语句中声明 函数 的问题 需要自己去找一下


####  4. eval()

- 不在 eval( )包含的上下文中创建 变量或者函数

```js
//  在 eval 中定义 变量
// 严格模式下  x未定义
//  非严格模式:  x = 10;
function func () {
  eval('var x = 10');
  console.log(x);
}
func();

//  在 eval 中声明的变量或者函数 只能在特殊作用域中有用
// 严格模式： result  = 10
// 非严格模式  result = 10
function func () {
  var result = eval('var x = 10; x');
  console.log(result);
}
func();
```


####  5. eval 和 arguments

- eval  argument 已经不能用作标识


####  6. 抑制 this

我们都知道 在 `call` 和`bind`中 如果 不指定 this 或者 为 `null , undefined ` this 会被转化为 全局对象 window

```js
// this 指向
// 严格模式： 因为 此时 this 为 null 所以访问 null 的属性的时候， 报错
// 非严格模式： this 指向为  window  
var name = 'mars';
function foo () {
  console.log(this.name)
}
foo.call(null);
```

#### 7. 不常见的

- with 语句被抛弃

  将代码的作用域设置到一个特定的对象中


```JS
  var name = person.name;
  var age = person.age;
  var hobby = person.hobby;
  // 使用 with
  with(person) {
    var name = name;
    var age = age;
    var hobby =  hobby;
  }
```

  这种查找方式会类似原型链查找， 先在局部作用域中找相关属性，没找到去 person 对象中找

  大量使用with 会导致 性能下降，虽然能简化多次编写同一个对像工作。 当然 现在有解构赋值了。 

- 去掉了八进制字面量

```js
  //  严格模式 Octal literals are not allowed in strict mode.  
  // 非严格 模式： age = 18
  var age = 022;
```

  