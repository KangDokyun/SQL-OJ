题目标题：
Employees Earning More Than Their Managers
题目描述：
The Employee table holds all employees including their managers. Every employee has an Id, and there is also a column for the manager Id.


建表用语句：
create table Employee(
	Id int primary key,
	Name varchar(20),
	Salary int,
	ManagerId int
);
标准答案：
select e1.Name as Employee from Employee e1, Employee e2 where e1.ManagerId = e2.Id and e1.Salary > e2.Salary;
测试数据

组一：
delete from Employee;
insert into Employee values(1,"Joe",70000,3);
insert into Employee values(2,"Henry",80000,4);
insert into Employee values(3,"Sam",60000,NULL);
insert into Employee values(4,"Max",90000,NULL);

组二:
delete from Employee;
insert into Employee values(1,"Luhan",70000,NULL);
insert into Employee values(2,"Lucy",80000,5);
insert into Employee values(3,"Lam",60000,NULL);
insert into Employee values(4,"Hax",90000,NULL);
insert into Employee values(5,"Kris",70000,NULL);
insert into Employee values(6,"BOBO",80000,4);

题目标题：Duplicate Emails
题目描述：
Write a SQL query to find all duplicate emails in a table named Person.

+----+---------+
| Id | Email   |
+----+---------+
| 1  | a@b.com |
| 2  | c@d.com |
| 3  | a@b.com |
+----+---------+
For example, your query should return the following for the above table:

+---------+
| Email   |
+---------+
| a@b.com |
+---------+

建表用语句：
create table Person(
	Id int primary key,
	Email varchar(30)
);

标准答案：
SELECT Email
FROM (SELECT Email, COUNT(Email) AS numOfEmail
    FROM Person
    GROUP BY Email) AS T1 
WHERE T1.numOfEmail > 1

测试数据
组一：
delete from Person;
insert into Person values(1,"a@b.com");
insert into Person values(2,"c@d.com");
insert into Person values(3,"a@b.com");

组二：
delete from Person;
insert into Person values(1,"a@b.com");
insert into Person values(2,"c@d.com");
insert into Person values(3,"e@f.com");
insert into Person values(4,"a@b.com");
insert into Person values(5,"c@d.com");
insert into Person values(6,"a@b.com");





保留编号最小邮箱

create table Emails
(
	id int(1),
	email varchar(20),
	Primary key (id)
)

delete from Emails;
insert into Emails value (1,'Aha@qq.com');
insert into Emails value (2,'lin@163.com');
insert into Emails value (3,'Aha@qq.com');

select * from Email
where id in(select Email.id
          from Emails as t
          where Email.id>t.id and Email.email=t.email);