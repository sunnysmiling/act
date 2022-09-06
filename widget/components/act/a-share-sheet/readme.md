
# ShareSheet 分享面板

### 介绍

底部弹起的分享面板，用于展示各分享渠道对应的操作按钮，不含具体的分享逻辑。

### 引入

```js
import "../../components/act/a-share-sheet";
```

## 代码演示

### 基础用法

分享面板通过 options 属性来定义分享选项，数组的每一项是一个对象，对象格式见文档下方表格。

```html
<a-cell title="显示分享面板" is-link onclick={_=>this.data.showBasic = true}/>

<a-share-sheet
  $show="showBasic"
  title="立即分享给好友"
  :options="options"
  @select="onSelect"
/>
```
```js
export default {
  data() {
    return {
      showShare: showBasic,
      options: [
        { name: '微信', icon: 'wechat' },
        { name: '微博', icon: 'weibo' },
        { name: '复制链接', icon: 'link' },
        { name: '分享海报', icon: 'poster' },
        { name: '二维码', icon: 'qrcode' }
      ]
    };
  },
  methods: {
    onSelect(e) {
      this.showShare = false;
    }
  }
}
```

![](https://docs.apicloud.com/act/sharesheet/1.png)

### 展示多行选项

当分享选项的数量较多时，可以将 options 定义为数组嵌套的格式，每个子数组会作为一行选项展示。

```html
<a-cell title="显示分享面板" is-link onclick={_=>this.data.showMultiLine = true}/>

<a-share-sheet
  $show="showMultiLine"
  title="立即分享给好友"
  :options="multiLineOptions"
  @select="onSelect"
/>
```
```js
export default {
  data() {
    return {
      showMultiLine: false,
      multiLineOptions: [
        [
          { name: '微信', icon: 'wechat' },
          { name: '朋友圈', icon: 'wechat-moments' },
          { name: '微博', icon: 'weibo' },
          { name: 'QQ', icon: 'qq' }
        ],
        [
          { name: '复制链接', icon: 'link' },
          { name: '分享海报', icon: 'poster' },
          { name: '二维码', icon: 'qrcode' },
          { name: '小程序码', icon: 'weapp-qrcode' }
        ]
      ]
    };
  },
  methods: {
    onSelect(e) {
      this.showMultiLine = false;
    }
  }
};
```

![](https://docs.apicloud.com/act/sharesheet/2.png)

## API

### Props

| 参数        | 说明                 | 类型               | 默认值     |
| ----------- | -------------------- | ------------------ | ---------- |
| options     | 分享选项 | Option[] | - |
| title       | 顶部标题 | string | -        |
| cancel-text | 取消按钮文字，传入空字符串可以隐藏按钮 | string     | 取消 |
| description | 标题下方的辅助描述文字   | string       | -     |
| close-on-click-overlay | 是否在点击遮罩层后关闭  | boolean  | true |
| safe-area-inset-bottom | 是否开启底部安全区适配 | boolean  | true |

### Option 数据结构

options 属性为一个对象数组，数组中的每个对象配置一列，对象可以包含以下值：

| 键名 | 说明             | 类型                   |
| ------ | ---------------- | -------------------------- |
| name | 分享渠道名称     | string |
| description | 分享选项描述     | string |
| icon | 图标，可选值为 `wechat` `weibo` `qq` `link` `qrcode` `poster` `weapp-qrcode` `wechat-moments`，支持传入图片 URL | string |

### Events

| 事件名 | 说明             | 回调参数                   |
| ------ | ---------------- | -------------------------- |
| select | 点击分享选项时触发  | event.detail = { option } |
| cancel | 点击取消按钮时触发  | event.detail = {} |
| click-overlay | 点击遮罩层时触发 | event.detail = {} |