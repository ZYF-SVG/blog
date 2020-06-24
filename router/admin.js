// 管理页面路由对象
const express = require('express');

const admin = express.Router();

// 登录页面请求
admin.get('/login', (req, res) => {
  res.render('admin/login')
})

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

module.exports = admin;