// 管理页面路由对象
const express = require('express');
// 创建 admin 路由对象
const admin = express.Router();


// 登录页面请求
admin.get('/login', require('./admin/login'));

// 表单登录请求
admin.post('/login', require('./admin/loginPage'));

// 用户管理页面
admin.get('/user', require('./admin/user'));

// 添加用户 和 修改用户 界面 
admin.get('/user-edit', require('./admin/userInterface'));

// 添加用户路由
admin.post('/user-eait-fn', require('./admin/userAdd'));

// 修改用户信息路由
admin.post('/user-modify', require('./admin/usermodify'));

// 用户删除路由
admin.get('/delete', require('./admin/user-delete'));

// 用户退出
admin.get('/logout', require('./admin/loginout'));

// 文章列表页面
admin.get('/article', require('./admin/article'));

// 渲染 添加 和 编辑 文章页面 
admin.get('/article-edit', require('./admin/article-edit'));

// 提交 添加文章 路由
admin.post('/article-add', require('./admin/article-add'));

module.exports = admin;