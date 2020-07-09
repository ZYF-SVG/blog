// 文章详情路由处理函数
// 导入文章集合
const { article } = require('../../model/article');
const { comment } = require('../../model/comment');

module.exports = async (req, res) => {
  const id = req.query.id;
  // 查询文章详情信息
  const articlea = await article.findOne({_id: id}).populate('author');

  // 根据文章的 id 去查找这个文章的评论信息，uid 关联 用户集合
  const comments = await comment.find({aid: id}).populate('uid');

  res.render('home/article', {
    articlea: articlea,
    comments: comments
  });

}