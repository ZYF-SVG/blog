//  登录拦截中间件
module.exports = (req, res, next) => {
  // 除登录页面 和  req.session.username 为 undefined（就是用户没有登录
  if (req.url != '/login' && !req.session.username) {
    res.redirect('/admin/login');
  } else {
    // console.log(req.session.username);
    // console.log('我发送了session');
    next();
  }
}
/*
1. 浏览器没有 sessionid 不能直接通过 浏览器地址栏 访问其他页面；
2. 在其他页面时， 删除浏览器的 cookes ，再刷新页面，重定向到 登录页面 ；
*/