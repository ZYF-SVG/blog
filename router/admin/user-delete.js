// 删除用户路由
const { user } = require('../../model/user');

module.exports = (req, res) => {
  // 获取要删除的 id
  const { id } = req.query;
  console.log(id);
  user.findOneAndDelete({_id: id}).then(res => console.log('删除用户成功'))
      .catch(err => console.log('删除用户失败' + err));

  res.redirect('/admin/user');
}