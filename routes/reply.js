module.exports = function(app){
	app.get("/reply:tid",function(req, res){
		if(!req.session.user){
			req.session.error="未登录";
			res.redirect('/index');
		}
		else{
			var UID=req.session.user.UID;
			var tid = req.params.tid;
			console.log("User "+UID+" Request topic page");
			var client=global.sysdb;
			var sql='select user.account,topic.title,topic.content,topic.create_time,topic.PID from topic, user where topic.topic_ID = '+tid+' and topic.UID=user.uID';
			client.query(sql,function(err,results){
				if(err){
					console.log('search error--'+err.message);
				}
				console.log(results[0]);
				var search = 'select account,content,create_time,reply_id from reply,user where topic_ID='+tid+' and  reply.UID=user.UID';
				client.query(search,function(err,results1){
					if(err){
						console.log('search error-'+err.message);
					}
					res.render('reply',{replys:results1,topic:results[0],id:tid,isAdmin:req.session.user.isAdmin});
				});				
			});
		}
	});

	app.post('/reply:tid',function(req, res){
		var tid = req.params.tid;
		var content = req.body.content;
		var UID = req.session.user.UID;
		var client=global.sysdb;
		var date = new Date();
		var day =date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + 
              date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) ;
		var sql = 'insert into reply(topic_ID,UID,content,create_time) values(?,?,?,?)';
		var info = [tid,UID,content, day];
		client.query(sql,info, function(err,result){
			if(err){
				res.send({error:err.message});
			}
			console.log(result);
			res.send(200);
		});
	});

	app.post("/deleteReply:id", function(req, res) {
		var id = req.params.id;
		var sql = 'delete from reply where reply_id='+id;
		var client = global.sysdb;
        client.query(sql,function(err,doc){
			if(err){
				res.send({error:err.message});
			}
			if(doc){
				res.send(200);
			}
        });
    });
}
