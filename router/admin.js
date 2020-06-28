// 管理页面路由对象
const express = require('express');
// 创建 admin 路由对象
const admin = express.Router();


// 登录页面请求
admin.get('/login', require('../middleware/login'));

// 表单登录请求
admin.post('/login', require('../middleware/loginPage'))

// 用户管理页面
admin.get('/user', (req, res) => {
  res.render('admin/user');
})

// 文章编辑页面
admin.get('/article-edit', (req, res) => {
  res.render('admin/article-edit');
})

// 文章管理页面
admin.get('/article', (req, res) => {
  res.render('admin/article');
})

// 用户信息编辑页面
admin.get('/user-edit', (req, res) => {
  res.render('admin/user-edit');
})

// 用户退出
admin.get('/logout', require('../middleware/loginout'));

module.exports = admin;