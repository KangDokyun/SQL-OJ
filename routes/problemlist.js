module.exports=function(app){
	app.get('/problemlist',function(req,res){
		if(!req.session.user){
			console.log("Unlogin");
			res.redirect('/index');
			res.send({error:"Login First"});
		}
		else{
			var UID=req.session.user.UID;
			console.log("User "+UID+" Request ProblemList");
			var client=global.sysdb;
			client.query('select count(SID) as Cnt,problem.PID,Title'+
			' from Problem left join'+
			' (select * from submit where result="Accept" and UID='+UID+') as s'+
			' on problem.PID=s.PID'+
			' group by problem.PID,Title',
			function returnResult(err,results){
				if(err){
					throw err;
				}
				var info={
					title:'Problem-List',
					problemlist:results,
					isAdmin:req.session.user.isAdmin
				}
				res.render("problemlist",info);
			});
		}
	});
}