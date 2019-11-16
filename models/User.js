var mongoose = require('mongoose');
var usersSchema = require('../schemas/users');

//第一个参数数据库名，第二个定义的schema名
module.exports = mongoose.model('User', usersSchema);