---
title: "为什么 SetState 是异步的"
date: "2020-08-02"
excerpt: "React 官方 issue 中核心开发者 gaearon 的解答：setState 为何是异步的——保证数据一致性，并为并发更新铺路。"
tags:
  - "React"
  - "setState"
---

### 为什么 setState 是异步的 ？

> [原文链接](https://github.com/facebook/react/issues/11527)

这篇文章是 github 中 react 的一个 issue 之前被其出来了，然后 [gaearon](https://github.com/gaearon) （Redux 核心开发者）回答了该问题。

他主要从两个方面去阐述了这个问题


- 保证数据的一致性
- 使并发更新成为可能


以下是他的原文：


这里是我的一些想法和观点, 这不是一个 完整准确的回答，但是总比不回应好。


首先 我们得承认 延迟[协调](https://react.docschina.org/docs/reconciliation.html)(*reconciliation* ) 去批量更新是有意义 的。因此我们说 `setState` 同步更新在很多情况下是低效的。如果知道会更新多次，批量更新是更好的选择。


举个例子，如果我们在浏览器 点击，父组件和子组件都调用了 setState 我们不希望 子组件渲染两次，我们希望 把他们当作脏操作去忽视他们，我们只需要在执行完浏览器事件之后再一起渲染。


你可能会问，为什么同步更新setState不能做同样的事（指批量更新）而不用等协调结束后。我不认为这个东西有确切的一个答案（或者是一个权衡的解决方案）但是以下是我的一些想法。

### 保证内部数据一致性

即使 state 更新是同步的，但是 props 并不是。（你需要等到父组件重新渲染的时候才知道具体的props 值，如果state 更新是同步的话，就没办法批量更新了）。


  现在由Reacrt 提供的这些对象（state, props, refs）它们相互之间内部是一致的。这就意味着你如果仅用这些对象，它能保证你有一个完整协调的树（尽管它们可能是未更新的一个状态）。为什么这很重要呢？


当你使用 state的时候，如果它是同步更新的（正如你提出的一样），下面的代码会生效：

```
console.log(this.state.value) // 0
this.setState({ value: this.state.value + 1 });
console.log(this.state.value) // 1
this.setState({ value: this.state.value + 1 });
console.log(this.state.value) // 2
```

然而，当上面的 value 需要被其他组件使用的时候，你需要把它提升到父组件上面去：

```
-this.setState({ value: this.state.value + 1 });
+this.props.onIncrement(); // Does the same thing in a parent
```

我想强调的是在典型的React 应用中，依赖于setState()处理是您每天都会使用的一种最常见的特定于React的代码重构。


然而，经过上面的修改后，我们将得到不是我们想要的结果!

```
console.log(this.props.value) // 0
this.props.onIncrement();
console.log(this.props.value) // 0
this.props.onIncrement();
console.log(this.props.value) // 0
```

这是因为在你提出的模式中，this.state 会立即更新，但是 this.props 不会。我们不能在父组件没有重新渲染的时候马上更新 `this.props` , 因为this.state 的同步更新，我们不得不放弃批量更新（在一些情况下，这会严重降低应用性能）。


还有更多的一些小案例说明这个同步更新state 会导致问题，像，如果你用 props (未更新)和 state（立即更新）去生成一个 新的 state  [#122 (comment)](https://github.com/facebook/react/issues/122#issuecomment-81856416)  (译者注：这个回答说明的就是这种情况， 当我们用 props 和 state 去生成一个新的状态时的问题)。 Refs 也会有相同的问题  [#122 (comment)](https://github.com/facebook/react/issues/122#issuecomment-22659651)。


这些例子 一点也不算是理论上的。事实上 react-redux  也会有这种 问题，

 [reduxjs/react-redux#86](https://github.com/reduxjs/react-redux/issues/86), [reduxjs/react-redux#99](https://github.com/reduxjs/react-redux/pull/99), [reduxjs/react-redux#292](https://github.com/reduxjs/react-redux/issues/292), [reduxjs/redux#1415](https://github.com/reduxjs/redux/issues/1415), [reduxjs/react-redux#525](https://github.com/reduxjs/react-redux/issues/525).


我不知道，为什么没 Mobx 使用者没有遇到过这个问题，但是我的直觉是他们可能遇到过这个场景，但是他们可能认为这是他们自己的错误。或者他们没有过多的使用 props 而是 直接获取 Mobx  的 变化的对象。


因此， React 如今是怎么解决这个问题的？ **在 React 中， state 和 props 回在协调 结束后更新，因此你可能会看见  0 在重构前后被打印。**这让 state 提升变得安全。


是的，这在有些情况下会变得不方便。特别是对那些 来自 面向对象的朋友 他们只想 更新较少次的 state状态，而不用去想怎么去考虑整个state的更新。我能理解那样，尽管我还是坚持认为 把 state 集中更新对于 debug 是很清晰的 [#122 (comment)](https://github.com/facebook/react/issues/122#issuecomment-19888472)..


还有你可以选择将要立即读取的state 放到 可变对象中，尤其是在不使用它作为真正渲染源的时候。这跟 Mobx 很像。


你也可以 选择更新整棵树，如果你知道 自己在做什么，这个API 叫 ReactDOM.flushSync(fn). 我们目前还没有把它写进文档，但我们肯定会在 16.x 版本周期的某个时候去这么做。请注意，它实际上会强制完成重新渲染，以便在调用中发生更新，所以您应该非常谨慎地使用它。这个方法不会破坏 `props` ，`state` 和 `refs` 之间内在一致性的保证。


总而言之，**React 模型并不总是会引出最简洁的代码，但是它在内部是一致的，并且确保提升 state 是安全的。**


### 使并发更新成为可能


从概念上讲,React 就像它的 每个组件都有一个单一的更新队列. 这就是我们为什么讨论这个问题: 是否我们立即更新state？ 因为我们都知道 我们的更新会按照队列的顺序. 然而这并不是同一种情况(哈哈).


最近我们一直在讨论 '同步渲染'. 我得承认 对于这个 含义我们一直没有传达的很好,但是这才是 研究的本质: 你去研究一个在概念上很有前景的想法,但是你只有在上面花了很多时间后你才能真正理解它.


我们定义 '同步渲染'是指.  **根据调用在哪里, React能够给 setState 设置不同的优先级 : 像 事件处理, 网络响应, 动画 等等.**

**
**

例如，如果你正在输入消息，TextBox 组件中的setState() 调用需要立即被刷新， 但是如果此时你收到了新消息，最好的做法是 将新的 MesssgeBubble 延迟到某个固定的阈值后（如： 一秒钟）再进行渲染，这样就不会因为线程阻塞而导致输入被卡住。


如果我们让某些更新 具有‘低优先级’，我们能把他们的更新拆分几毫秒的小块，这样用户就感知不到。


我知道 像这也的性能优化可能不能让你感到信服。你可能会说，如果我们使用 Mobx 就不需要这些了。我们的更新追踪速度足够快，就不用重新渲染了。我不认为在所有情况下都是正确的。（不管 MoboX 多快，你人需要创建DOM 节点， 并且渲染新的视图）。即使这是对的，并且你觉得可以将对象包装到跟踪读取和写入特定的JavaScript 库中这是可以的，那么你就不会从这些优化中获益这么多。


**但是异步渲染不仅仅是性能优化。我们认为，这是 React 组件模型可以实现的根本转变。**

**
**

比如，设想这么一个场景，你从一个页面跳到另一个。 通常我们在页面渲染完成前会显示一个加载中的标志。


然鹅， 如果这个跳转非常快（可能 一秒左右），闪烁并且立即隐藏loading会降低用户体验。更糟糕的是，如果你有多个具有不同异步依赖的 （数据，代码， 图片）组件级别。则最终会生成一个加载loading 的级联，这些会一个地短暂闪烁。 这在视觉上既令人不快，又使应用在实践中变慢，因为所有 DOM 重排。它也是许多样板代码的来源


当您使用渲染不同视图的简单 setState（） 时，我们可以"开始" 在后台将更新的视图处理 ，这难道不是很好吗？试想一下，在无需编写任何协调代码的情况下, 如果更新超过特定阈值（例如一秒），您可以选择显示加载中， 否则，当满足整个新子树的异步依赖关系时，React 执行无缝过渡。另外，当我们‘等待时’，更新前的页面保持 交互（例如，您可以选择要转换到的不同项目）,而且 react 强制规定如果时间过长，你必须使用加载中标志...


事实证明，通过当前的 React 模型和生命周期的一些调整，我们实际上可以实现这个功能。 [@acdlite](https://github.com/acdlite) 一直在研究这个功能，并且很快他会发布一个 [RFC](https://github.com/reactjs/rfcs)


请注意，这只有在state不会立即刷新的情况下才有 实现上面的这个可能。 如果 state 立即更新的话，我们将无法开始在后台渲染视图的"新版本"，并且"旧版本"仍然可见且具有交互性。 它们之间独立状态将会发生冲突.


我不想 因此夺走了 [@acdlite](https://link.zhihu.com/?target=https%3A//github.com/acdlite) 的关注， 但我希望这听起来至少有那么一点兴奋。我知道这听起来很虚。 但我希望在接下来几个月里我们能说服你，到时候i你会感激React 模型的灵活性。并且据我所知，至少在一定程度上，这种灵活性是由于*不* 立即刷新状态更新才能实现的。