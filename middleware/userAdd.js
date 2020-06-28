const joi = require('joi');
const { user, validateUser } = require('../model/user');
// 导入加密模块
const bcrypt = require('bcryptjs');

// 添加用户路由
module.exports = async (req, res, next) => {

  // 对添加用户的数据进行验证, 错误时，返回错误信息
  try {
    await validateUser(req.body);
  } catch(err) {
    message = err.message == {} ? '正确' :  err.message;
    /*把错误信息，放到 模板引擎 的信息共享处, 这种不灵活，采用携带在 url 中   
      req.app.locals.message = message;
      重定向到 添加页面,必须要进行 return 停止程序向下执行，
      不然在 进行重定向后 还会 执行 res.send 会报错的 。
      return res.redirect('/admin/user-edit?message='+ message); */
    // 触发错误中间件
    return next(JSON.stringify({path: '/admin/user-edit', message: message}))
  }

  // 在数据库中，查找添加的用户是否存在
  const userEmail = await user.findOne({email: req.body.email})
  // 如果查取的数据不为 空，那就证明 用户存在
  if (userEmail !== null) {
    // 重定向 添加用户页面
    // return res.redirect('/admin/user-edit?message=用户已存在');
    // 触发错误中间件
    return next(JSON.stringify({path: '/admin/user-edit', message: '用户已存在'}))
  }

  // 对密码进行加密
  let salt = await bcrypt.genSalt(10);
  let password = await bcrypt.hash(req.body.password, salt);

  // 用加密后的密码 替换 用户提交的密码
  req.body.password = password;

  // 将用户添加到数据库中
  user.create(req.body).then(doc => console.log('添加用户成功'))
      .catch(err => console.log('添加用户失败'));
  
  // 重定向到 用户管理页面
  res.redirect('/admin/user');
}