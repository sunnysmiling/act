
# Field 输入框

#### 介绍

表单中的输入框组件。

#### 引入

```js
import AField from "../../components/act/a-field";
```

## 代码演示

### 基础用法

可以通过  ` $value `  双向绑定输入框的值，通过  ` placeholder `  设置占位提示文字。

```html    
<text class="simple-desc">
   双向绑定测试: {value}{value2}
</text>
<!-- Field 是基于 Cell 实现的，可以使用 CellGroup 作为容器来提供外边框。 -->
  <a-cell-group>
    <a-field $value="value" label="姓氏" placeholder="请输入用户名"/>
    <a-field $value="value2" label="名字" placeholder="请输入用户名"/>
  </a-cell-group>
```

```js
export default {
  name: "simple-field",
  data() {
    return {
      value: '',
      value2: '阿萨德'
    }
  }
}
```

![](https://i.loli.net/2021/02/25/x8NXDqiK7kcPm9y.png)

### 自定义类型

根据 `type` 属性定义不同类型的输入框，默认值为 `text`。

```html
  <a-cell-group>
    <!-- 输入任意文本 -->
    <a-field $value="state.default" label="文本" placeholder="输入文本"/>
    <!-- 输入整数 -->
    <a-field $value="state.number" type="number" label="输入整数" placeholder="输入整数"/>
    <!-- 带小数的数字 -->
    <a-field $value="state.decimal" type="decimal" label="带小数的数字" placeholder="带小数的数字"/>
    <!-- 输入电话 -->
    <a-field $value="state.tel" type="tel" label="输入电话" placeholder="输入电话"/>
    <!-- 输入email -->
    <a-field $value="state.email" type="email" label="输入email" placeholder="输入email"/>
    <!-- 输入网站url -->
    <a-field $value="state.url" type="url" label="输入网站url" placeholder="输入网站url"/>
    <!-- 输入密码 -->
    <a-field $value="state.password" type="password" label="输入密码" placeholder="输入密码"/>
  </a-cell-group>
```

### 自定义按钮 [APP端]

根据  ` confirm-type `  属性定义键盘右下角的按钮文案,默认是完成(done)。

```html
  <a-cell-group>
    <a-field $value="state.default" label="完成" placeholder="done"/>
    <a-field $value="state.default" label="发送" confirm-type="send" placeholder="send"/>
    <a-field $value="state.default" label="搜索" confirm-type="search" placeholder="search"/>
    <a-field $value="state.default" label="下一个" confirm-type="next" placeholder="next"/>
    <a-field $value="state.default" label="前往" confirm-type="go" placeholder="go"/>
  </a-cell-group>
```

### 禁用输入框

通过 `readonly` 将输入框设置为只读状态，通过 `disabled` 将输入框设置为禁用状态。

```html
<a-cell-group>
    <a-field label="文本" value="输入框只读" readonly/>
    <a-field label="文本" value="输入框已禁用" disabled/>
</a-cell-group>
```

![](https://i.loli.net/2021/02/25/QShy9fRaECKxGgY.png)

### 显示图标

通过 `left-icon` 和 `right-icon` 配置输入框两侧的图标，通过设置 `clearable` 在输入过程中展示清除图标。

```html
<a-cell-group>
  <a-field
      $value="state.value1"
      label="文本"
      left-icon="link"
      right-icon="prompt"
      placeholder="显示图标"
  />
  <a-field
      $value="state.value2"
      clearable
      label="文本"
      left-icon="map"
      placeholder="显示清除图标"
  />
</a-cell-group>
```

![](https://i.loli.net/2021/02/25/DOHeiX1KCjG5hLx.png)

### 错误提示

设置 `required` 属性表示这是一个必填项，可以配合 `error` 或 `error-message` 属性显示对应的错误提示。

```html
<a-cell-group>
  <a-field
      $value="username"
      error
      required
      label="用户名"
      placeholder="请输入用户名"
  />
  <a-field
      $value="phone"
      required
      label="手机号"
      placeholder="请输入手机号"
      error-message="手机号格式错误"
  />
</a-cell-group>
```

![](https://i.loli.net/2021/02/25/aUGoYgEcQnKVJtw.png)

### 插入按钮

通过 button 插槽可以在输入框尾部插入按钮。

```html
  <a-field $value="sms" center clearable label="短信验证码" placeholder="请输入短信验证码">
    <template _slot="button" class="demo-button">
      <a-button size="small" type="primary">发送验证码</a-button>
    </template>
  </a-field>
```

![](https://i.loli.net/2021/02/25/RB9uVFaIjwdc2Wq.png)

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| $value | 当前输入的值 | _number / string_ | - |
| label | 输入框左侧文本 | _string_ | - |
| type | 输入框类型, 可选值为 `tel` `digit`<br>`number` `textarea` `password` 等 | _string_ | `text` |
| size | 大小，可选值为 `large` | _string_ | - |
| maxlength | 输入的最大字符数 | _number / string_ | - |
| placeholder | 输入框占位提示文字 | _string_ | - |
| disabled | 是否禁用输入框 | _boolean_ | `false` |
| readonly | 是否为只读状态，只读状态下无法输入内容 | _boolean_ | `false` |
| colon | 是否在 label 后面添加冒号 | _boolean_ | `false` |
| required | 是否显示表单必填星号 | _boolean_ | `false` |
| center | 是否使内容垂直居中 | _boolean_ | `false` |
| clearable | 是否启用清除图标，点击清除图标后会清空输入框 | _boolean_ | `false` |
| autofocus | 是否自动聚焦  | _boolean_ | `false` |
| error | 是否将输入内容标红 | _boolean_ | `false` |
| error-message | 底部错误提示文案，为空时不展示 | _string_ | - |
| input-align | 输入框内容对齐方式，可选值为 center、right  | _string_  | left |
| label-width | 左侧文本宽度，默认单位为 `px` | _number / string_ | `6.2em` |
| label-align | 左侧文本对齐方式，可选值为 `center` `right` | _string_ | `left` |
| left-icon | 左侧[图标名称](#/zh-CN/icon)或图片链接 | _string_ | - |
| right-icon | 右侧[图标名称](#/zh-CN/icon)或图片链接 | _string_ | - |

### Events

| 事件               | 说明                 | 回调参数                       |
| ------------------ | -------------------- | ------------------------------ |
| input | 输入框内容变化时触发 | _value: string (当前输入的值)_ |
| focus              | 输入框获得焦点时触发 | _event: Event_                 |
| blur               | 输入框失去焦点时触发 | _event: Event_                 |
| clear              | 点击清除按钮时触发   | _event: MouseEvent_            |

### Slots

| 名称       | 说明                                                       |
| ---------- | ---------------------------------------------------------- |
| button     | 自定义输入框尾部按钮                                       |
