use SQLSYS;
delete from problem;
delete from submit;
delete from testpoint;
delete from user;
delete from admin;

insert into problem(Title,detail,constructor,anscode) 
	values('"ProA"','"descA"','"create table A(cnt int primary key)"','"select * from A"');

insert into TestPoint(PID,TestData,StdOutput)
	values(1,'"delete from A;insert into A values(1);"','"[{"cnt":1}]"');

insert into Sample values(1);

insert into user(Account,Password) values('admin','123456');
insert into user(Account,Password) values('user','123456');
insert into user(Account,Password) values('userC','C');
insert into user(Account,Password) values('userD','D');

insert into admin values(1);

insert into submit(UID,PID,result,usercode) values('1','1','Accept','this can pass');
insert into submit(UID,PID,result,usercode) values('1','2','WrongAns','this can not pass');
insert into submit(UID,PID,result,usercode) values('1','3','Accept','this can also pass');