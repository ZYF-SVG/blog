// 导入 express 模块
const express = require('express');
// 导入 路径拼接模块
const path = require('path');
// 导入 post 请求处理模块
const bodyParser = require('body-parser');
// 导入 路由模块
const home = require('./router/home');
const admin = require('./router/admin');
// 导入 连接数据库模块
require('./model/connent');
// 导入 session 模块
const session = require('express-session');

// 创建服务器
const app = express();

// 挂载静态资源, 要放在登录拦截之前；
app.use(express.static(path.join(__dirname, 'public')));

// 对 body-parser 进行全局配置, 要写在 配置路由对象 之前
app.use(bodyParser.urlencoded({ extended: false }));

// 设置 session 密钥, 必须放在，路由对象之前；
app.use(session({secret: '742317550'}));

// 登录拦截， 放在路由对象前面
app.use('/admin', require('./middleware/loginGuard'));

// 监听请求，调用对应的 路由对象, 可以放在 模板引擎配置之前
app.use('/home', home);
app.use('/admin', admin);

// 设置模板引擎
// 针对 art 模板，使用 express-art-template 模板引擎来处理
app.engine('art', require('express-art-template'));
// 配置根路径
app.set('views', path.join(__dirname, 'views'));
// 设置默认后缀，注意不要多写了 s
app.set('view engine', 'art');

// 错误处理中间件
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

app.listen(80, () => {
  console.log('http://localhost/');
}) 