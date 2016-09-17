module.exports=function(app){
	app.post('/deleteproblem',function(req,res){
		console.log("get delete request");
		var client=global.sysdb;
		client.query("delete from Problem where PID="+req.body.PID,
			function(err){
				if(err){
					throw err;
					res.sendStatus(404);
				}
				else{
					console.log("delete problem success!");
					res.sendStatus(200);
				}
			});
	});
}