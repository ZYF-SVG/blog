//  添加文章 表单提交路由
// 导入 formidable 模块
const formidable = require('formidable');
const path = require("path");
const { article } = require('../model/article');

module.exports = (req, res) => {
  // 创建表单解析对象
  const form = new formidable.IncomingForm();
  // 设置文件上传的路径，使用绝对路径
  form.uploadDir = path.join(__dirname, '../', 'public', 'uploads');
  // 是否保留上传文件的后缀名
  form.keepExtensions = true;
  // 对表单进行解析后，调用回调函数
  form.parse(req, (err, fields, files) => {
    // fields 普通数据；  files 上传元素的数据;  req 就是 req

    /* 文章的封面，如何在 页面上显示呢？
     "path": "H:\\node.js\\视频教程\\博客项目\\blog\\public\\uploads\\upload_d1930c92c764cac68f47b04a85fddd6c.jpg",
       如果把整个路径都存储到数据库中，那在加载图片时，只是在 本地 查找，肯定查找不到的，因为 图片是保存
       在 服务器 的内存中， 所以 我们要在 挂载的静态资源，目录中得到他，所以 要截取 存储的路径，从 public 后，
       就是我们要的 路径 。
       files.cover.path.split('public')[1]
    */ 

    // 把文字添加到 数据库中
    article.create({
      title: fields.title,
      author: fields.author,
      publishDate: fields.publishDate,
      cover:  files.cover.path.split('public')[1],
      content: fields.content
    }).then(res => console.log('添加文章成功'))
      .catch(err => console.log('添加文章失败' + err));

    // 重定向到 文章列表 页面
    res.redirect('/admin/article');
  })
}