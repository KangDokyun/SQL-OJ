module.exports=function(app){
	app.post('/checkgrammer',function(req,res){
		console.log("Get Admin's Constructor");
		console.log(req.body.cons);
		console.log("Get Admin's Anscode");
		console.log(req.body.ans);
		var client=global.sysdb;
		var UID=req.session.user.UID;
		client.query('drop database if exists test'+UID);
		client.query('create database test'+UID);
		client.query('use test'+UID);
		client.query(req.body.cons,function(err,result){
			if(err){
				res.send({error:"Constructor Grammer Error!"});
			}
			else{
				console.log("Constructor Success!");
				client.query(req.body.ans,function(err2,result2){
					if(err2){
						res.send({error:"AnsCode Grammer Error!"});
					}
					else res.sendStatus(200);
					client.query('drop database if exists test'+UID);
					client.query('use sqlsys');
				})
			}
		})
	})
}