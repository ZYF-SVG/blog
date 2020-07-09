// 展示页路由对象
const express = require('express');

const home = express.Router();

// 渲染文章列表页面
home.get('/', require('./home/index'));

// 渲染文章详情页面
home.get('/article', require('./home/article'));

// 文章评论路由
home.post('/comment', require('./home/comment'));

// 普通用户退出路由
home.get('/logout', require('./home/logout'));

module.exports = home;