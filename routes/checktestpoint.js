module.exports=function(app){
	app.post("/checktestpoint",function(req,res){
		var UID=req.session.user.UID;
		var cons=req.body.cons;
		var ans=req.body.anscode;
		var testdata=req.body.testdata;
		var client=global.sysdb;
		console.log("TestData :"+testdata);
		client.query('drop database if exists test'+UID);
		client.query('create database test'+UID);
		client.query('use test'+UID);
		client.query(cons);
		client.query(testdata,function(err0){
			if(err0){
				console.log(err0);
				res.send({error:"TestData Grammer Error"});
			}
			else{
				client.query(ans,function(err1,result){
					if(err1){
						console.log(err1);
						res.send({error:"Query Error"});
					}
					else{
						console.log("Result :"+result);
						res.send({result:JSON.stringify(result)});
					}
					client.query("drop database if exists test"+UID);
					client.query("use sqlsys");
				})
			}
		})	
	})
}