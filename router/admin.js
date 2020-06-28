// 管理页面路由对象
const express = require('express');
// 创建 admin 路由对象
const admin = express.Router();


// 登录页面请求
admin.get('/login', require('../middleware/login'));

// 表单登录请求
admin.post('/login', require('../middleware/loginPage'))

// 用户管理页面
admin.get('/user', require('../middleware/user'));

// 文章编辑页面
admin.get('/article-edit', (req, res) => {
  res.render('admin/article-edit');
})

// 文章管理页面
admin.get('/article', (req, res) => {
  res.render('admin/article');
})

// 添加用户界面
admin.get('/user-edit', require('../middleware/userInterface'));

// 添加用户路由
admin.post('/user-eait-fn', require('../middleware/userAdd'));

// 用户退出
admin.get('/logout', require('../middleware/loginout'));

module.exports = admin;