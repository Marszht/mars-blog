---
title: "在小程序中使用Echart"
date: "2020-03-14"
excerpt: "在小程序里接入 ECharts 遇到的问题与解决过程：canvas 初始化、尺寸自适应等实战记录。"
tags:
  - "小程序"
  - "ECharts"
---

## 小程序中使用echart

最近有几个小程序用到了图表，把我一顿折腾。所以来讲一下使用图表时所遇到的问题。

我们所用到的是[ECharts 的微信小程序版本](https://github.com/ecomfe/echarts-for-weixin);它提供了一个小程序原生的组件，然后我们只需要在相关页面引用改组件就好了。


#### 使用前准备

1. 先下载[ecomfe/echarts-for-weixin](https://github.com/ecomfe/echarts-for-weixin)  中 ec-canvas 整个文件夹里面的文件

  
2. 引用：然后在你的页面中 的 json文件中 引用。当然你也可以作为全局组件写在app.json 中。
```json
{ 
  "usingComponents": {
     "ec-canvas": "../../components/ec-canvas/ec-canvas"
    }
}
```

**注意：** 上面的 ec-canvas 引用组件名不能随意改变，因为在封装的组件 ec-canvas.js 中，需要找到<ec-canvas /> 该节点 。

#### 使用

1. 我们要手动给 我们的图表设置宽高，不然页面只会显示空白。也就是给.container 设置宽高。

```js
<view class="container">
  <ec-canvas
   id="mychart-dom-bar" 
   canvas-id="mychart-bar" 
   ec="{{ ec }}">
  </ec- canvas>
</view>
```

2. 其中 `ec` 是一个我们在 我们页面 中定义的对象，它使得图表能够在页面加载后被初始化并设置。初始化图表的方法如下：

```js
function initChart(canvas, width, height, dpr) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // 像素
   });
  canvas.setChart(chart);
   // 图表数据初始化
  var option = {
       ...
   };
   chart.setOption(option);
     return chart;
 }
```

   这对于所有 ECharts 图表都是通用的，用户只需要修改上面 `option` 的内容，即可改变图表。`option` 的使用方法参见 [ECharts 配置项文档](http://echarts.baidu.com/option.html)。对于不熟悉 ECharts 的用户，可以参见 [5 分钟上手 ECharts](http://echarts.baidu.com/tutorial.html#5 分钟上手 ECharts) 教程。

   因为我们一般都是需要延迟加载的， 也就是获取数据后才加载图表的,所以我们不能直接使用,

  我们需要在获取数据重新设置 options 之后才能使用。

代码入下:

**.wxml 文件 **

```html
<view class="echart-map">
  <view class="echart-title">全国疫情新趋势</view>
  <ec-canvas 
    wx:if="{{hasGetOption}}"
    class="map-chart"   
    id="map-chart" 
    canvas-id="map-chart" 
    ec="{{ ec }}">
   </ec-canvas>
</view>
```

**.js 文件**

```js
// 页面中需要引入 ec-canvas 文件夹中的 echcrts.js
import * as echarts from '../../components/ec-canvas/echarts';  
page({
  data: {
    hasGetOption: false,
    ec: {
      // 当我们设置lazyLoad 为true 的时候，我们需要手动初始化图表。
      lazyLoad: true,
    }
  },
  ready() {
    // 在ready 的时候获取组件的实例。否则可能获取不到。
    this.echartInstance = this.selectComponent('.map-chart');
},
setOption () {
  let option = {
     title: {
        // text: '全国疫情新增趋势'
     },
     tooltip: {
       trigger: 'axis'
     },
     legend: {
       data: [ '确诊']
      },
     grid: {
       left: '3%',
       right: '4%',
       bottom: '3%',
       containLabel: true
     },
     xAxis: {
       type: 'category',
       boundaryGap: false,
       data: []
     },
     yAxis: {
       type: 'value'
     },
     series: [{
       name: '确诊',
       type: 'line',
       stack: '总量',
       data: [120, 132, 101, 134, 90, 230, 210],
       smooth: true
      }
      ]
    }
  },
initChart(canvas, width, height, dpr) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });
   canvas.setChart(chart);
   let option = this.getOption();
   chart.setOption(option);
   return chart;
  },
getPageData() {
   wx.request({
      ...
     success: (res) => {
        // 获取到数据后再手动初始化
      this.echartInstance.init(this.initChart);
       this.setData({
         hasGetOption: true,
          ...
        })
      }
    })
  }
})
```

在之前的版本中会出现这么一个问题：

<img src="image-20200309225835099.png" alt="image-20200309225835099" style="zoom:80%;" />

因为最新基础库版本中 支持  Canvas 2d，这个可以提升渲染性能，解决非同层渲染问题。

解决这个问题只需要在 ec-cnavas.js 的data 中将 isUseNewCanvas 设为true即可。

#### 在 Taro 中使用

 因为 Taro 中可以使用 微信中的原生组件，以及微信中的自定义组件。 所以使用方法同微信小程序类似。

1. 下载

2. 页面引用

```js
config = {
  navigationBarTitleText: '首页',
  usingComponents: {
     "ec-canvas": "../../components/ec-canvas/ec-canvas"
  }
}
```

3. 使用：

```js
state = {
  ec: {
    lazyLoad: true,
  }
};
// 获取组件实例。
setCanvasRef = node => this.canvasRef = node;
render () {
  return (
    <View className="line-chart">
       <ec-canvas 
         id="price-chart" 
         canvas-id="price-chart" 
         ref={this.setCanvasRef} 
         ec={ec} />
   </View>)
}
```

   然后在数据请求完后 再图表初始化。 init 是再组件中定义的

```js
this.canvasRef.init (this.initChart);   
```

#### **扩展阅读**：

[Echarts 配置文档](http://echarts.baidu.com/option.html)

[5分钟快速上手 Echarts ](http://echarts.baidu.com/tutorial.html#5%20%E5%88%86%E9%92%9F%E4%B8%8A%E6%89%8B%20ECharts)

【作者简介：】 Mars  芦苇科技web前端开发工程师 喜欢 看电影 ，撸铁 还有学习。擅长  微信小程序开发， 系统管理后台。访问 [www.talkmoney.cn](http://www.talkmoney.cn/) 了解更多。

作者主页：

[github](<https://github.com/Marszht>)

[blog](https://marszht.github.io/)