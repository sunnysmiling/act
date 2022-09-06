# Amount 金融数字

### 介绍

金融数字，一般用于金额，数量等。拥有强大的格式化能力。

### 引入

~~~js
import AAmount from "../../components/act/a-amount";
~~~

## 代码示例

### 基础用法

通过 value 传递数据，默认去尾法留两位。

~~~html
<a-amount :value="1234.125"/>
~~~

通过子节点传递数据。

~~~html
<a-amount>1234.125</a-amount>
~~~

### 精度

通过子节点传递数据。precision 属性控制精度。

~~~html
<a-amount :precision="3">1234.125</a-amount>
~~~

### 舍入方式

is-round-up 数字精度取舍是否四舍五入。

~~~html
<a-amount is-round-up>1234.125</a-amount>
~~~

### 千分符

has-separator 数字是否有千位分隔符。

~~~html
<a-amount has-separator>1234.125</a-amount>
~~~

separator 自定义千位分隔符。

~~~html
<a-amount has-separator separator="★">1234.125</a-amount>
~~~

### 转中文数字大写

is-capital 数字转为中文大写。

~~~html
<a-amount is-capital>1234.125</a-amount>

<a-amount is-capital>-123456.123</a-amount>
~~~

## API

### Props

|属性 | 说明 | 类型 | 默认值 | 备注 |
|----|-----|------|------|------|
|value|数值|Number|`0`|-|
|precision|数字精度|Number|`2`|小数点后保留几位|
|is-round-up|数字精度取舍是否四舍五入|Boolean|`true`|-|
|has-separator|数字是否有千位分隔符|Boolean|`false`|-|
|separator|数字千位分隔符|String|`,`|-|
|is-capital|数字是否转换为大写中文|Boolean|`false`|-|