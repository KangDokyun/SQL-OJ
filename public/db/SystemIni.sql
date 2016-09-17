drop database if exists SQLSYS;
create database if not exists SQLSYS;
use SQLSYS;
create table User(
	UID int primary key auto_increment,
    Account varchar(12) unique,
    Password varchar(12)
);
create table Admin(
	UID int primary key
);
create table Problem(
	PID int primary key auto_increment,
	Title text,
	Detail text,
	Constructor text,
	AnsCode text
);
create table TestPoint(
	TID int primary key auto_increment,
    PID int,
    TestData text,
    StdOutput text,
    foreign key (PID) references Problem(PID) on delete cascade
);
create table Sample(
	TID int primary key
);
create table Submit(
	SID int primary key auto_increment,
    UID int,
    PID int,
    SubmitDate timestamp NOT NULL default current_timestamp,
    UserCode text,
    Result varchar(15),
    foreign key (UID) references User(UID) on delete cascade,
    foreign key (PID) references Problem(PID) on delete cascade
);

create table topic(
	topic_ID int primary key auto_increment,
	UID int,
	PID int,
	title text default null,
	content text default null,
	create_time text,
	foreign key(UID) references User(UID) on delete cascade,
	foreign key(PID) references Problem(PID) on delete cascade
);

create table reply(
	reply_ID int primary key auto_increment,
	topic_ID int,
	UID int,
	content text default null,
	create_time text,
	foreign key(topic_ID) references topic(topic_ID) on delete cascade,
	foreign key(UID) references user(uid) on delete cascade
);

insert into User(Account,Password) values("admin","123456");
insert into Admin values(1);
