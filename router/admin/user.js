// 用户列表页面
const { user } = require('../../model/user');

module.exports = async (req, res) => {
  // 查询数据库中所有的用户数据
  // const userDate = await user.find();
  // return res.send(req.query.page);

  // 分页变量
  // 总数据：查询数据库用户的数据数  12
  const count = await user.countDocuments({});
  // 当前页, 通过 url 传递过来默认为 1
  const page = req.query.page || 1 ;
  // 总页数 = 总数据数 / 每页显示数据数
  const total = Math.ceil(count / 10);   // 1.2 页数要向上取整，1.2页，也就是2页
  // 一页显示多少条数据
  const pagesize  = 10;
  // 当前页 从那个开始查起
  let skipdate = (page - 1) * pagesize;
  // 按照分页 查取的用户信息。
  const pageDate = await user.find().limit(pagesize).skip(skipdate);

  // 把数据传递到模板引擎中
  res.render('admin/user', {
    userDate : pageDate,
    // 总页面，用于渲染 页面的页码 1，2，3
    total: total,
    // 传递当前页，用于控制 上下页的显示和隐藏
    page: page,
    currenLink: 'user'
  });
}