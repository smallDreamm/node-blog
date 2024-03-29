// 应用程序入口文件

// 加载express模块
var express=require('express');
//加载swig模块
var swig = require('swig');
//加载数据库模块
var mongoose=require('mongoose');
//加载cookies模块
var Cookies=require('cookies');
//加载body-parser，用来处理post提交过来的数据
var bodyParser=require('body-parser');
// 创建app应用
var app=express();

var User=require('./models/User');

//设置静态文件托管
app.use( '/public', express.static( __dirname + '/public') );

app.use(function (req,res,next) {
	req.cookies=new Cookies(req,res);

	//解析登录用户的cookies的用户信息
	req.userInfo={};
	if(req.cookies.get('userInfo')){
		try{
			req.userInfo=JSON.parse(req.cookies.get('userInfo'));
			//
			User.findById(req.userInfo._id).then(function (userInfo) {
				req.userInfo.isAdmin=Boolean(userInfo.isAdmin);
				next();
            })
		}catch(e){
            next();
		}
	}else{
        next();
    }
})



//配置应用模块
// 定义当前应用所用的模板引擎
// 第一个参数：模板引擎的名称，同时也是模板文件的后缀，第二个参数表示用于解析处理模板内容的方法
app.engine('html', swig.renderFile);
//设置模板文件的目录，第一个参数必须是views，第二个是路径
app.set('views','./views');
//注册所使用的模板引擎，第一个必须是view engine，第二个和app.engine的第一个参数一样
app.set('view engine','html');
//在开发过程中，需要取消模板缓存
swig.setDefaults({cache:false});

app.use(bodyParser.urlencoded({extended:true}))

/*
 * 根据不同的功能，划分模块
 * /admin， 后端
 * /api，通过ajax数据请求
 * /，前端页面展示
 * */
app.use('/admin',require('./routers/admin'));
app.use('/api',require('./routers/api'));
app.use('/',require('./routers/main'));

// 监听http请求
mongoose.connect('mongodb://localhost:27017/blog',function (err) {
	if (err) {
		console.log("数据库连接失败");
	}else{
        console.log("数据库连接成功");
        app.listen(8081);
	}
	
});

