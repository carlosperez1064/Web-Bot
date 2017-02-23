var express = require('express');
var app = express(); //exports a method
var MongoClient = require('mongodb').MongoClient;
var url= 'mongodb://localhost:27017/web-bot';

app.get('/learn/:user/:skill',function(req, res){
  var date= new Date();
  var data= {user:req.params.user, skill: req.params.skill, date:date, action:"INSERT"};
  insertToDb(data);
  res.send(data);
  console.log(data);
});

function insertToDb(doc){
MongoClient.connect(url, function(err, db) {
  if(err) throw err;
  else console.log("We are connected");

  db.collection('bot', function(err, collection) {
  if (!err){
    console.log("All good");
  }
  db.collection('ram', function(err, collection) {
  if (!err){
    console.log("All good");
  }
});
db.collection('bot').insert(doc, function(err, records) {
		if (err) throw err;
    else console.log("Insertion saved to bot db");
	});
  var skill= doc.skill;
db.collection('ram').insert({ramDoc}, function(err, records) {
		if (err) throw err;
    else console.log("Insertion saved to ram db");
	});
});
});
};

app.get('/remove/:user/:skill',function(req, res){
  var date= new Date();
  var data= {user:req.params.user, skill: req.params.skill, date:date, action:"REMOVE"};
  remove(data);
  res.send(data);
  console.log(data);
});

function remove(doc){
  MongoClient.connect(url, function(err, db) {
    if(err) throw err;
    else console.log("We are connected");

    db.collection('bot').insert(doc, function(err, records) {
    		if (err) throw err;
        else console.log("Removal saved to bot db");
    	});
    db.collection('ram').remove({"skill":doc.skill}, function(err, removes){
      if (err) throw err;
      else console.log("Skill removed from ram db");
    });
});
};

app.get('/show/status/:user',function(req, res){

  MongoClient.connect(url, function(err, db) {
    if(err) throw err;
    db.collection('bot', function(err, collection) {
      collection.find().toArray(function(err, result) {
        res.send(result);
        console.log("The status list has been checked");
      });
    });
    var date= new Date();
    var data= {user:req.params.user, date:date, action:"SHOW STATUS"};
    db.collection('bot').insert(data, function(err, records) {
        if (err) throw err;
        else console.log("Status check saved to bot db");
      });
  });
});

app.get('/show/skills/:user',function(req, res){
  MongoClient.connect(url, function(err, db) {
    if(err) throw err;
    db.collection('ram', function(err, collection) {
      collection.find().toArray(function(err, result) {
        res.send(result);
        console.log("The skill list has been cheked");
      });
    });
    var date= new Date();
    var data= {user:req.params.user, date:date, action:"SHOW SKILLS"};
    db.collection('bot').insert(data, function(err, records) {
        if (err) throw err;
        else console.log("Skill list check saved to bot db");
      });
  });
});
app.listen(3000);
