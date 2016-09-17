module.exports=function(app){
	app.get('/', function(req, res, next) {
  		res.render('index', {user:req.session.user });
	});
	app.get('/index', function(req, res, next) {
  		res.render('index', {user:req.session.user });
	});
	require('./login')(app);
	require('./register')(app);
	require('./problemlist')(app);
	require('./problem')(app);
	require('./logout')(app);
	require('./deleteproblem')(app);
	require('./addproblem')(app);
	require('./checkgrammer')(app);
	require('./checktestpoint')(app);
	require('./topic')(app);
	require('./reply')(app);
	require('./user')(app);
}
