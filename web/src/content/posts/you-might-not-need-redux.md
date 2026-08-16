---
title: "你可能不需要 Redux"
date: "2020-01-25"
excerpt: "Redux 作者 Dan Abramov 的经典文章翻译：什么时候你真的需要 Redux，什么时候它只是负担。"
tags:
  - "翻译"
  - "Redux"
---

[译]你可能不需要Redux  

>原文链接[You Might Not Need Redux](https://medium.com/@dan_abramov/you-might-not-need-redux-be46360cf367)  

  人们经常在需要前选择Redux。如果没有它我们的应用程序不能扩展怎么办。后来， 开发人员对REdux介绍他们的代码的方向很困惑。为什么我必须使用三个文件才能使一个简单的功能工作？为什么呢？
    
人们将Redux，React，函数式编程，不变性以及许多其他东西归咎于他们的困境，我理解他们。 很自然地将Redux与不需要“样板”代码来更新状态的方法进行比较，并得出结论Redux只是复杂的。在某种程度上，它是设计的

Redux 提供权衡。它要求你：
- 将应用程序状态描述为普通对象和数组
- 将系统中的更改描述为普通对象
- 描述将更改作为纯函数处理的逻辑

无论有没有React，构建应用程序都不需要这些限制。事实上，这些都是非常强大的限制因素，即使在应用程序的某些部分中，在使用前你也应该仔细考虑它们。


这样做你有充分的理由吗？

这些限制对我很有吸引力，因为它们有助于构建以下应用：
- 将状态保持到本地存储，从中启动，开箱即用。
- 在服务器上预填充状态，以HTML格式将其发送到客户端，并从中启动，开箱即用。
- 序列化用户操作并将其与状态快照一起附加到自动错误报告中，以便产品开发人员可以重播它们以重现错误。
- 通过网络传递操作对象以实现协作环境，而不会对代码的编写方式进行重大更改。
- 维护撤消历史记录或实施乐观突变，而不会对代码的编写方式进行重大更改。
- 在开发状态历史之间旅行，并在代码改变时从动作历史中重新评估当前状态，即TDD。
- 为开发工具提供全面的检查和控制功能，以便产品开发人员可以为他们的应用程序构建自定义工具。

如果你正在使用可扩展终端，JavaScript调试器或某些类型的Web应用程序，那么可能值得尝试一下，或者至少考虑一些它的想法（顺便说一下，它们并不是 新的！）

但是，如果您只是学习React，请不要将Redux作为您的首选。

而是学会在React中思考。如果您真的需要它，或者如果您想尝试新的东西，请回到Redux。但要谨慎对待它，就像使用任何高度自以为是的工具一样

最后，不要忘记你可以在不使用Redux的情况下应用Redux中的想法。例如，考虑具有本地状态的React组件：
```
import React, { Component } from 'react';

class Counter extends Component {
  state = { value: 0 };

  increment = () => {
    this.setState(prevState => ({
      value: prevState.value + 1
    }));
  };

  decrement = () => {
    this.setState(prevState => ({
      value: prevState.value - 1
    }));
  };
  
  render() {
    return (
      <div>
        {this.state.value}
        <button onClick={this.increment}>+</button>
        <button onClick={this.decrement}>-</button>
      </div>
    )
  }
}
```
完美，认真的， 重复一遍

将state 存在本地是合适的

Redux提供的权衡是增加间接性以将“发生的事情”从“事情如何变化”中解耦。

这总是好事吗？不，这是一个权衡。

例如，我们可以从组件中提取reducer：

```
import React, { Component } from 'react';

const counter = (state = { value: 0 }, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return { value: state.value + 1 };
    case 'DECREMENT':
      return { value: state.value - 1 };
    default:
      return state;
  }
}

class Counter extends Component {
  state = counter(undefined, {});
  
  dispatch(action) {
    this.setState(prevState => counter(prevState, action));
  }

  increment = () => {
    this.dispatch({ type: 'INCREMENT' });
  };

  decrement = () => {
    this.dispatch({ type: 'DECREMENT' });
  };
  
  render() {
  return (
      <div>
        {this.state.value}
        <button onClick={this.increment}>+</button>
        <button onClick={this.decrement}>-</button>
      </div>
    )
  }
}
```
注意我们如何在我们没有运行 npm install 的情况下而使用了Redux, 哇！

你应该对你的有状态组件这样做吗？可能不是。也就是说，除非你计划从Redux使用中获益。按照我们这个时代的说法，制定计划是关键

Redux库本身只是一组帮助器，可将“mount”reducer“挂载”到单个全局存储对象。您可以根据需要使用尽可能少的Redux。

但如果你舍弃一些东西，请确保得到相应的回报。