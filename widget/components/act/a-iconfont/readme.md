# Iconfont 图标解决方案

#### 介绍

基于 iconfont 的字体图标形成的一套解决方案。

#### 前置操作:

##### 1. 创建iconfont图标项目

详细的操作方法请参考 [iconfont官方帮助](https://www.iconfont.cn/help/detail?spm=a313x.7781069.1998910419.dfd524534&helptype=about)

##### 2. 下载资源并放置于应用包内

当创建项目完成以后，进入项目页面，点击“下载到本地”按钮，会开始下载图标压缩包。
![image.png](https://i.loli.net/2021/06/05/BKIcS6zGMm27vfq.png)
压缩包下载解压以后，将压缩包内  ` font_*****_******** `
文件夹下所有文件拷贝到本组件下的 ` fonts ` 目录。

以确保  ` widget/components/act/a-iconfont/fonts/iconfont.ttf ` 这样的路径可以正常访问到  ` ttf ` 资源。

##### 3. 设置字体映射

此时修改项目的  ` config.xml `， 增加一条  ` ttf ` 资源和字体名称的映射，代码如下：

```js
<preference name="font" family="iconfont" value="widget/components/act/a-iconfont/fonts/iconfont.ttf"/>
```

##### 4. 提交代码更新自定义 Loader

完成资源放置和字体映射后，提交代码到云端，重新编译自定义Loader。 此时字体资源会打包在Loader中，可以将其理解成一个模块。

所以后续项目字体文件有更新的时候，需要重新放置字体文件，并且提交资源，再次编译Loader。

#####               * 5. 如需使用name的后续操作

> 在做完前面 4 步后，就可以使用 ` 基础用法 ` 中的第一种引用了。也就是使用  ` Unicode ` 实体。
>
> 一般来说，实体引入没有语义化，观感上不太容易辨认。其次维护和更新需要找到对应表去检索，不利于维护。
>
> 目前暂时不支持  ` before `  伪类，所以如需使用具名图标，还需要完成以下构建步骤。
>
> 此操作依赖于 node.js 环境，从 css 文件中读取生成 icons 资料。

打开命令行终端，切换到组件所在目录， 使用 node 执行目录下 build.js 即可。

 ```js
 node build.js 
``` 

或者是使用   ` npm run build ` 和  ` yarn build ` 均可。

成功执行后会反馈  `   ☺ build finished ! ` 并且在组件目录下生成  ` dist `  文件夹和  ` icons.json `

#### 引入

```js
import  "../../components/act/a-iconfont";
```

## 代码演示

### 基础用法

1. 支持图标Unicode实体子节点。

```html
     <a-iconfont name="mine"/>
```

2. 也支持 name 属性传入图标名称。

```html
     <a-iconfont name="mine"/>
```

还可以将图标名称作为子节点。

```html
    <a-iconfont>mine</a-iconfont>
```

![](https://i.loli.net/2021/02/25/SDwHWG6AQnRPZFf.png)

### 图标大小

`size` 属性用来设置图标的尺寸大小，默认单位为 `px`。

```html
<a-iconfont name="good" size="32"/>
<a-iconfont name="user" size="66"/>
```

![](https://i.loli.net/2021/02/25/OhfCklMesoWE1Db.png)

### 图标颜色

`color` 属性用来设置图标的颜色。

```html
<a-iconfont name="good" size="32" color="red"/>
<a-iconfont name="user" size="32" color="#3af"/>
<a-iconfont name="map" size="32" color="rgb(123,213,21)"/>
```

![](https://i.loli.net/2021/02/25/yhTNxWiMR8Ds927.png)

## 所有图标

目前示例代码中使用的是 Ant Design 的图标库。请点击这里：https://www.iconfont.cn/collections/detail?cid=9402

本方案致力于鼓励大家使用自己的图标体系。建议自行创建图标项目，伸缩可控。
