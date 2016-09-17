module.exports=function(app){
	app.post('/login',function(req,res){
		var client=global.sysdb;
		var uname=req.body.uname;
		var upwd=req.body.upwd;
		console.log('Login For User: '+uname+" Password: "+upwd);
		client.query('select * from User where Account="'+uname+'"',
			function(err,result){
				if(err){
					res.send(500);
					console.log(err);
				}
				else if(result.length==0){
					console.log('用户名不存在');
					req.session.error='用户名不存';
					res.sendStatus(404);
				}
				else{
					if(upwd != result[0].Password){
						console.log('密码错误');
						req.session.error="密码错误";
						res.sendStatus(404);
					}
					else{
						console.log('登录成功');
						client.query("select * from Admin where UID="+result[0].UID,
							function(err2,isAdmin){
								var uz={
									UID:result[0].UID,
									Account:result[0].Account,
									Password:result[0].Password
								};
								if(isAdmin.length>0){
									uz.isAdmin=true;
									console.log("User "+uz.UID+" is Admin");
								}
								else{ 
									uz.isAdmin=false;
									console.log("User "+uz.UID+" is not Admin");
								}
								req.session.user=uz;
								res.send(200);
							})
					}
				}
			})
	});
}