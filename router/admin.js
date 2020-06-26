// 管理页面路由对象
const express = require('express');
// 创建 admin 路由对象
const admin = express.Router();
// 引入 user 集合
const { user } = require('../model/user');
// 导入 bcrypt 模块
const bcrypt = require('bcryptjs');

// 登录页面请求
admin.get('/login', (req, res) => {
  res.render('admin/login')
})

// 登录用户查询是否存在
admin.get('/isuser', async (req, res) => {
  const email = req.query.email;
  const data = await user.findOne({email: email});
  if (data) {
    res.send('1');
  } else {
    res.send('0');
  }
})

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
  // 判断是否有该用户用户, 进行加密密码的验证
  let isEqual = await bcrypt.compare(password, data.password);
  
  if (data) {
    if (isEqual) {   // 判断密码
      res.send('成功');
    } else {
      return res.status(400).render('admin/error');
    }
  } else {
    return res.status(400).render('admin/error');
  }
  
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