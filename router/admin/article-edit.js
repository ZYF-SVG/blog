//  文章编辑页面
module.exports = (req, res) => {
  // 当访问 文章页面时，给模板引擎传递一个值，让样式选中 文章
  res.render('admin/article-edit', {
    currenLink: 'article'
  });
}