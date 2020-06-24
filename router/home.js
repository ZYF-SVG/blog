// 展示页路由对象
const express = require('express');

const home = express.Router();

home.get('/', (req, res) => {
  res.send('展示页面');
})

module.exports = home;