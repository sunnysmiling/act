
# a-button 按钮

## 介绍

详细描述组件的功能和效果等。例如：xx按钮用于触发一个操作，如提交表单。xxx用于弹出一个actionSheet效果...


## 使用方式
~~~js
import AButton from "../../components/act/a-button.stml";
import AButton from "../../components/act/a-button.js";
~~~
或
~~~js
import "../../components/act/a-button.stml";
import "../../components/act/a-button.js";
~~~

## 代码示例

### 按钮类型
按钮支持 default、primary、success、warning、danger 五种类型，默认为 default。

~~~html
<a-button type="primary">主要按钮</a-button>
<a-button type="success">成功按钮</a-button>
<a-button type="default">默认按钮</a-button>
<a-button type="warning">警告按钮</a-button>
<a-button type="danger">危险按钮</a-button>
~~~

[对应的运行效果图]

### 朴素按钮
通过 plain 属性将按钮设置为朴素按钮，朴素按钮的文字为按钮颜色，背景为白色。
~~~html
<a-button plain type="primary">朴素按钮</a-button>
<a-button plain type="primary">朴素按钮</a-button>
~~~

[对应的运行效果图]

## API

### props 属性

|  参数   | 说明  | 类型  | 默认值  |
|  ----  | ----  |----  |----  |
| type  | 类型，可选值为 primary success warning danger |string|default|
| size  | 尺寸，可选值为 large small mini |string|normal|

### events 事件

本组件开放的事件描述...


### methods 方法

本组件暴露的方法

## 依赖的原生模块

	无 或 module1、module2 …

## 帮助说明 联系方式等

### 帮助说明

	对本组件使用过程中需要特别注意或者额外信息等进行说明。

### 联系方式

	如果您在使用本组件过程中，遇到任何问题，可通过xxx联系...