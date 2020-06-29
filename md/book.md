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

**注意**： 

- `bcrypt.genSalt`   和   `bcrypt.hash` 都是返回一个 `Promise { <pending> }`  对象 。

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



## 5. 使用 session 存储用户信息

### cookie 与 session

**cookie**：浏览器在电脑硬盘中开辟的一块空间，主要供服务器端存储数据。

- cookie中的数据是以域名的形式进行区分的。

- cookie中的数据是有过期时间的，超过时间数据会被浏览器自动删除。

- cookie中的数据会随着请求被自动发送到服务器端。

![cookie 的交互图](H:\node.js\视频教程\博客项目\blog\md\images\cookie 的交互图.png)

**session**：实际上就是一个对象，存储在服务器端的内存中，在 session对象 中也可以存储多条数据，每一条数据都有一个 **sessionid** 做为唯一标识。

![ession 和 cookie](H:\node.js\视频教程\博客项目\blog\md\images\ession 和 cookie.png)

​	**cookies 会跟着 请求的发送 而发送，不用设置的，自动发送的 。** 

**下载**：在node.js中需要借助express-session实现session功能。

```js
> npm install express-session
```

**语法**：

使用  `express-session` 模块实现 session 功能

```js
const session = require('express-session');
app.use(session({secret: '密钥'}));
// session 加密和解密所需的钥匙；
```

当服务端重启时，服务端的 session 就失效了的。

登录路由中，给 `req.session.username = user.username`  就是用户名，添加到 req 中，后，再访问其他路由，获取 req 中我们添加的属性 。

**步骤**：

1. 在 app.js 中导入  express-session ，并配置 session，注意！配置 session 必须在 app 监听路由对象之前，不然在路由对象中，找不到 session；

   ```js
   app.js ：
   
   // 导入 session 模块
   const session = require('express-session');
   // 创建服务器
   const app = express();
   // 导入 session 模块
   const session = require('express-session');
   
   // 设置 session 密钥, 必须放在，路由对象之前；
   app.use(session({secret: '742317550'}));
   
   // 监听请求，调用对应的 路由对象, 可以放在 模板引擎配置之前
   app.use('/home', home);
   app.use('/admin', admin);
   ```

2. 然后在 admin 路由对象中配置， 主要是在 登录 成功后，就给 客户端 发送 sessionid，

   ```js
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
   
     // 判断是否有该用户用户, 进行加密密码的验证，返回布尔值
     let isEqual = await bcrypt.compare(password, data.password);
     
     if (data) {
       if (isEqual) {   // 判断密码
         // 通过 session 给 req 添加一个 username 的属性,值为 用户名
         req.session.username = data.username;
         res.send('成功');
       } else {
         return res.status(400).render('admin/error');
       }
     } else {
       return res.status(400).render('admin/error');
     }
   })
   
   // 在登录成功后，服务器 会给 浏览器发送 sessionid ，然后存储在 cookies 中；每次用户发送请求时，都会携带在请求响应 中，服务器 会根据这个 sessionid 在内部查找，看一看，有没有这个 用户存在；就可以返回这个用户对应的信息，给 客户端。
   
   // 登录成功后，访问 用户管理页面，然后给他传递数据，数据为 session 存储的登录用户名 。
   // 用户管理页面
   admin.get('/user', (req, res) => {
     res.render('admin/user', {mag: req.session.username});
   })
   ```

   ![用户登录](H:\node.js\视频教程\博客项目\blog\md\images\用户登录.png)

   ​	

3. 如果没有使用 session 来存储，用户的信息，登录 就像没有 登录一样，在页面的页面获取不到登录用户的信息 。

4. 登录成功，后重定向列表页面。

```js
// 页面重定向到 用户管理页面
res.redirect('/admin/user');
```

5. 显示用户名在 公共部分的头部；把公共的数据放到 一个可以共享的地方。

```js
req.app.locals.userInfo = user;
// 这里的 app 就是app.js中的 app，不用导入，在 req 里面。

// 判断是否有该用户用户, 进行加密密码的验证
  let isEqual = await bcrypt.compare(password, data.password);
  
  if (data) {
    if (isEqual) {   // 判断密码
      // 通过 session 给 req 添加一个 username 的属性,值为 用户名,
      req.session.username = data.username;
      // 将用户的数据 都存储数据到 模板引擎 中
      req.app.locals.userInfo = data;
      // 页面重定向到 用户管理页面
      res.redirect('/admin/user');
    } else {
      return res.status(400).render('admin/error');
    }
  } else {
    return res.status(400).render('admin/error');
  }
})

// layout.art
<div class="header">
  <!-- 网站标志 -->
    <div class="logo fl">
      黑马程序员 <i>ITHEIMA</i>
    </div>
    <!-- /网站标志 -->
    <!-- 用户信息 -->
    <div class="info">
      <div class="profile dropdown fr">
        <span class="btn dropdown-toggle" data-toggle="dropdown">
          {{userInfo.username}}
          <span class="caret"></span>
        </span>
        <ul class="dropdown-menu">
            <li><a href="user-edit.html">个人资料</a></li>
            <li><a href="#">退出登录</a></li>
        </ul>
      </div>
    </div>
    <!-- /用户信息 -->
</div>
```



req.session 里面是这样的：

```js
Session {
  cookie:
   { path: '/',
     _expires: null,
     originalMaxAge: null,
     httpOnly: true } 
}

// 用户登录后，向 session 里添加了 username
Session {
  cookie:
   { path: '/',
     _expires: null,
     originalMaxAge: null,
     httpOnly: true },
  username: '暗部成员' 
}
```

如果 session 会自动发送一个  session 给浏览器，存储在 浏览器的 cookies 中：

![cookies的存储](H:\node.js\视频教程\博客项目\blog\md\images\cookies的存储.png)

然后，浏览器发起请求时，请求体也会自动携带 cookies![cookie](H:\node.js\视频教程\博客项目\blog\md\images\cookie.png)





## 6. 登录拦截

监听路由是以 /admin 开头的，看看用户有没有登录，如果没有登录就 不能访问，但除 login 页面为。

```js
app.js:

// 挂载静态资源, 要放在登录拦截之前；
app.use(express.static(path.join(__dirname, 'public')));

// 登录拦截， 放在路由对象前面
app.use('/admin', (req, res, next) => {
  // 除登录页面 和  req.session.username 为 undefined（就是用户没有登录
  if (req.url != '/login' && !req.session.username) {
    res.redirect('/admin/login');
  } else {
    next();
  }
})

// 监听请求，调用对应的 路由对象, 可以放在 模板引擎配置之前
app.use('/home', home);
app.use('/admin', admin);
```



## 7. 优化代码

在 model 文件夹 创建  `middleware`文件夹 放置中间件文件：

**步骤**：

- loginGuard.js 文件 登录拦截

  ```js
  //  登录拦截中间件
  module.exports = (req, res, next) => {
    // 除登录页面 和  req.session.username 为 undefined（就是用户没有登录
    if (req.url != '/login' && !req.session.username) {
      res.redirect('/admin/login');
    } else {
      // console.log(req.session);
      next();
    }
  }
  ```

- 在 app.js 中导入：

  ```js
  // 登录拦截， 放在路由对象前面
  app.use('/admin', require('./model/middleware/loginGuard'));
  
  // 监听请求，调用对应的 路由对象, 可以放在 模板引擎配置之前
  app.use('/home', home);
  app.use('/admin', admin);
  ```

  总结：router >  admin 放置每个路由的处理函数文件，然后导出，作为路由的 第二个 参数；

- login.js  处理登录的函数体，事件的处理，然后导出；

- loginPage.js 登录页面的渲染文件；

- loginout.js 退出



## 8. 注册用户：

1. 客户端前面页面进行数据的判断；
2. 后端人员再进行一次判断，使用 joi 模块，进行判断，捕获错误信息，然后进行提示；

normal  admin 角色 2个 内容；

### 1. 修改添加模板 添加路由；

修改添加用户模板的 表单提交方式 和 提交路径； 然后新建一个 添加用户路由文件，然后引进 app.js 

新建一个 `userAdd.js` 文件，存放 添加用户路由处理函数；

`admin.js` 引入这个路由处理函数；

```js
// 添加用户界面
admin.get('/user-edit', require('../middleware/userInterface'));

// 添加用户路由
admin.post('/user-eait-fn', require('../middleware/userAdd'));
```



### 2. 服务端进行数据的验证，捕获错误信息

在 `userAdd.js` 中书写验证的函数体：

首先要下载 joi 第三方验证 字段 模块  Joi： js 对象的规则描述语言 和 验证器。

```js
> npm install joi 
```

基本语法：

```js
// 验证的规则
const schema = {
	// 书写验证规则
}
  
// 对数据进行验证
joi.validate({进行验证的数据: 验证的值}, schema);

joi.validate(req.body, schema);
```

然后就可以书写验证的代码了；

 一般是这样的：
    表单的验证，前端页面要进行一次验证；
    然后，后端再导入数据库前，也要进行一次验证； 使用 joi，不用我们一个一个去获取数据，
    然后在编写验证的方法逻辑，使用 joi 内部定义好的一些验证方法，比较方便。

```js
const joi = require('joi');

// 添加用户路由
module.exports = async (req, res) => {
  // 因为在 app.js 中有导入了 body-parser 模块，所以可以使用 req.body 获取数据

  // 验证的规则
  const schema = {
    username: joi.string().min(2).max(10).required().error(new Error('提示：用户名最少2位，最多10位，为必填项')),
    password: joi.string().required().regex(/^[a-zA-Z0-9]{6,15}$/).error(new Error('提示：密码不能包括提示符号，最短为6位，最长为15位，为必填项')),
    email: joi.string().email().error(new Error('提示：邮箱非法')),
    role: joi.string().valid('normal', 'admin').required().error(new Error('提示：角色值只能为普通用户 和 超级用户')),
    state: joi.string().valid('0', '1').required().error(new Error('提示： 用户的状态只能为 启用 和 禁用'))
  }
  // 对数据进行验证, 错误时，返回错误信息
  try {
    await joi.validate(req.body, schema);
  } catch(err) {
    // console.log(err.message);
    message = err.message == {} ? '正确' :  err.message;
    // 重定向到 添加页面
    return res.redirect('/admin/user-edit?message='+ message);
  }
  res.send('ok');
}
```



渲染添加用户文件： 获取错误信息，渲染到 模板 中。

```js
// 渲染添加用户界面
module.exports = (req, res) => {
  // 获取 url 中的错误信息，渲染到 模板 中
  res.render('admin/user-edit', {message: req.query.message});
}
```



user-edit.art 页面

```html
 <!-- 分类标题 -->
<div class="title">
    <h4>5b9a716cb2d2bf17706bcc0a</h4>
    <!-- 显示错误信息 -->
    <p class="tips">{{message}}</p>
</div>
```

![joi捕获错误信息](H:\node.js\视频教程\博客项目\blog\md\images\joi捕获错误信息.png)

**错误**：

- 之前把 错误信息，存放到 模板引擎中， 是错误的，这样当有其他的错误信息时，模板页面要进入多个 变量，这样不好，所以把 错误信息，存放到 url 中，统一获取，统一渲染：

  ```js
  // 把错误信息，放到 模板引擎 的信息共享处  
      req.app.locals.message = message;
  ```

  



### 3. 验证邮箱 是否被注册

根据返回值来判断有没有这个用户，存在就有数据，空的就没有存在 ；

错误的信息也可以根据 get 请求，携带在 url 中

```js
// 在数据库中，查找添加的用户是否存在
  const userEmail = await user.findOne({email: req.body.email})
  // 如果查取的数据不为 空，那就证明 用户存在
  if (userEmail !== null) {
    // 重定向 添加用户页面
    return res.redirect('/admin/user-edit?message=用户已存在');
  }
```





### 4. 对密码进行加密

把加密的密码 替换 body 里面的密码 。

```js
 // 对密码进行加密
  let salt = await bcrypt.genSalt(10);
  let password = await bcrypt.hash(req.body.password, salt);
  // 用加密后的密码 替换 用户提交的密码
  req.body.password = password;
```



### 5. 添加到数据库中

```js
  // 将用户添加到数据库中
  user.create(req.body).then(doc => console.log('添加用户成功'))
      .catch(err => console.log('添加用户失败'));
  
  // 重定向到 用户管理页面
  res.redirect('/admin/user');
```



### 6. 代码优化

#### 1.代码的区分

因为 路由文件中，一般不进行 数据的处理的，所以可以把数据处理的一些文件，否存放在 modle 文件夹中的 user.js 中。

因为 这个验证 是针对 用户的，所以写在这个 和他的功能是一样的，处理用户的代码；

步骤：

1. 将原来的验证全部剪切：

   ![用户添加验证代码](H:\node.js\视频教程\博客项目\blog\md\images\用户添加验证代码.png)

2. 和 try 包裹的代码，都弄到 user.js  中处理 ：

3. 在 user 定义一个变量，接收 验证后的结果：

   ![user.js中的验证](H:\node.js\视频教程\博客项目\blog\md\images\user.js中的验证.png)

4. 在 原来的地方，解构赋值 出这个变量，写在 try 包裹的代码中，传入 验证的数据

   ![验证导入](H:\node.js\视频教程\博客项目\blog\md\images\验证导入.png)



#### 2. 添加错误处理中间件

错误处理中间件

我们错误时，都要进行页面的重定向，重复代码了，

可以把重定向的代码放在 错误处理中间件中。

1. 在 app.js  中创建错误处理中间件

   ```js
   // 错误处理中间件
   app.use((err, req, res, next) => {
   
   })
   ```

2. 路由函数体，在触发错误时，调用 `next()`,传递错误时，要传递的信息；

   ```js
     // 对添加用户的数据进行验证, 错误时，返回错误信息
     try {
       await validateUser(req.body);
     } catch(err) {
       message = err.message == {} ? '正确' :  err.message;
       // 触发错误中间件
       return next(JSON.stringify({path: '/admin/user-edit', message: message}))
     }
   ```

3. 错误处理中间件接收参数，并进行参数传递 和 重定向：

   ```js
   // 错误处理中间件
   app.use((err, req, res, next) => {
     const data = JSON.parse(err);
     // return res.redirect('/admin/user-edit?message='+ message);
     res.redirect(`${data.path}?message=${data.message}`);
   })
   ```

   

## 9. 渲染用户列表

在 `middleware`文件创建： user.js 文件，专门用于渲染 用户列表的 。

当用户访问 `/admin/user` ：

```js
admin.js :

// 用户管理页面
admin.get('/user', require('../middleware/user'));
```

**1. 查询数据库里的所有用户信息，然后传递到模板引擎中，渲染数据：**

```js
// 用户列表页面
const { user } = require('../model/user');

module.exports = async (req, res) => {
  // 查询数据库中所有的用户数据
  const userDate = await user.find();

  // 把数据传递到模板引擎中
  res.render('admin/user', {
    userDate : userDate,
  });
}
```

**注意**：

- id 原文输出就不会有 引号了。



**2. 完成分页功能：**

概述： 实际上就是点击页码时，发送 get 请求，携带当前页的数字，然后服务端获取到，这个数字，在通过技术，在数据库中查找，按照发送过来的 当前页，限制查找的数据 。

几个必须的变量：

```js
page:  当前页，通过 url 获取，没有传递过来就默认为 1；
pagesize：  一个页面显示多个数据； 
count：  总数据，从数据库中获取的数据的总和；
total：总页数 = 总数据 / 一页显示多少数据 （注意要向上取整，没有1.5页 ）；
skipdate： 当前页从那条数据开始渲染： 可以限制每一页从那条数据开始渲染；利用
		  skip 来实现；计算公式：
          （当前页 - 1） * 10；
          第一页 - 1 * 10 = 0；   skip 就从数据库为 0 的开始查；
          第二页 - 1 * 10 = 10；  skip 就从数据库为 10 的开始查；
          ...................

`user.countDocuments({}) 查询数据库里的 数据数；`
```

1. 变量 page 从 url 或值：

   ```js
   // 当前页, 通过 url 传递过来默认为 1
   const page = req.query.page || 1 ;
   ```

2. 规定一个页面要显示多少条数据：

   ```js
   // 一页显示多少条数据
   const pagesize  = 10;
   ```

3. 获取数据的总数据：

   ```js
   // 总数据：查询数据库用户的数据数  12
   const count = await user.countDocuments({});
   ```

4. 计算出 总页数：

   ```js
   // 总页数 = 总数据数 / 每页显示数据数
   const total = Math.ceil(count / 10);   // 1.2 页数要向上取整，1.2页，也就是2页
   ```

5. 计算 当前页  和  查找关系：

   ```js
   // 当前页 从那个开始查起
   let skipdate = (page - 1) * pagesize;
   ```

6. 结合 查找多少条数据 和 查找关系，从数据库查取数据：

   ```js
   // 按照分页 查取的用户信息。
   const pageDate = await user.find().limit(pagesize).skip(skipdate);
   ```

7. 把 从数据库得到的数据，总页数 和  当前页 传入 模板引擎 中；

   ```js
   // 把数据传递到模板引擎中
   res.render('admin/user', {
       userDate : pageDate,
       // 总页面，用于渲染 页面的页码 1，2，3
       total: total,
       // 传递当前页，用于控制 上下页的显示和隐藏
       page: page
   });
   ```

8. 在模板页面，首先控制 列表的显示数据先：

   ```js
   user.art :
   {{each userDate}}
   <tr>
   <td>{{@$value._id}}</td>
   <td>{{$value.username}}</td>
   <td>{{$value.email}}</td>
   <td>{{$value.role == 'normal' ? '普通用户' : '超级用户'}}</td>
   <td>{{$value.state == 0 ? '启用' : '禁用' }}</td>
   <td>
       <a href="user-edit.html" class="glyphicon glyphicon-edit"></a>
       <i class="glyphicon glyphicon-remove" data-toggle="modal" data-target=".confirm-modal"></i>
   </td>
   </tr>
   {{/each}}
   ```

9. 利用 page 控制页码的渲染，点击 page 发送对应的请求；

   ```html
   <% for (let i = 1; i <= total; i++) {%>
   	<li><a href="/admin/user?page=<%= i%>" ><%= i %></a></li>
   <% } %>
   ```

10. 最后再控制 上下页显示与隐藏：

    ```html
    <!-- 上一页 ：当前页 为  1 时，就隐藏上一页；-->
    <li style="display: <%= page == 1 ? 'none' : 'inline' %>">
        <a href="/admin/user?page=<%= page - 1%>">
        	<span>&laquo;</span>
        </a>
    </li>
    
    <!-- 下一页 ： 在进行 + 时，会进行字符串的拼接，可以先 减一个 0，开启隐式转换 -->
    <li style="display: <%= page - 0 + 1 > total ? 'none' : 'inline' %>">
        <a href="/admin/user?apge=<%= page - 0 + 1%>">
            <span>&raquo;</span>
        </a>
    </li>
    <!-- 就是不知道，为什么要进行 + 1 呢 ？ -->
    ```

    



## 10. 修改用户信息

admin/user-edit  这个页面，和用户添加页面是同一个页面，所以在进行渲染页面时，要进行判断，修改用户 url 中有传递的 id， 添加用户 的没有 id；

页面是后 `userInterface` 文件，来进行渲染的：

```js
// 添加用户 和 修改用户 界面 
admin.get('/user-edit', require('../middleware/userInterface'));
```

在  `userInterface` 文件中，首先进行判断 id 是否存在：

```js
// 渲染 添加用户 和 修改用户 界面，
const { user } = require('../model/user');

module.exports = async (req, res) => {
  // 可以根据 是否有传递 id 过来来区分，2个操作
  const { id } = req.query;
  if (id) {
    // 修改操作
  else {
    // 添加操作 
  }
}
```

2个分支，是2个不同的操作，都使用 模板引擎 去渲染，但渲染的数据不同；

```js
// 渲染 添加用户 和 修改用户 界面，
const { user } = require('../model/user');

module.exports = async (req, res) => {
  // 可以根据 是否有传递 id 过来来区分，2个操作
  const { id } = req.query;
  if (id) {
    // 修改操作
    // 根据 id 获取用户的信息
    const userlist = await user.findOne({_id: id});

    // 模板引擎
    res.render('admin/user-edit', {
      // 获取错误信息
      message: req.query.message,
      // 传递用户的信息，展示在页面上
      userlist: userlist,
      // 修改页面 有 id
      id: id,
      // 不同操作，有不同的表单提交地址, 修改用户携带 id 过去
      actiona: '/admin/user-modify?id=' + id,
      // 按钮
      button: '修改'
    })
  } else {
    // 添加操作
    // 获取 url 中的错误信息，渲染到 模板 中
    res.render('admin/user-edit', {
      message: req.query.message,
      actiona: '/admin/user-eait-fn',
      button: '提交'
    });
  }
}
```



然后，共同的模板 `user-edit.art` 中，进行判断并渲染数据；注意，记得判断，是否有这个数据，再进行渲染，如果没有判断，在进行 添加用户 时，修改用户 的数据在 模板页面上 就没有传递进去，肯定会报错 ！

```html
<!-- 分类标题 -->
<div class="title">
    <!-- 修改页面有id，添加用户页面没有id，所以使用 || 或 来应对，不会报错 -->
    <h4>{{@id || '添加用户'}}</h4>
    <!-- 错误提示 -->
    <p class="tips">{{message}}</p>
</div>
<!-- /分类标题 -->
<form class="form-container" action="{{actiona}}" method="post">
    <div class="form-group">
        <label>用户名</label>
        <!-- 给每个控件，添加 value 属性，并进行判断 -->
        <input type="text" value="{{ userlist && userlist.username }}" name="username" class="form-control" placeholder="请输入用户名" >
    </div>
    <div class="form-group">
        <label>邮箱</label>
        <input type="email" value="{{ userlist && userlist.email }}" name="email" class="form-control" placeholder="请输入邮箱地址">
    </div>
    <div class="form-group">
        <label>密码</label>
        <input type="password" name="password" class="form-control" placeholder="请输入密码">
    </div>
    <div class="form-group">
        <label>角色</label>
        <select class="form-control" name="role">
            <option value="normal" {{ userlist && userlist.role == 'normal' ? 'selected' : ''}}>普通用户</option>
            <option value="admin"  {{ userlist && userlist.role == 'admin' ? 'selected' : ''}}>超级管理员</option>
        </select>
    </div>
    <div class="form-group">
        <label>状态</label>
        <select class="form-control" name="state">
            <option value="0" {{ userlist && userlist.state == 0 ? 'selected' : ''}}>启用</option>
            <option value="1" {{ userlist && userlist.state == 1 ? 'selected' : ''}}>禁用</option>
        </select>
    </div>
    <div class="buttons">
        <!-- 给按钮添加不同的文字， 提交 或是 修改 -->
        <input type="submit" class="btn btn-primary" value="{{button}}">
    </div>
</form>
```

![中间件进行优化](H:\node.js\视频教程\博客项目\blog\md\images\中间件进行优化.png)

这就是，修改用户 的页面；

点击修改，会触发 另一个 路由，专门成立 添加事件 的： `usermodify.js`  文件

1. 提交的时候，进行 密码 的判断，正确就进行  修改操作；否则就 触发错误中间件；传递 错误信息过去 ；

```js
// 修改用户信息
const { user } = require('../model/user');
const bcrypt = require('bcryptjs');

module.exports = async (req, res, next) => {
  const id = req.query.id;
  const { username, email, role, state, password } = req.body;

  // 比对用户提交的密码 和 数据库里的密码 一样就修改密码 反着就 重定向到修改页面 。
  const { password:userid } = await user.findOne({_id: id});
  // 进行密码的对比
  const is = await bcrypt.compareSync(password, userid);

  if (is) {
    // 匹配一致, 进行修改
    user.updateOne({_id: id}, {username, email, role, state}).then(res => {
      console.log('修改用户数据成功');
    })
    // 重定向
    return res.redirect('/admin/user');
  } else {
    // 密码不一致, 触发错误中间件，传递 重定向 和 错误的信息 和 参数
    const resurl = { path: '/admin/user-edit',  message: '您输入的密码不一致', id: id };
    return next(JSON.stringify(resurl));
  }
}
```

2. 但 错误中间件 没有办法 获取 id，err 写死了，只能接受 2个参数；所以进行修改；

```js
app.use((err, req, res, next) => {
  const data = JSON.parse(err);
  // 1.第一代：return res.redirect('/admin/user-edit?message='+ message);
  // {"path":"/admin/user-edit","message":"您输入的密码不一致","id":"5ef5f917fca85f0eac57b8c2"}
  // 2.第二代：res.redirect(`${data.path}?message=${data.message}`); // 这样只能获取到 path 和 message，无法获取 id
  // 循环遍历，拿到传递过来的每一项数据
  const parameter = [];
  for (let item in data) {
    // 排除 path 项
    if (item !== 'path') {
      // 接收的数据为：[ message: '您输入的密码不一致', id: '5ef5f917fca85f0eac57b8c2' ]
      // 转换为：[ 'message=您输入的密码不一致', 'id=5ef5f917fca85f0eac57b8c2' ]
      parameter.push(item + '=' + data[item]);
    }
  }
  // 把数组用 & 分隔成 这样： message=您输入的密码不一致&id=5ef5f917fca85f0eac57b8c2
  // parameter.join('&'); 把他当成参数传递过去。
  res.redirect(`${data.path}?${parameter.join('&')}`);
})
```

将用户提交的密码 和  数据库中的用户 密码，进行匹配；

bcrypt 进行匹配，返回一个布尔值 ；

修改信息，不包括密码，密码是进行比对的，看能不能进行 修改而已 。

重定向到 用户列表页面