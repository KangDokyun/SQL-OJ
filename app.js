var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');


//Create Global DB Connection
console.log("Connecting Mysql...");
var mysql=require('mysql');
global.sysdb=mysql.createConnection({
    host:'127.0.0.1',//Set Host
    user:'root',//Set Account
    password:'',//Set Password
    multipleStatements:true
});
sysdb.connect(function(err){
  if(err){
    console.log(err);
    throw err;
  }
  else{
    console.log("Mysql Connect Success!");
  }
});
//load system file
var rf=require("fs");  
var data=rf.readFileSync("public/db/SystemIni.sql","utf-8");
sysdb.query('SELECT * FROM information_schema.SCHEMATA where SCHEMA_NAME="sqlsys"',
  function(err,result){
    if(result.length==0){
      console.log("System Initializing...");
      sysdb.query(data,function(err1){
        if(err1){
          console.log(err1.message);
          throw err1;
        }
        else{
          sysdb.query("use sqlsys");
          console.log("System Initialize Success");
          console.log("Admin's Account: admin  Password: 123456");
          console.log("System Runing");
        }
      });
    }
     else{
      sysdb.query("use sqlsys");
      console.log("System Runing");
    }
  });  


var app = express();

//session
app.use(session({ 
    secret: 'secret',
    cookie:{ 
        maxAge: 1000*60*30//30min
    },
    resave: false,
    saveUninitialized: true,
    user:{
      UID:null,
      Acount:null,
      Password:null
    }
}));

app.use(function(req,res,next){ 
    res.locals.user = req.session.user;   // 从session 获取 user对象
    var err = req.session.error;   //获取错误信息
    delete req.session.error;
    res.locals.message = "";   // 展示的信息 message
    if(err){ 
        res.locals.message = '<div class="alert alert-danger" style="margin-bottom:20px;color:red;">'+err+'</div>';
    }
    next();  //中间件传递
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine("html",require("ejs").__express);
app.set('view engine', 'html');


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



require('./routes')(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
