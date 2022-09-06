
# Search 搜索

### 介绍

用于搜索场景的输入框组件。

### 引入

```js
import "../../components/act/a-search";
```

## 代码演示

### 基础用法

$value 用于控制搜索框中的文字，placeholder 设置搜索框占位文本。

```html
<a-search $value="value1" :placeholder="placeholder" />
```

![](https://docs.apicloud.com/act/search/1.png)

### 事件监听

Search 组件提供了 search 和 cancel 事件，search 事件在点击键盘上的搜索/回车按钮后触发，cancel 事件在点击搜索框右侧取消按钮时触发。

```html
<form action="/">
	<a-search
	  $value="value2"
	  :placeholder="placeholder"
	  show-action
	  @search="onSearch"
	  @cancel="onCancel"
	/>
</form>
```

Tips: h5 环境下，在 a-search 外层增加 form 标签，且 action 不为空，即可在 iOS 输入法中显示搜索按钮，App 端不需要增加 form 标签。

![](https://docs.apicloud.com/act/search/2.png)

### 搜索框内容对齐

通过 input-align 属性设置搜索框内容的对齐方式，可选值为 center、right。

```html
<a-search $value="value3" :placeholder="placeholder" input-align="center" />
```

![](https://docs.apicloud.com/act/search/3.png)

### 禁用搜索框

通过 disabled 属性禁用搜索框。

```html
<a-search $value="value4" :placeholder="placeholder" disabled />
```

![](https://docs.apicloud.com/act/search/4.png)

### 自定义背景色

通过 background 属性可以设置搜索框外部的背景色，通过 shape 属性设置搜索框的形状，可选值为 round。

```html
<a-search
	$value="value5"
	:placeholder="placeholder"
	shape="round"
	background="#4fc08d"
/>
```

![](https://docs.apicloud.com/act/search/5.png)

### 自定义按钮

使用 action 插槽可以自定义右侧按钮的内容。使用插槽后，cancel 事件将不再触发。

```html
<a-search
  $value="value6"
  show-action
  label="地址"
  :placeholder="placeholder"
  @search="onSearch"
>
  <template _slot='action'>
    <text @click="onSearch">搜索</text>
  </template>
</a-search>
```

![](https://docs.apicloud.com/act/search/6.png)

## API

### Props

| 参数        | 说明                 | 类型               | 默认值     |
| ----------- | -------------------- | ------------------ | ---------- |
| $value      | 当前输入的值 | _string_ | - |
| label       | 搜索框左侧文本 | _string_ | -        |
| shape       | 搜索框形状，可选值为 round  | _string_         | square |
| background  | 搜索框外部背景色   | _string_          | #f2f2f2     |
| maxlength   | 输入的最大字符数  | _number_        | - |
| placeholder | 占位提示文字  | _string_         | - |
| clearable   | 是否启用清除图标，点击清除图标后会清空输入框  | _boolean_  | true |
| autofocus   | 是否自动聚焦  | _boolean_  | false |
| show-action | 是否在搜索框右侧显示取消按钮  | _boolean_  | false |
| action-text | 取消按钮文字  | _string_  | 取消 |
| disabled    | 是否禁用输入框  | _boolean_  | false |
| readonly    | 是否将输入框设为只读  | _boolean_  | false |
| error       | 是否将输入内容标红  | _boolean_  | false |
| input-align | 输入框内容对齐方式，可选值为 center、right  | _string_  | left |
| left-icon   | 输入框左侧图标名称或图片链接 | _string_         | search |
| right-icon  | 输入框右侧图标名称或图片链接  | _string_         | - |

### Events

| 事件名 | 说明             | 回调参数                   |
| ------ | ---------------- | -------------------------- |
| search | 确定搜索时触发     | event.detail = {value}，value 为当前输入的值 |
| input | 输入框内容变化时触发 | event.detail = {value}，value 为当前输入的值 |
| focus | 输入框获得焦点时触发 | event.detail = {} |
| blur  | 输入框失去焦点时触发 | event.detail = {} |
| clear | 点击清除按钮后触发   | event.detail = {} |
| cancel | 点击取消按钮时触发  | event.detail = {} |

### Slots

| 名称    | 说明       |
| ------- | --------- |
| left | 自定义左侧内容（搜索框外） |
| action | 自定义右侧内容（搜索框外），设置show-action属性后展示 |
| label | 自定义左侧文本（搜索框内） |