# NavBar 导航栏

### 介绍

为页面提供导航功能，常用于页面顶部。

### 引入

```js
import ANavBar from "../../components/act/a-nav-bar";
```

## 代码演示

### 基础用法

```html
  <a-nav-bar
      title="标题"
      left-text="返回"
      right-text="按钮"
      left-arrow
      @click-left="onClickLeft"
      @click-right="onClickRight"
  />
```

```js
import {Toast} from "../../components/act";
export default {
  name: "simple-nav-bar",
  components: {AIcon, ANavBar},
  methods: {
    onClickLeft() {
      Toast('返回2');
    },
    onClickRight() {
      Toast('右侧');
    }
  }
}
```

![](https://i.loli.net/2021/02/26/GY89TOoqnH2aw3u.png)

### 使用插槽

通过插槽自定义导航栏两侧的内容。

```html
  <a-nav-bar title="标题" left-text="返回" left-arrow>
    <template _slot="right" class="demo-right">
      <a-icon name="search" size="18"/>
      <text>文本</text>
    </template>
  </a-nav-bar>
```

![](https://i.loli.net/2021/02/26/IFtluprSTbckhxW.png)

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 标题 | _string_ | `''` |
| left-text | 左侧文案 | _string_ | `''` |
| right-text | 右侧文案 | _string_ | `''` |
| left-arrow | 是否显示左侧箭头 | _boolean_ | `false` |
| title-size | 标题字号 | _number_ | `16` |
| title-color | 标题颜色 | _string_ | `#000` |
| height | 导航栏高度 | _number_ | `46` |
| hide-line | 是否隐藏底边线 | _boolean_ | `false` |

### Slots

| 名称  | 说明               |
| ----- | ------------------ |
| left  | 自定义左侧区域内容 |
| right | 自定义右侧区域内容 |

### Events

| 事件名      | 说明               | 回调参数            |
| ----------- | ------------------ | ------------------- |
| click-left  | 点击左侧按钮时触发 | _event: MouseEvent_ |
| click-right | 点击右侧按钮时触发 | _event: MouseEvent_ |

### ` Tips `

本组件基于  ` safe-area ` 实现，无需再为其包裹 ` safe-area ` 即可自动适配状态栏。
