// 普通用户退出路由
module.exports = (req, res) => {
  // 记
  req.session.destroy(function() {
    // 清空 
    req.app.locals.userInfo = null;
    // 删除 cookie
    res.clearCookie('connect.sid');
    // 重定向
    res.redirect('/home/');
  })
}