---
title: "蒙层穿透"
date: "2020-01-25"
excerpt: "移动端蒙层滚动穿透问题的解决方案：区分弹层有无滚动条，用 catch touchmove 等技巧阻止底部页面滚动。"
tags:
  - "移动端"
  - "滚动穿透"
  - "JS"
---

# Mask-Scroll

*>* [原码地址](<https://github.com/Marszht/mask-scroll>)*


### 蒙层防穿透问题

  *> 蒙层穿透就是，当你用fixed 布局让蒙层显示的时候， 手指滑动屏幕会出现底部内容也滑动的现象. 如图：* 

![fixed](/images/blog/gh-scroll.gif)

   当蒙层出现的时候，你滚动屏幕，底部内容也一起跟着滚动。 这就是蒙层穿透， 也可以叫 '滚动穿透'. 当然出现这种情况， 用户体验当然是不好的了。 所以作为一个有点追求的工程师当然是不允许这种情况的发生了(手动狗头...)

   


   ## 解决方案

   


这种要分情况，

- 当蒙层没有滚动条的时候。

- 当蒙层出现滚动条的时候

### 1. 当弹窗没有滚动条的时候。

直接监听 catch:touchmove 方法， 然后直接返回就可以了。  

代码可以去看 [fixed](https://github.com/Marszht/mask-scroll/tree/master/maskscroll/pages/fixed) 目录下的文件 

 主要代码：

```js
*// wxml*

  <view 

​    class="fixed-mask"

​    bind:tap="hideMsak"

​    wx:if="{{isShowMask}}"

​    catch:touchmove="stopMove">

​    <view class="mask-container" >

​      <view class="mask__item">

​        I am  {{dogName}}

​      </view>

​    </view>

  </view>

  *// css*

  .fixed-mask {

  position: fixed;

  left: 0;

  top: 0;

  height: 100vh;

  width: 100vw;

  background: #333;

  opacity: 0.8;

  z-index: 2;

}

.mask-container {

  position: absolute;

  top: 50%;

  left: 50%;

  transform: translate(-50%, -50%);

}

.mask__item {

  margin: 0 auto;

  background-color: #ff0015;

  text-align: center;

  width: 500rpx;

  height: 500rpx;

  line-height: 500rpx;

  margin-bottom: 20rpx;

}

*// js*

  stopMove () {

​    return;

  }
```

**效果如下：**

   ![scroll](/images/blog/gh-scroll.gif)


上面是当弹窗没有滚动条的情况， 当弹窗出现滚动条的时候。

哦豁， 完蛋， 弹窗不能滚动了。

### 2. 当弹窗有滚动条的时候

**方法一：**

> 动态给底部滚动的元素 添加固定定位。也就是当出现弹窗的时候添加一个 class 样式类

效果如图： 

![scroll3](/images/blog/gh-scroll3.gif)

代码在 [scroll1](https://github.com/Marszht/mask-scroll/tree/master/maskscroll/pages/scroll1) 文件夹。

```js
*//  css* 

.bottom-fixed {

  position: fixed;

  left: 0;

  top: 0;

  overflow: hidden;

}

*// wxml*

 <view class="dog-container {{isShowMask ? 'bottom-fixed' : ''}}"></view>


```


大家可以看到 因为底部元素给固定到页面顶部了， 而不是你点击弹窗时出现的位置。目前自己还没有找到解决方法。 如果大佬有会的， 不吝赐教。。

***\*方法二：\****

*> scroll-view 设置高度 以及纵向滚动方向。*

不过scroll-view 会有一些bug 

 [详情查看](https://developers.weixin.qq.com/miniprogram/dev/component/scroll-view.html)

 代码在 [scrooll](https://github.com/Marszht/mask-scroll/tree/master/maskscroll/pages/scroll) 文件夹

 效果如下图：

 ![scroll4](/images/blog/gh-scroll4.gif)

[完]


【作者简介：】 Mars  芦苇科技web前端开发工程师 喜欢 看电影 ，撸铁 还有学习。擅长  微信小程序开发， 系统管理后台。访问 [www.talkmoney.cn](http://www.talkmoney.cn/) 了解更多

作者主页：

[github](<https://github.com/Marszht>)

[segmentfault](<https://segmentfault.com/u/mars_5ad9c4d43eed5>)