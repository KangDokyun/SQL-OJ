module.exports = function (app){
	app.get('/user',function(req,res){
		if(!req.session.user){
			console.log("未登录");
			res.redirect('/index');
		}
		else{
			var UID=req.session.user.UID;
			console.log("User "+UID+" Request user page");			
			var client=global.sysdb;
			var sql='select * from user where UID='+UID;
			client.query(sql,function(err,results){
				if(err){
					res.send({error:err});
					console.log('search user error--'+err.message);
				}
				console.log(results);
				var s2 = 'SELECT PID,DATE_FORMAT(SubmitDate,"%Y-%m-%d %H:%i:%S") as date,Result,UserCode from Submit where UID='+UID;
				client.query(s2,function(err,results1){
					if(err){					
						console.log('serach submit err--'+err.message);
						res.send({error:err});
					}
					else{
						var s3 = 'select * from topic where UID='+UID;
						client.query(s3, function(err, results2){
							if(err){
								console.log('serach topic err--'+err.message);
								res.send({error:err});
							}
							else client.query("select count(PID) as passCnt from submit where UID="+UID+" and result='Accept'",
								function(err,passCnt){
									if(err){
										console.log(err);
									}
									client.query("select count(PID) as sumCnt from submit where UID="+UID,
										function(err,sumCnt){
											if(err){
												console.log(err);
											}
											res.render("user",{user:results[0],submits:results1,topics:results2,isAdmin:req.session.user.isAdmin,
												passCnt:passCnt,sumCnt:sumCnt});			
										})
								})
						});
					}
				});
			});
		}
	});


	app.post('/user', function(req, res){
		var uid = req.session.user.UID;
		var client = global.sysdb;
		console.log('enter this'+uid);
		var opwd = req.body.opwd;
		var npwd = req.body.npwd;
		var sql = 'select Password from user where UID='+uid;
		console.log(opwd);
		console.log(npwd);
		console.log(uid);
		client.query(sql, function(err, result){
			if(err){
				console.log(err);
			}
			if(result[0]== undefined){
				res.send({error:"No Such User"})
			}
			else if(result[0].Password != opwd){
				res.send({error:"Password error"})
			}
			else{
				var update = 'update user set Password=? where UID=?';
				client.query(update,[npwd,uid], function(err1, result){
					if(err1){
						res.send({error:err1.message});
					}
					res.sendStatus(200);	
				});
			}
		});
	});
}