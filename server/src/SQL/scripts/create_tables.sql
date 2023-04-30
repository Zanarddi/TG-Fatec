/*
Script for TG-Zanardi-Gleison

Creating tables
You must create the data base before running this script
*/
use TG_Zanardi_Gleison

create table tw_user(
user_id varchar (20) primary key,
screen_name varchar (20) not null,
access_token varchar (50) not null,
refresh_token varchar (45) not null)

create table app_user(
username varchar (30) primary key,
email varchar (60) unique not null,
str_password varchar (60) not null,
tw_id varchar (20) references tw_user(user_id))

create table tweet(
tweet_id varchar (20) primary key,
tw_id varchar (20) not null references tw_user(user_id),
media_url varchar (50))

create table post(
post_id INTEGER PRIMARY KEY AUTOINCREMENT,
post_description varchar not null,
media_url varchar (50),
tweet_id varchar (20),
schedule varchar,
app_user varchar (30) not null references app_user(username))

create table schedule(
id INTEGER PRIMARY KEY AUTOINCREMENT,
schedule_date varchar (30) not null,
post_id INTEGER not null references post(post_id))