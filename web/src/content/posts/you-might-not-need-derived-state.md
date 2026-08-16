---
title: "你可能不需要派生状态"
date: "2020-01-25"
excerpt: "React 官方关于 getDerivedStateFromProps 滥用反模式的讨论与替代方案翻译，帮你避开派生状态的坑。"
tags:
  - "翻译"
  - "React"
  - "派生状态"
---

### 【译】你可能不需要派生状态

> 原文链接 [You Probably Don't Need Derived State](<https://react.docschina.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key>)

​      React 16.4包含了[getDerivedStateFromProps的](https://react.docschina.org/blog/2018/05/23/react-v-16-4.html#bugfix-for-getderivedstatefromprops)[bug，](https://react.docschina.org/blog/2018/05/23/react-v-16-4.html#bugfix-for-getderivedstatefromprops)这个 bug 会在 React components 复现一些已知的 bug。如果这个版本导致出现的问题，导致您在修复过之后还已知出现的话，我们非常抱歉。在这篇文章中，我们将解释一些常见的反模式与派生状态和我们的首选替代方案。

​      很长一段时间，生命周期componentWillReceiveProps是更新状态以响应props改变没有额外渲染的的唯一方法。在版本16.3中，[我们引入了替换生命周期，`getDerivedStateFromProps`](https://react.docschina.org/blog/2018/03/29/react-v-16-3.html#component-lifecycle-changes)以更安全的方式解决相同的情况。与此同时，我们意识到人们对如何使用这两种方法存在许多误解，并且我们发现反模式会导致细微而混乱的错误。getDerivedStateFromProps在16.4中的错误修正[使得派生状态更具可预测性](https://github.com/facebook/react/issues/12898)，因此滥用它的结果更容易被注意到


> 注意
>
> 本文中描述的所有反模式都适用于较旧版本`componentWillReceiveProps`和较新版本`getDerivedStateFromProps`。

此博客文章将涵盖以下主题：

- [何时使用派生状态](https://react.docschina.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#when-to-use-derived-state)
- [使用派生状态时常见的bug](https://react.docschina.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#common-bugs-when-using-derived-state)
  - [反模式：直接复制props到state上](https://react.docschina.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#anti-pattern-unconditionally-copying-props-to-state)
  - [反模式：props改变时修改state](https://react.docschina.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#anti-pattern-erasing-state-when-props-change)
- [建议 的方案](https://react.docschina.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#preferred-solutions)
- [尝试一下 memoization？](https://react.docschina.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#what-about-memoization)

#### 何时使用派生状态 

`getDerivedStateFromProps`的存在只有一个目的，让组件props 变化时更新state。上一个bug展示了一些实例，比如props 的offset变化时修改当前的滚动方向和根据props变化加载外部数据。

我们没有提供很多示例，应为有**保守使用派生state** 这个规则。大部分使用派生 state 导致的问题，不外乎两个原因：1，直接复制 props 到 state 上；2，如果 props 和 state 不一致就更新 state。下面的示例包含了这两种情况。

- 如果你只是为了缓存（memoize）基于当前 props 计算后的结果的话，你就没必要使用派生 state。。[尝试一下 memoization？](https://zh-hans.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#what-about-memoization)
- 如果只是用来保存 props 或者和当前 state 比较之后不一致后更新 state，那你的组件应该是太频繁的更新了 state。请继续阅读。

#### 派生 state 的常见 bug
   名词[“受控”](https://zh-hans.reactjs.org/docs/forms.html#controlled-components)和[“非受控”](https://zh-hans.reactjs.org/docs/uncontrolled-components.html)通常用来指代表单的 inputs，但是也可以用来描述数据频繁更新的组件。用 props 传入数据的话，组件可以被认为是**受控**（因为组件被父级传入的 props 控制）。数据只保存在组件内部的 state 的话，是**非受控**组件（因为外部没办法直接控制 state）。

   常见的错误就是把两者混为一谈。当一个派生 state 值也被 `setState`  方法更新时，这个值就不是一个单一来源的值了。[加载外部数据示例](https://zh-hans.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#fetching-external-data-when-props-change)描述的行为和这个类似，但是有很重要的区别。在加载外部数据示例中，数据 `source` 和 `loading` 都有非常清晰并且唯一的数据来源。当 prop 改变时，`loading` 的状态**一定**会改变。相反，state 只有在 prop 改变时才会改变，除非组件内部还有其他行为改变这个状态。

   上述条件如果有一个不满足，就会导致问题，最常见的就是在两个表单里修改数据。

#### 反模式: 直接复制 props 到 state

   最常见的误解就是 `getDerivedStateFromProps` 和 `componentWillReceiveProps` 只会在 props “改变”时才会调用。实际上只要父级重新渲染时，这两个生命周期函数就会重新调用，不管 props 有没有“变化”。所以，在这两个方法内直接复制（*unconditionally*）props 到 state 是不安全的。**这样做会导致 state 后没有正确渲染**。


重现一下这个问题。这个 `EmailInput` 组件复制 props 到 state：

```js
class EmailInput extends Component {
  state = { email: this.props.email };

  render() {
    return <input onChange={this.handleChange} value={this.state.email} />;
  }

  handleChange = event => {
    this.setState({ email: event.target.value });
  };

  componentWillReceiveProps(nextProps) {
    // 这会覆盖所有组件内的 state 更新！
    // 请不要这样做。
    this.setState({ email: nextProps.email });
  }
}
```


乍看之下还可以。 state 的初始值是 props 传来的，当在 `<input>` 里输入时，修改 state。但是如果父组件重新渲染，我们输入的所有东西都会丢失！([查看这个示例](https://codesandbox.io/s/m3w9zn1z8x))，即使在重置 state 前比较 `nextProps.email !== this.state.email` 仍然会导致更新。


   这个小例子中，使用 `shouldComponentUpdate` ，比较 props 的 email 是不是修改再决定要不要重新渲染。但是在实践中，一个组件会接收多个 props，任何一个 prop 的改变都会导致重新渲染和不正确的状态重置。加上行内函数和对象 props，创建一个完全可靠的 `shouldComponentUpdate` 会变得越来越难。[这个示例展示了这个情况](https://codesandbox.io/s/jl0w6r9w59)。而且 `shouldComponentUpdate` 的最佳实践是用于性能提升，而不是改正不合适的派生 state。

**注释：** 

上面这一段终于理解了， 大概就是表达当我父组件更新时，我如何保证自己的子组件不更新，如果只是单个 状态或者值影响子组件更新的话，就可以用shouldComponentUpdate 直接决定是否子组件需要跟新，但是一旦多个props 的 改变，在shpuldComponentUpdate 里面就回很复杂。


 

   希望以上能解释清楚为什么**直接复制 prop 到 state 是一个非常糟糕的做法**。在寻找解决方案之前，让我们看看一个相关的问题：假如我们只使用 props 中的 email 属性更新组件呢？


#### 反模式: 在 props 变化后修改 state


   继续上面的示例，我们可以只使用 `props.email` 来更新组件，这样能防止修改 state 导致的 bug：


```js
class EmailInput extends Component {
  state = {
    email: this.props.email
  };

  componentWillReceiveProps(nextProps) {
    // 只要 props.email 改变，就改变 state
    if (nextProps.email !== this.props.email) {
      this.setState({
        email: nextProps.email
      });
    }
  }
  
  // ...
}
```


注意：

​       示例中使用了 `componentWillReceiveProps` ，使用 `getDerivedStateFromProps` 也是一样


​      我们已经做了一个很大的改进。现在组件只会在 prop 改变时才会改变。


​     但是仍然有个问题。想象一下，如果这是一个密码输入组件，拥有同样 email 的两个账户进行切换时，这个输入框不会重置（用来让用户重新登录）。因为父组件传来的 prop 值没有变化！这会让用户非常惊讶，因为这看起来像是帮助一个用户分享了另外一个用户的密码，([查看这个示例](https://codesandbox.io/s/mz2lnkjkrx))。

​     

​      虽然这个设计就有问题，但是这样的错误很常见，([我就犯过这样的错误](https://twitter.com/brian_d_vaughn/status/959600888242307072))。幸运的是，有两个方案能解决这些问题。这两者的关键在于，**任何数据，都要保证只有一个数据来源，而且避免直接复制它**。我们来看看这两个方案。


   

#### 更好的解决方法


#### 建议：完全可控的组件

 

​    阻止上述问题发生的一个方法是，从组件里删除 state。如果 prop 里只包含了 email，我们就没必要担心它和 state 冲突。我们甚至可以把 `EmailInput` 转换成一个轻量级的函数组件：

```js
function EmailInput(props) {
  return <input onChange={props.onChange} value={props.email} />;
}
```


   这样能用最简单的方式完成我们需要的组件。但是如果我们仍然想要保存临时的值，则需要父组件手动执行保存这个动作。([点击查看这个模式的演示](https://codesandbox.io/s/7154w1l551))。


#### 建议：有 key 的非受控组件


   另外一个选择是让组件自己存储临时的 email state。在这种情况下，组件仍然可以从 prop 接收“初始值”，但是更改之后的值就和 prop 没关系了：


   在这密码管理器的例子中，为了在不同的页面切换不同的值，我们可以使用 `key` 这个特殊的 React 属性。当 `key` 变化时， React 会[创建一个新的而不是更新一个既有的组件](https://zh-hans.reactjs.org/docs/reconciliation.html#keys)。 Keys 一般用来渲染动态列表，但是这里也可以使用。在这个示例里，当用户输入时，我们使用 user ID 当作 key 重新创建一个新的 email input 组件：

   

```js
<EmailInput
  defaultEmail={this.props.user.email}
  key={this.props.user.id}
/>
```


​    每次 ID 更改，都会重新创建 `EmailInput` ，并将其状态重置为最新的 `defaultEmail` 值。([点击查看这个模式的演示](https://codesandbox.io/s/6v1znlxyxn)) 使用此方法，不用为每次输入都添加 `key`，在整个表单上添加 `key` 更合理。每次 key 变化，表单里的所有组件都会用新的初始值重新创建。


   大部分情况下，这是处理重置 state 的最好的办法。


​      **注意**

> 这看起来很慢，但是这点的性能是可以忽略的。如果在组件树的更新上有很重的逻辑，这样反而会更快，因为省略了子组件 diff。

#### 选项一：用 prop 的 ID 重置非受控组件


   如果某些情况下 `key` 不起作用（可能是组件初始化的开销太大），一个麻烦但是可行的方案是在 `getDerivedStateFromProps` 观察 `userID` 的变化：

```js
class EmailInput extends Component {
  state = {
    email: this.props.defaultEmail,
    prevPropsUserID: this.props.userID
  };

  static getDerivedStateFromProps(props, state) {
    // 只要当前 user 变化，
    // 重置所有跟 user 相关的状态。
    // 这个例子中，只有 email 和 user 相关。
    if (props.userID !== state.prevPropsUserID) {
      return {
        prevPropsUserID: props.userID,
        email: props.defaultEmail
      };
    }
    return null;
  }

  // ...
}
```


   如果你乐意，你也可以只重置一小部分 state ([点击查看这个模式的演示](https://codesandbox.io/s/rjyvp7l3rq))。


  **注意**

> 上面的示例使用了 `getDerivedStateFromProps`，用 `componentWillReceiveProps` 也一样。


#### 选项二：使用实例方法重置非受控组件

  

​       更少见的情况是，即使没有合适的 `key`，我们也想重新创建组件。一种解决方案是给一个随机值或者递增的值当作 `key`，另外一种是用实例方法强制重置内部状态：


```js
class EmailInput extends Component {
  state = {
    email: this.props.defaultEmail
  };

  resetEmailForNewUser(newEmail) {
    this.setState({ email: newEmail });
  }

  // ...
}
```


   然后父级组件可以[使用 `ref` 调用这个方法](https://zh-hans.reactjs.org/docs/glossary.html#refs)。([点击查看这个模式的演示](https://codesandbox.io/s/l70krvpykl))。


   refs 在某些情况下很有用，比如这个。但通常我们建议谨慎使用。即使是做一个演示，这个命令式的方法也是非理想的，因为这会导致两次而不是一次渲染。


### 概括


​     回顾一下，设计组件时，重要的是确定组件是受控组件还是非受控组件。


​     不要直接复制（mirror） props 的值到 state 中，而是去实现一个**受控**的组件，然后在父组件里合并两个值。比如，不要在子组件里被动的接受 `props.value` 并跟踪一个临时的 `state.value`，而要在父组件里管理 `state.draftValue` 和 `state.committedValue`，直接控制子组件里的值。这样数据才更加明确可预测。


对于**不受控**的组件，当你想在 prop 变化（通常是 ID ）时重置 state 的话，可以选择以下几种方式：

- **建议: 重置内部所有的初始 state，使用 key 属性**
- 选项一：仅更改某些字段，观察特殊属性的变化（比如 `props.userID`）。
- 选项二：使用 ref 调用实例方法。

#### 尝试一下 memoization？


​        我们上面用到了————仅在输入变化时，重新计算 `render` 需要使用的值————这个技术叫做 [memoization](https://en.wikipedia.org/wiki/Memoization)。


​        把派生 state 用作 memoization 并不是什么坏事情，但是这并不是好的方法。管理派生 state 本来就很复杂，而且这种复杂度是随着需要管理的属性变得越来越庞大。比如，如果我们想在组件 state 里添加第二个派生 state，那就需要写两份跟踪变化的逻辑。

​     

​        这里有个示例，组件使用一个 prop ————一个列表————并在用户输入查询条件时显示匹配的项，我们可以使用派生 state 存储过滤后的列表：


```js
class Example extends Component {
  state = {
    filterText: "",
  };

  // *******************************************************
  // 注意：这个例子不是建议的方法。
  // 下面的例子才是建议的方法。
  // *******************************************************

  static getDerivedStateFromProps(props, state) {
    // 列表变化或者过滤文本变化时都重新过滤。
    // 注意我们要存储 prevFilterText 和 prevPropsList 来检测变化。
    if (
      props.list !== state.prevPropsList ||
      state.prevFilterText !== state.filterText
    ) {
      return {
        prevPropsList: props.list,
        prevFilterText: state.filterText,
        filteredList: props.list.filter(item => item.text.includes(state.filterText))
      };
    }
    return null;
  }

  handleChange = event => {
    this.setState({ filterText: event.target.value });
  };

  render() {
    return (
      <Fragment>
        <input onChange={this.handleChange} value={this.state.filterText} />
        <ul>{this.state.filteredList.map(item => <li key={item.id}>{item.text}</li>)}</ul>
      </Fragment>
    );
  }
}
```

​     

​       这个实现避免了重复计算 `filteredList`，但是过于复杂。因为它必须单独追踪并检测 prop 和 state 的变化，在能及时的更新过滤后的 list。我们可以使用 `PureComponent`，把过滤操作放到 render 方法里来简化这个组件：


 ```js
// PureComponents 只会在 state 或者 prop 的值修改时才会再次渲染。
// 通过对 state 和 prop 的 key 做浅比较（ shallow comparison ）来确定有没有变化。
class Example extends PureComponent {
  // state 只需要保存 filter 的值：
  state = {
    filterText: ""
  };

  handleChange = event => {
    this.setState({ filterText: event.target.value });
  };

  render() {
    // PureComponent 的 render 只有
    // 在 props.list 或 state.filterText 变化时才会调用
    const filteredList = this.props.list.filter(
      item => item.text.includes(this.state.filterText)
    )

    return (
      <Fragment>
        <input onChange={this.handleChange} value={this.state.filterText} />
        <ul>{filteredList.map(item => <li key={item.id}>{item.text}</li>)}</ul>
      </Fragment>
    );
  }
}
 ```


   上面的方法比派生 state 版本更加清晰明了。只有在过滤很大的列表时，这样做的效率不是很好。当有 prop 改变时 `PureComponent`不会阻止再次渲染。为了解决这两个问题，我们可以添加 memoization 帮助函数来阻止非必要的过滤：

   

```js

 import memoize from "memoize-one";

class Example extends Component {
  // state 只需要保存当前的 filter 值：
  state = { filterText: "" };

  // 在 list 或者 filter 变化时，重新运行 filter：
  filter = memoize(
    (list, filterText) => list.filter(item => item.text.includes(filterText))
  );

  handleChange = event => {
    this.setState({ filterText: event.target.value });
  };

  render() {
    // 计算最新的过滤后的 list。
    // 如果和上次 render 参数一样，`memoize-one` 会重复使用上一次的值。
    const filteredList = this.filter(this.props.list, this.state.filterText);
return (
  <Fragment>
    <input onChange={this.handleChange} value={this.state.filterText} />
    <ul>{filteredList.map(item => <li key={item.id}>{item.text}</li>)}</ul>
  </Fragment>
);
  }
}
```
这样更简单，而且和派生 state 版本一样好！

在使用 memoization 时，请记住这些约束：

1.  大部分情况下， **每个组件内部都要引入 memoized 方法**，已免实例之间相互影响。
2.  一般情况下，我们会**限制 memoization 帮助函数的缓存空间**，以免内存泄漏。（上面的例子中，使用 `memoize-one` 只缓存最后一次的参数和结果）。
3.  如果每次父组件都传入新的 `props.list` ，那本文提到的问题都不会遇到。在大多数情况下，这种方式是可取的。


#### 结束语

在实际应用中，组件一般都会有受控组件和非受控组件。这是正常的！不过如果每个值都有明确的来源，就可以避免上面提到的反面模式。

`getDerivedStateFromProps` （以及其他派生 state）是一个高级复杂的功能，应该保守使用，这个再怎么重申也不过分。如果你的用法不属于上述这些模式，请在 [GitHub](https://github.com/reactjs/reactjs.org/issues/new) 或 [Twitter](https://twitter.com/reactjs) 与我们分享！


