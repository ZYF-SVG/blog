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
  const data = await user.findOne({email});
  
  if (data) {
    // 判断是否有该用户用户, 进行加密密码的验证
    let isEqual = await bcrypt.compare(password, data.password);

    if (isEqual) {   // 判断密码
      // 通过 session 给 req 添加一个 username 的属性,记录登录的 用户,
      req.session.username = data.username;

      // 记录用户的 角色
      req.session.role = data.role;

      // 对用户角色进行判断，跳转到对应的页面
      if (req.session.role == 'admin') {
        // 超级用户
         res.redirect('/admin/user');
      } else {
        // 普通用户
         res.redirect('/home/');
      }

      // 将用户的数据 都存储数据到 模板引擎 中,记录当前登录的用户的信息
      req.app.locals.userInfo = data;
      // 页面重定向到 用户管理页面

      // res.redirect('/admin/user');
    } else {
      return res.status(400).render('admin/error');
    }
  } else {
    return res.status(400).render('admin/error');
  }
  
}