
# Button 按钮

### 介绍

按钮用于触发一个操作，如提交表单。

### 引入

~~~js
import AButton from "../../components/act/a-button";
~~~

## 代码示例

### 按钮类型

按钮支持  ` default ` 、 ` primary ` 、 ` success ` 、 ` warning ` 、 ` danger `  五种类型， 默认为  ` default ` 。

~~~html
<a-button type="primary">主要按钮</a-button>
<a-button type="success">成功按钮</a-button>
<a-button type="default">默认按钮</a-button>
<a-button type="warning">警告按钮</a-button>
<a-button type="danger">危险按钮</a-button>
~~~

![](https://i.loli.net/2021/02/24/3jBcDhNbeQ5yzp1.png)

### 朴素按钮

通过 plain 属性将按钮设置为朴素按钮，朴素按钮的文字为按钮颜色，背景为白色。

~~~html 
<a-button plain type="primary">主要按钮</a-button>
<a-button plain type="success">成功按钮</a-button>
<a-button plain type="warning">警告按钮</a-button>
<a-button plain type="danger">危险按钮</a-button>
~~~

![](https://i.loli.net/2021/02/24/gmKMaFJH91oeQx6.png)

### 细边框

设置 hairline 属性可以展示 0.5px 的细边框。

~~~html 
 <a-button plain hairline type="primary">主要按钮</a-button>
 <a-button plain hairline type="success">成功按钮</a-button>
~~~

![](https://i.loli.net/2021/02/24/zNouIvMbkfTDrBm.png)

### 禁用状态

通过 disabled 属性来禁用按钮，禁用状态下按钮不可点击。

~~~html 
<a-button disabled type="primary">主要按钮</a-button>
<a-button disabled type="success">成功按钮</a-button>
~~~

![](https://i.loli.net/2021/02/24/u1W5ZvHn9Lw3OcF.png)

### 按钮形状

通过 square 设置方形按钮，通过 round 设置圆形按钮。

~~~html 
<a-button square type="primary">主要按钮</a-button>
<a-button round type="success">成功按钮</a-button>
~~~

![](https://i.loli.net/2021/02/24/SCZwVQ5gcrR7Led.png)

### 按钮图标

通过 icon 属性设置按钮图标，支持 Icon 组件里的所有图标，也可以传入图标 URL。

~~~html 
<a-button icon="search" type="primary"/>
<a-button icon="add" type="success"/>
<a-button plain icon="https://img.yzcdn.cn/vant/user-active.png" type="primary"/>
~~~

![](https://i.loli.net/2021/02/24/UHgxlFsmfRKhuJC.png)

### 按钮尺寸

支持 large、normal、small、mini 四种尺寸，默认为 normal。

~~~html 
 <a-button type="primary" size="large">大号按钮</a-button>
 <a-button type="primary" size="normal">普通按钮</a-button>
 <a-button type="primary" size="small">小型按钮</a-button>
 <a-button type="primary" size="mini">迷你按钮</a-button>
~~~

![](https://i.loli.net/2021/02/24/d5CmNuKvs3oIjD6.png)

## API

### props 属性

|  参数   | 说明  | 类型  | 默认值  |
|  ----  | ----  |----  |----  |
| type  | 类型，可选值为 primary success warning danger |string|default|
| size  | 尺寸，可选值为 large small mini |string|normal|
icon    |左侧图标名称或图片链接|    string|    -
plain    |是否为朴素按钮    |boolean    |false
square    |是否为方形按钮    |boolean    |false
round    |是否为圆形按钮    |boolean    |false
disabled    |是否禁用按钮|    boolean    |false
hairline    |是否使用 0.5px 边框    |boolean    |false
| text | 按钮文字 | _string_ | - |

### events 事件

继承通用事件



