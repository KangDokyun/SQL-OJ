module.exports=function(app){
	app.post('/register',function(req,res){
		var client=global.sysdb;
		var uname=req.body.uname;
		var upwd=req.body.upwd;
		console.log('Register Page For User: '+uname+" Password: "+upwd);
		client.query('select * from User where Account="'+uname+'"',
			function(err,result){
				if(err){
					res.sendStatus(500);
					console.log(err);
				}
				if(result.length==1){
					res.sendStatus(500);
					req.session.error='用户名已存在！';
				}
				else{
					client.query('insert into User(Account,Password) values("'+uname+'","'+upwd+'")',
						function(err1,insert){
							if(err1){
								res.sendStatus(500);
								console.log(err1);
							}
							else{
								var uz={
									UID:insert.insertId,
									Account:uname,
									Password:upwd,
									isAdmin:false
								};
								req.session.user=uz;
								res.send(200);
							}
						});
				}
			});
	});
}