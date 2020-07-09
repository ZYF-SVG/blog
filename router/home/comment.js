// 文章评论路由
// 导入评论集合
const { comment } = require('../../model/comment');

module.exports = async (req, res) => {
  const { content, uid, aid } = req.body;

  // 插入数据
  await comment.create({
    aid: aid,
    uid: uid,
    item: new Date(),
    content: content
  });
  res.redirect('/home/article?id='+ aid);
}