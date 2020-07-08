//  创建数据库的
const mongoose = require('mongoose');
// 导入 font 模块，判断当前的环境，获取不同的数据账号信息
const config = require('config');

mongoose.connect(`mongodb://${config.get('db.user')}:${config.get('db.pwd')}@${config.get('db.host')}/${config.get('db.name')}`, { useNewUrlParser: true,  useUnifiedTopology: true, useCreateIndex: true})
        .then(() => console.log('数据库连接成功'))
        .catch(err => console.log('数据库连接失败' + err));