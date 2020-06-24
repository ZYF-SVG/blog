# 1. 项目初始化：

## 1. 创建文件夹 blog

- public
- model
- router
- views

## 2. 初始化项目描述文件

```js
npm init -y
```

## 3.下载模块

```js
express mongoose art-template express-art-template
```

## 4. 创建服务器

app.js 文件

监听 80 端口，不是 8080，用户不知道要访问什么端口，所以就采取默认的端口 ；



# 2. 构建模块化路由

router

- home.js  展示页面路由
- admin.js  管理页面路由

`module.exports`导出路由对象；

app.js  导入路由对象；为路由匹配路径，调用对应的路由对象

# 3. 挂载静态资源 并 设置模板页面

导入静态资源，并挂载静态资源文件；把 html 弄到  views 文件夹中，并把他都区分开；

static 是什么意思？

在 app.js 中配置模板的 根路径 和  默认后缀 。

注意：  04

## 1. 外链资源的地址访问问题：

虽然已经配置了，静态资源的根路径 是为  `public`  目录，但一些还有对应的文件夹，

现在之所以可以访问得到资源，是因为我们 路由请求的路径 和 我们文件夹的名称一致；

文件夹目录：

![外链资源文件夹](H:\node.js\视频教程\博客项目\blog\md\images\外链资源文件夹.png)

外链资源的请求路径 是这样的

```html
<link rel="stylesheet" href="css/base.css">
```

他是相对于浏览器的地址栏的第一个斜杆为源起点 去找文件的：

![外链资源地址访问](H:\node.js\视频教程\博客项目\blog\md\images\外链资源地址访问.png)

证明，他是以 浏览器 地址栏的第一个 斜杆 为起点的：

```js
// app.js ：
const app = express();
// 监听请求，调用对应的 路由对象, 可以放在 模板引擎配置之前
app.use('/home', home);
app.use('/admin', admin);

// 第一个杠是我们设置为 二级路由 设置的监听路径，我们更改这个监听的路径为 aaa
app.use('/aaa', admin);
```

当我们在浏览器访问 `http://localhost/aaa/login`  时出现以下问题：

![外链资源访问不到](H:\node.js\视频教程\博客项目\blog\md\images\外链资源访问不到.png)

外链资源的请求路径也 跟着改变了，所以我们要设置 模板的外链资源 的请求路径

**要从项目配置的目录为 模板根目录 开始，而不是浏览器地址栏 为开始的，所以要在所有请求的前面添加一个 / ，就是从 配置的根路径 开始配置！**

```html
<link rel="stylesheet" href="/admin/css/base.css">
```

所以解决这个问题，要不然，当请求的路径 和 我们文件夹的路径，不一样时，就会造成错误 。



## 2. 模板优化：

处理公共部分：

common 文件夹

header.art  头部

aside.art 侧边栏

layout.art   骨架模块

子模板的路径，的相对当前模板文件，他是由模板引擎解析的，所以方向

用户列表路由 /user



骨架模板

layout.art

我坑：

- css 部分   link
- 主体部分   main
- js 部分  script