// 文章集合
const mongoose = require('mongoose');

// 创建文章集合规则
const sticleSchema = new mongoose.Schema({
    title: {    // 文章标题
      type: String,
      maxlength: 20,
      minlength: 2,
      required: [true, '文章标题必填']
    },
    author: {    // 文章的作者 关联 user 的 用户 id
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',  // 这个为什么改成 大写的就可以呢，我创建的明明是小写的，因为在 user.js 中，你创建的集合是大写的啊
      required: true
    },
    publishDate: {  // 创建日期
      type: Date,
      default: Date.now
    },
    cover: {  // 上传文件
      type: String,
      default: null
    },
    content: {    // 文章内容
      type: String
    }
})

const article = mongoose.model('Article', sticleSchema);

module.exports = {
  article
}