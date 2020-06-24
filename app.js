const express = require('express');
// 路径拼接
const path = require('path');
// 导入路由模块
const home = require('./router/home');
const admin = require('./router/admin');

// 创建服务器
const app = express();
// 监听请求，调用对应的 路由对象, 可以放在 模板引擎配置之前
app.use('/home', home);
app.use('/admin', admin);

// 挂载静态资源
app.use(express.static(path.join(__dirname, 'public')));

// 设置模板引擎
// 针对 art 模板，使用 express-art-template 模板引擎来处理
app.engine('art', require('express-art-template'));
// 配置根路径
app.set('views', path.join(__dirname, 'views'));
// 设置默认后缀，注意不要多写了 s
app.set('view engine', 'art');



app.listen(80, () => {
  console.log('http://localhost/');
}) 