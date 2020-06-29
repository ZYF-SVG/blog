// 修改用户信息
const { user } = require('../model/user');
const bcrypt = require('bcryptjs');

module.exports = async (req, res, next) => {
  const id = req.query.id;
  const { username, email, role, state, password } = req.body;

  // 比对用户提交的密码 和 数据库里的密码 一样就修改密码 反着就 重定向到修改页面 。
  const { password:userid } = await user.findOne({_id: id});
  // 进行密码的对比
  const is = await bcrypt.compareSync(password, userid);

  if (is) {
    // 匹配一致, 进行修改
    user.updateOne({_id: id}, {username, email, role, state}).then(res => {
      console.log('修改用户数据成功');
    })
    // 重定向
    return res.redirect('/admin/user');
  } else {
    // 密码不一致, 触发错误中间件，传递 重定向 和 错误的信息 和 参数
    const resurl = { path: '/admin/user-edit',  message: '您输入的密码不一致', id: id };
    return next(JSON.stringify(resurl));
  }
}