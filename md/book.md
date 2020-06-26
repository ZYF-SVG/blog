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

router 文件夹：

- home.js  展示页面路由
- admin.js  管理页面路由

`module.exports`导出路由对象；

app.js  导入路由对象；为路由匹配路径，调用对应的路由对象

```js
// app.js：

// 针对 art 模板，使用 express-art-template 模板引擎来处理
app.engine('art', require('express-art-template'));
// 配置根路径
app.set('views', path.join(__dirname, 'views'));
// 设置默认后缀，注意不要多写了 s
app.set('view engine', 'art');
```



# 3. 挂载静态资源 并 设置模板页面

导入静态资源，并挂载静态资源文件；把 html 弄到  views 文件夹中，并把他都区分开；

public 文件夹：静态资源

- admin 文件夹
  - 后台管理
- home 文件夹
  - 前台页面资源

views 文件夹：模板文件

- admin 文件夹
- common  公共模块文件夹
- home  文件夹

static 是什么意思？  静态的





## 1. 外链资源的地址访问问题：

虽然已经配置了，静态资源的根路径 是为  `public`  目录，但一些还有对应的文件夹，

现在之所以可以访问得到资源，是因为我们 路由请求的路径 和 我们文件夹的名称一致；

![外链资源路径问题](H:\node.js\视频教程\博客项目\blog\md\images\外链资源路径问题.png)



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

1. 处理公共部分 并 创建 html骨架模块，让其他子模板继承他，这样在子模板内，就不用写 html 的基本结构了 。

   创建 **common 文件夹**，存放 html骨架模板 和 公共模板；

   - header.art  头部部分模板
   - aside.art    侧边栏部分模板
   - layout.art   骨架模板

   抽取页面的公共部分，分别写到 头部，侧边框 模板中，将每个 模板中的 头部 和 侧边栏 中的部分代替为 公共部分的模板路径：

   ![子模板](H:\node.js\视频教程\博客项目\blog\md\images\子模板.png)

   创建 html 骨架模板：

   预先在 html骨架模板 中挖坑，就是每个页面不同的部分，比如 标题，css引入，主体内容，js 的引入

   ```html
   <!-- html 骨架模板 -->
   <!DOCTYPE html>
   <html lang="en">
   
   <head>
       <meta charset="UTF-8">
       <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
       <title>{{ block 'title'}} {{ /block }}</title>
       <link rel="stylesheet" href="/admin/lib/bootstrap/css/bootstrap.min.css">
       <link rel="stylesheet" href="/admin/css/base.css">
       {{ block 'href' }} {{ /block }}
   </head>
   
   <body>
       {{ block 'main'}} {{ /block }}
   </body>
       {{ block 'script' }} {{ /block }}
   </html>
   ```

   然后到各个子模板中，继承 骨架模板，然后 填坑，填入指定的数据：

   ```html
   <!-- 继承骨架 -->
   {{extend '../common/layout.art'}}
   
   <!-- 填坑 -->
   {{block 'title'}} 文章编辑 {{/block}}
   
   {{block 'main'}}
       <!-- 头部 -->
      {{include '../common/header.art'}}
       <!-- /头部 -->
       <!-- 主体内容 -->
       <div class="content">
           <!-- 侧边栏 -->
           {{include '../common/aside.art'}}
           <!-- 侧边栏 -->
           <div class="main">
               <!-- 分类标题 -->
               <div class="title">
                   <h4>5b9a716cb2d2bf17706bcc0a</h4>
               </div>
               <!-- /分类标题 -->
               <form class="form-container">
                   <div class="form-group">
                       <label>标题</label>
                       <input type="text" class="form-control" placeholder="请输入文章标题">
                   </div>
                   <div class="form-group">
                       <label>作者</label>
                       <input type="text" class="form-control" readonly>
                   </div>
                   <div class="form-group">
                       <label>发布时间</label>
                       <input type="date" class="form-control">
                   </div>
                   
                   <div class="form-group">
                      <label for="exampleInputFile">文章封面</label>
                      <input type="file">
                      <div class="thumbnail-waper">
                          <img class="img-thumbnail" src="">
                      </div>
                   </div>
                   <div class="form-group">
                       <label>内容</label>
                       <textarea class="form-control" id="editor"></textarea>
                   </div>
                   <div class="buttons">
                       <input type="submit" class="btn btn-primary">
                   </div>
               </form>
           </div>
       </div>
   {{/block}}
   
   {{block 'script'}}
       <!-- /主体内容 -->
       <script src="/admin/lib/jquery/dist/jquery.min.js"></script>
       <script src="/admin/lib/bootstrap/js/bootstrap.min.js"></script>
       <script src="/admin/lib/ckeditor5/ckeditor.js"></script>
       <script type="text/javascript">
           let editor;
           ClassicEditor
                   .create( document.querySelector('#editor'))
                   .then(newEditor => {
                       editor = newEditor;
                   })
                   .catch( error => {
                       console.error( error );
                   });
           // 获取数据
           // const editorData = editor.getData();
       </script>
   {{/block}}
   
   ```



# 4. 登录

## 1. 创建用户集合，初始化用户

在 model 文件夹下

### 1. 连接数据库  connent.js

数据库名称 blog ；

```js
//  创建数据库的
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/blog', { useNewUrlParser: true,  useUnifiedTopology: true, useCreateIndex: true})
        .then(() => console.log('数据库连接成功'))
        .catch(err => console.log('数据库连接失败' + err));
```

导入 connent 到 app.js；因为不用用到他里面的值，所以只要引入文件，不用用变量接受 。



### 2.创建集合 

在 model 文件夹下，创建 user 集合，创建 user.js 文件

```js
// 创建用户集合
const mongoose = require('mongoose');

// 创建集合规则
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 15
  },
  email: {   //  唯一性
    type: String,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {   // 角色  admin（超级 /  
    type: String,
    required: true
  },
  state: {  // 状态
    type: Number,
    default: 0   // 0 启动， 1 禁用
  }
})

// 创建集合
const user = mongoose.model('User', userSchema)

/*
user.create({
  username: '鸣人',
  email: 'minren@zr.com',
  password: 123,
  role: 'ordinary',
  state: 0
}).then(res => console.log(res))
  .catch(err => console.log(err));
  /************/

  module.exports = user;
```



### 3. 导出 集合对象

因为可能要导出多个数据，所以直接导出一个对象，键值对的 名字 和 属性 一样的时候，可以写一个就好 （ES6）

```js
module.exports = {
    User : User  //  =>  User 
}
```



### 4. 导入 集合对象

在路由文件中，导入

```js
admin.js:
// 引入 user 集合
const user = require('../model/user');
```





## 2.修改 登录模板 art

form 提交方式 和 提交路径，添加 name 属性；

前端点击登录按钮时，先 阻止表单默认提交（return fasle 就可以阻止提交行为），前端验证用户输入的信息 在 数据库中是否一致 。使用 ajax 进行验证 。

```js
表单.serializeArray()   // 可以获取表单中用户输入的内容

// 输出的格式
[{name: 'xxx', value: 'xxxx'}]

代码：
    <script>
        // 获取 form
        $('#form').on('submit', () => {
            var f = $('#form').serializeArray();
            /* [{name: "email", value: "742317550@qq.com"},{name: "password", value: "123"} ] */
            // 处理数据
            let result = serializeToJson(f);
            // 判断
            if (result.email.trim().length == 0) {
                alert('邮箱账号不能为空');
                return false;
            }
            
            if (result.password.trim().length == 0) {
                alert('密码不能为空');
                return false;
            }
        })
    </script>
```

得到的数据，不方便获取，我们可以进行处理；

common.js   公共js部分，把刚刚处理数据的函数，放在公共的 js 文件，再引入就可以用于了（可以发他放在 html骨架模板 引入这个 js 文件 。

```js
common.js ：
// 处理获取表单的值
function serializeToJson(form) {
    let arr = {};
    form.forEach(item => {
        arr[item.name] = item.value;
    })   // {email: "742317550@qq.com", password: "123"}
    return arr;
}
```

前端只是进行 表单的合法判断；

- 邮箱，密码 长度 大于 0，要清除空格；
- 如果等于 0  就 `return fasle `；

![导入处理数据js文件](H:\node.js\视频教程\博客项目\blog\md\images\导入处理数据js文件.png)



## 3. 添加登录的路由：

接受请求的参数，然后和数据库数据进行对比，看看有没有这个用户，然后在进行登录 。

在 app.js 导入 body-parser 模块，进行全局挂载；

```js
app.js :

// 对 body-parser 进行全局配置, 要写在 配置路由对象 之前
app.use(bodyParser.urlencoded({ extended: false }));
// 监听请求，调用对应的 路由对象, 可以放在 模板引擎配置之前
app.use('/home', home);
app.use('/admin', admin);
```

然后在各路由对象中，使用 req.body 就可以获取到 post 的数据了 。

把 邮箱 和 密码 解构出来，做服务端的验证；

```js
admin.post('/login', (req, res) => {
  // 判断提交过来的数据是否为空
  const {email, password} = req.body;
  // 数据为空，跳转到 404 页面。
  if (email.trim().length == 0 || password.trim().length == 0) {
    return res.status(400).render('admin/error');
  }
})
```

我们前端有设置，要是内容为 空，就不能进行页面的跳转，可以让 js 失效，浏览器 -> 内容设置，可以禁止 js 的执行；创建一个 error.art 模块，错误页面；要记得启用 js 哦 。

模板引擎，可以通过第二个参数，传递变量过去模板那边 ，用对象形式；

```html
error.art 页面：

{{extend '../common/layout.art'}}

{{block 'title'}} 404 {{/block}}

{{ block 'href' }}
 <style>
  body {
    margin: 0;
    padding: 0;
    background-color: #69BCF3;
  }
  h1 {
    margin-top: 10%;
    text-align: center;
    font-size: 20em;
    font-weight: 400;
  }
  p {
    font-size: 26px;
    text-align: center;
  }

 </style>
{{ /block }}

{{ block 'main'}}
  <h1> 404 </h1>
  <p>用户或密码不正确</p>
  <p>页面将在<span class="s">3</span>秒后，跳转到登录页面</p>
{{ /block }}

{{ block 'script'}}
  <script>
    var s = document.querySelector('.s');
    var data = 2;
    // 在 3 秒后，进行跳转
    var interval = setInterval(() => {
      if (data <= 0) {
        location.href = '/admin/login';
        clearInterval(interval);
      }
      s.innerHTML = data;
      data --;
    }, 1000);
  </script>
{{ /block }}
```

根据用户端传递的邮箱，查询数据库数据，是否存在用户：

通过解构获取导入的 user 用户对象，连接数据库获取数据，如果 数据为 空，那就没有查询到，有就为一个数组 ；

如果用户存在，那就对比 密码！

```js
// 引入 user 集合，因为我们导出路由对象是用一个对象，导出的
const { user } = require('../model/user');

// 表单登录请求
admin.post('/login', async (req, res) => {
  // 判断提交过来的数据是否为空
  const {email, password} = req.body;
  // 数据为空，跳转到 404 页面。
  if (email.trim().length == 0 || password.trim().length == 0) {
    return res.status(400).render('admin/error');
  }

  // 数据库查询用户信息
  const data = await user.findOne({email})
  // 判断是否有该用户用户
  if (data) {
    if (data.password == password) {   // 判断密码
    
    } else {   // 密码错误
      return res.status(400).render('admin/error');
    }
  } else {  // 用户不存在
    return res.status(400).render('admin/error');
  }
  
})
```



## 4. 密码加密 bcrypt

下载 bcr 所需的依赖：

![bcrype依赖](H:\node.js\视频教程\博客项目\blog\md\images\bcrype依赖.png)

1. 安装好 python 后，要把安装的目录，弄到 系统变量 中 。

2. 第3个包，要使用 管理员 身份 安装 ；

3. 然后再下载  bcrypt 包

   ```js
   > npm install bcrypt
   // 会报错 node-pre-gyp WARN Using needle for node-pre-gyp https download
   // 使用 bcryptjs 应该可以！
   ```

bcrypt 可以对数据，进行加密，输入有一定的规律，会被破解，我们可以在加密的数据中，添加一段随机数字，来增加 加密的安全度 。

哈希加密是单程加密方式：1234 => abcd

在加密的密码中加入随机字符串可以增加密码被破解的难度。

例子：

```js
// 导入bcrypt模块
const bcrypt = require('bcryptjs');
// 生成随机字符串 gen => generate 生成 salt 盐
let salt = await bcrypt.genSalt(10);
// 使用随机字符串对密码进行加密
let pass = await bcrypt.hash('明文密码', salt);
```

```js
// 密码比对, 返回布尔值 。
let isEqual = await bcrypt.compare('明文密码', '加密密码');
```



cookies 会跟着 请求的发送 而发送。 17

