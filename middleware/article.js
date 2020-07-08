// 文章列表页面
const { article } = require('../model/article');
// 引入分页模块
const pageination = require('mongoose-sex-page');

module.exports = async (req, res) => {
   // 查询所有数据，并渲染到页面上，添加集合的关联
   // const pagination = await article.find().populate('author');

   // 使用分页模块，查询数据
   let page = req.query.page;

   const pagination = await pageination(article).find().populate('author').page(page).size(2).display(5).exec();

   // res.send(pagination);
   res.render('admin/article', {
      // 侧边栏的选中状态
      currenLink: 'article',
      // 页面渲染数据
      pagination: pagination
   });
}