// 创建用户集合
const mongoose = require('mongoose');

// 创建集合规则
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 15
  },
  email: {
    type: String,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {   // 角色
    type: String,
    required: true
  },
  state: {  // 状态
    type: Number,
    default: 0   // 0 启动， 1 禁用
  }
})

// 创建集合
const user = mongoose.model('User', userSchema);

// 导入 bcrypt 模块
async function createUser() {
  const bcrypt = require('bcryptjs');
  // 生成随机数 salt 盐, 返回 Promise { <pending> } 对象
  let salt = await bcrypt.genSalt(10);
  let pass = await bcrypt.hash('123', salt);
  /*
  user.create({
    username: '暗部成员',
    email: 'anbu@zr.com',
    password: pass,
    role: 'ordinary',
    state: 0
  }).then(res => console.log(res))
    .catch(err => console.log(err));
  /*************/
}
// createUser();

module.exports = {
  user
}