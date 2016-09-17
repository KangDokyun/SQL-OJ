var mysql=require('mysql');

abortInsertProblem=function(PID){
	var client=global.sysdb;
	client.query("delete from Problem where PID="+PID);
}



insertTestpoint=function(client,PID,testpoint,i,res){
	var sql=mysql.format('insert into TestPoint(PID,TestData,StdOutput) values(?,?,?)',[PID,"'"+testpoint[i].testdata+"'","'"+testpoint[i].stdoutput+"'"]);
	client.query(sql,
		function(err1,result1){
			if(err1){
				abortInsertProblem(PID);
				console.log(err1.message);
				res.send({error:'Insert Testpoint '+i+' Failed'});
			}
			else if(testpoint[i].isSample=='true'){
				var sql2='insert into Sample values(?)';
				client.query(sql2,[result1.insertId],
					function(){
						if(i==testpoint.length-1)
							res.sendStatus(200);
						else insertTestpoint(client,PID,testpoint,i+1,res);
					});
			}
			else{
				if(i==testpoint.length-1)
					res.sendStatus(200);
				else insertTestpoint(client,PID,testpoint,i+1,res);
			}
			console.log("Testpoint "+i+" Inserted");
	});
}

module.exports=function(app){
	app.get("/addproblem",function(req,res){
		if(!req.session.use){
			console.log('Please Login First');
			res.redirect("/index");
		}
		else if(req.session.user.isAdmin=="false"){
			console.log('Not Admin');
			res.redirect('/index');
		}
		else res.render('addproblem',{title:"Add Problem"});
	})
	app.post('/addproblem',function(req,res){
		var title=req.body.title;
		var desc=req.body.desc;
		var cons=req.body.cons;
		var ans=req.body.anscode;
		var testpoint=req.body.testpoint;
		console.log("Get Add Problem Request");
		var client=global.sysdb;
		var sql0=mysql.format('insert into problem(title,detail,constructor,anscode) values(?,?,?,?)',["'"+title+"'","'"+desc+"'","'"+cons+"'","'"+ans+"'"]);
		client.query(sql0,function(err0,result){
				if(err0){
					console.log(err0);
					res.send({error:"Add Problem Failed"});
				}
				else{
					console.log("Problem Info Inserted");
					insertTestpoint(client,result.insertId,testpoint,0,res);
				} 
		})
	})
}