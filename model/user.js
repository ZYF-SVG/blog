// 创建用户集合
const mongoose = require('mongoose');
// 验证
const joi = require('joi');

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
}

/* 
  因为在 app.js 中有导入了 body-parser 模块，所以可以使用 req.body 获取数据
一般是这样的：
  表单的验证，前端页面要进行一次验证；
  然后，后端再导入数据库前，也要进行一次验证； 使用 joi，不用我们一个一个去获取数据，
  然后在编写验证的方法逻辑，使用 joi 内部定义好的一些验证方法，比较方便。
*/
// 添加用户的验证
const validateUser = (user) => {
  schema = {
    username: joi.string().min(2).max(10).required().error(new Error('提示：用户名最少2位，最多10位，为必填项')),
    password: joi.string().required().regex(/^[a-zA-Z0-9]{6,15}$/).error(new Error('提示：密码不能包括提示符号，最短为6位，最长为15位，为必填项')),
    email: joi.string().email().error(new Error('提示：邮箱非法')),
    role: joi.string().valid('normal', 'admin').required().error(new Error('提示：角色值只能为普通用户 和 超级用户')),
    state: joi.string().valid('0', '1').required().error(new Error('提示： 用户的状态只能为 启用 和 禁用'))
  }
  return joi.validate(user, schema);
  
}

module.exports = {
  user,
  validateUser
}