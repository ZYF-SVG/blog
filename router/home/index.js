// 文章首页路由处理函数
// 引入 文章集合
const { article } = require('../../model/article');
// 导入分页模块
const pageination = require('mongoose-sex-page');

module.exports = async (req, res) => {
  const page = req.query.page;
  // 查询文章列表
  const result = await pageination(article).page(page).size(4).display(2).find().populate('author').exec();

  res.render('home/default', {
    result: result 
  });
}