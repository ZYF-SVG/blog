// 渲染 添加用户 和 修改用户 界面，
const { user } = require('../model/user');

module.exports = async (req, res) => {
  // 可以根据 是否有传递 id 过来来区分，2个操作
  const { id } = req.query;
  if (id) {
    // 修改操作
    // 根据 id 获取用户的信息
    const userlist = await user.findOne({_id: id});

    // 模板引擎
    res.render('admin/user-edit', {
      // 获取错误信息
      message: req.query.message,
      // 传递用户的信息，展示在页面上
      userlist: userlist,
      // 修改页面 有 id
      id: id,
      // 不同操作，有不同的表单提交地址, 修改用户携带 id 过去
      actiona: '/admin/user-modify?id=' + id,
      // 按钮
      button: '修改'
    })
  } else {
    // 添加操作
    // 获取 url 中的错误信息，渲染到 模板 中
    res.render('admin/user-edit', {
      message: req.query.message,
      actiona: '/admin/user-eait-fn',
      button: '提交'
    });
  }
}