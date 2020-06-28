// 渲染添加用户界面
module.exports = (req, res) => {
  // 获取 url 中的错误信息，渲染到 模板 中
  res.render('admin/user-edit', {message: req.query.message});
}