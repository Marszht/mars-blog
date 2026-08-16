---
title: "前端应该了解的加密种类"
date: "2020-03-08"
excerpt: "前端需要了解的加密基础知识：MD5、Base64、对称与非对称加密的简单科普与常见应用场景。"
tags:
  - "安全"
  - "加密"
  - "科普"
---

### 前端应该了解的加密种类

先理解一些 前置知识

**位(bit)：** 计算机数据存储的最小单位，

**字节(Byte)：** 8 个二进制位表示一个字节。它是计算机存储空间的基本计量单位 1个字节可以储存1个英文字母            或者半个汉字

**字：**计算机进行数据处理时，一次存取、加工和传送的数据长度称为字。 字是计算机进行数据处理和运算的单位。字是由若干个字节组成。 计算机的字长决定了其CPU一次操作处理实际位数的多少，由此可见计算机的字长越大，其性能越优越。


1. [MD5](https://zh.wikipedia.org/wiki/MD5) 加密

   > MD5的全称是Message-Digest Algorithm 5（信息-摘要算法）
   >
   > MD5是输入不定长度信息，输出固定长度128-bits的算法。经过程序流程，生成四个32位数据，最后联合起来成为一个128-bits[散列](https://zh.wikipedia.org/wiki/散列)。
   >
   > 基本方式为，求余、取余、调整长度、与链接变量进行循环运算。得出结果。
   >
   > 具体实现方式可以去看[维基百科MD5](https://zh.wikipedia.org/wiki/MD5). 这里就不讲了，因为我没有看懂😂

   **应用场景：**

   - 一致性验证
   - 数字签名
   - 安全访问认证

2. [Base64](https://baike.baidu.com/item/base64/8545775?fr=aladdin)

   > Base64是网络上最常见的用于传输8Bit字节码的编码方式之一，Base64就是一种基于64个可打印字符来表示二进制数据的方法。常用于在通常处理文本数据的场合，表示传输，存储一些二进制数据。
   >
   >  `可打印字符串分别为:` **A-Z ， a-z  , 0-9,   + , /**

   **应用场景**

   - Base64编码可用于在[HTTP](https://zh.wikipedia.org/wiki/HTTP)环境下传递较长的标识信息

     

3. [非对称RSA 加解密]([https://zh.wikipedia.org/wiki/RSA%E5%8A%A0%E5%AF%86%E6%BC%94%E7%AE%97%E6%B3%95](https://zh.wikipedia.org/wiki/RSA加密演算法))

   > RSA算法是最流行的公钥密码算法，使用长度可以变化的密钥。RSA是第一个既能用于数据加密也能用于数字签名的算法。
   
   **应用场景**
   
   - 一般开发的时候 登录时候的密码 的加密解密就是用的   非对称RSA 加解密


**参考文章**：

- [字符编码笔记：ASCII，Unicode 和 UTF-8](http://www.ruanyifeng.com/blog/2007/10/ascii_unicode_and_utf-8.html)

软一峰老师讲的很好，通俗易懂

- [什么是Base64](https://blog.csdn.net/qq_20545367/article/details/79538530)

  