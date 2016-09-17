JudgeTest=function(client,tests,i,UserCode,callback){
	console.log("TestData: "+tests[i].TestData);
	client.query(tests[i].TestData.slice(1,-1));
	client.query(UserCode,
		function matchResults(err3,UserOutput){
			if(err3){
				callback('GrammerError');
				return;
			}
			else{
				var str=JSON.stringify(UserOutput);
				console.log("UserOutput: "+str);
				console.log("StdOutput: "+tests[i].StdOutput.slice(1,-1));
				if(str!=tests[i].StdOutput.slice(1,-1)){
					callback('WrongAns');
					return;
				}
				else if(str==tests[i].StdOutput.slice(1,-1)){
					if(i==tests.length-1){
						callback('Accept');
						return;
					}
					else JudgeTest(client,tests,i+1,UserCode,callback)
				}
			}
		});
}

JudgeSubmit=function(UID,PID,UserCode,callback){
	var client=global.sysdb;
	client.query('select * from Problem where PID='+PID,
		function getProblemInfo(err1,problemInfo){
		var Constructor=problemInfo[0].Constructor;
		client.query('select * from TestPoint where PID='+PID,
			function getTestPoint(err2,tests){
				client.query('drop database if exists submit'+UID);
				client.query('create database if not exists submit'+UID);
				client.query('use submit'+UID);
				client.query(Constructor.slice(1,-1));
				console.log("Test TestPoint start");
				JudgeTest(client,tests,0,UserCode,callback);
		});
	});
}

module.exports=function(app){
	app.get('/problem:PID',function(req,res){
		console.log('Request Problem '+req.params.PID);
		var client=global.sysdb;
		client.query('select * from Problem where PID='+req.params.PID,
			function(err,result){
				if(err){
					throw err;
				}
				client.query('select * from Sample natural join TestPoint where PID='+req.params.PID,
					function(err2,result1){
						if(err2){
							throw err2;
						}
						console.log(result1);
						res.render("problem",{
						title:"Problem",
						problem:result[0],
						sample:result1
						});
				});
			});
	});
	app.post('/problem:PID',function(req,res){
		console.log("Post Request!");
		var UID=req.session.user.UID;
		var PID=req.params.PID;
		var UserCode=req.body.usercode;
		console.log('User '+UID+' submit Problem'+PID+' : '+UserCode);
		JudgeSubmit(UID,PID,UserCode,function(result){
			sysdb.query('drop database if exists submit'+UID);
			sysdb.query("use sqlsys");
			sysdb.query('insert into Submit(UID,PID,UserCode,Result)' +
				' values('+UID+','+PID+',"'+UserCode+'","'+result+'")');
			console.log('User '+UID+' submit '+PID+' '+result);
			res.send({result:result});
		});
	});
}