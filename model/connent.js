//  创建数据库的
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/blog', { useNewUrlParser: true,  useUnifiedTopology: true, useCreateIndex: true})
        .then(() => console.log('数据库连接成功'))
        .catch(err => console.log('数据库连接失败' + err));