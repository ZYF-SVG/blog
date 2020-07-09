// 评论集合
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  aid: {   // 文章的id，区分评论的文章
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Article'
  },
  uid: {  // 评论用户的id
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  item: { // 评论日期
    type: Date
  },
  content: {  // 评论内容
    type: String,
    require: true
  }
})

const comment = mongoose.model('Comment', commentSchema);

module.exports = {
  comment
}