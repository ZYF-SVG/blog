// 处理表单登录请求
// 引入 user 集合
const { user } = require('../model/user');
// 导入 bcrypt 模块
const bcrypt = require('bcryptjs');

module.exports = async (req, res) => {
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
      // console.log('你登录了？');
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
  
}