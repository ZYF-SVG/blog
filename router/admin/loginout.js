// 用户退出
module.exports = (req, res) => {
  // 删除 session
  req.session.destroy(function() {
    // 清空 
    req.app.locals.userInfo = null;
    // 删除 cookie
    res.clearCookie('connect.sid');
    // 重定向
    res.redirect('/admin/login');
  })
}