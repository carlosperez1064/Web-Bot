var express= require('express');
var timestamp= require('log-timestamp');
var app= express();//fire express, because it requires a function
var mongoose = req('mongoose');

app.set('view engine', 'ejs'); //template, /views folder
//METHODS

app.get('/mostrar-estado',function(req,res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/lista',function(req,res){
  res.send('Lista de conocimientos');
});

app.get('/learn/:skill', function(req,res){
  var date= new Date();
  var data= {skill: req.params.skill, date: date};
  res.render('learn', {data:data});// renders the view
});
app.listen(3000);//listening to port 3000
