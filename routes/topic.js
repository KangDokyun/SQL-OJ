module.exports=function(app){
	app.get('/topic:pid',function(req,res){
		if(!req.session.user){
			console.log("未登录");
			req.session.error="请先登录";
			res.redirect('/index');
		}
		else{
			var UID=req.session.user.UID;
			console.log("User "+UID+" Request topic page");
			console.log("Problem :"+PID);
			var PID=req.params.pid;
			var client=global.sysdb;
			var sql='select user.account,topic.title,topic.create_time,topic.topic_id,topic.PID  from topic, user, problem where topic.UID = user.uid and topic.pid=problem.pid and topic.pid='+PID;
			client.query(sql,function(err,results){
				if(err){
					throw err;
					console.log('select error--'+err.message);
				}
				console.log(results);
				if(results[0] === undefined){
					//console.log(results[0].create_time.toLocaleString());
					res.render("topic",{Topics:[],isAdmin:req.session.user.isAdmin,pid:PID});
				}else{
					res.render("topic",{Topics:results,isAdmin:req.session.user.isAdmin,pid:PID});
				}

			});
		}
	});

	app.post('/topic:pid', function (req, res) {
		var UID = req.session.user.UID;
		var PID = req.params.pid;
		var title = req.body.title;
		var content = req.body.content;
		var date = new Date();
		var day =date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + 
              date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
		var info=[UID,PID,title,content,day];
		console.log("User "+UID+" post data: title: "+title+" content: "+content);
		var sql = 'insert into topic(UID,PID,title,content,create_time) values(?,?,?,?,?)';

		var client=global.sysdb;
        client.query(sql,info, function(err,result){
			if(err){
				res.send({error:err.message});
			}
			console.log(result);
			res.send(200);
		});
    });

	app.post("/deleteTopic:id", function(req, res) {
        //req.params.id 获取ID号
		var topic_id = req.params.id;
		var sql = 'delete from topic where topic_id='+topic_id;
		var client = global.sysdb;
        client.query(sql,function(err,doc){
            //成功返回1  失败返回0
			if(err){
				console.log('delete err'+err.message);
				res.send({error:err.message});
			}
			if(doc){
				console.log(doc);
				res.sendStatus(200);
			}
        });
    });

}