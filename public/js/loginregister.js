$("#login-btn").bind("click",function(){
	var uname=$("#uname1").val();
	var upwd=$("#upwd1").val();
	var data={
		"uname":uname,
		"upwd":upwd
	};
	$.ajax({
		url:"/login",
		type:"POST",
		data:data,
		success: function(){
			$("#myModal1").modal("hide");
			location.reload();
		},
		error: function(){
			$("#login-result").text("错误的用户名或密码");
		}
	})
})

$("#register-btn").bind("click",function(){
	var uname=$("#uname2").val();
	var upwd=$("#upwd2").val();
	var confirm=$("#upwd3").val();
	if(upwd!=confirm){
		$("#register-result").text("Please Confirm Your Password Again");
	}
	else{
		var data={
			"uname":uname,
			"upwd":upwd
		};
		$.ajax({
			url:"/register",
			type:"POST",
			data:data,
			success: function(){
				$("#myModal2").modal("hide");
				location.reload();
			},
			error: function(){
				$("#register-result").text("用户名已存在");
			}
		})
	}
})