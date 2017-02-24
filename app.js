/*Nombre: R2D2
ID: NDAyMjMwNjg5 http://www.url-encode-decode.com/base64-encode-decode/?_ga=1.119663560.1309185146.1487959216
Hecho por: Carlos Pérez Rodríguez.
Fecha de creación: 23.02.2017
*/
var express = require('express');
var app = express(); //exports a method
var MongoClient = require('mongodb').MongoClient;
var url= 'mongodb://localhost:27017/web-bot';

app.get('/r2d2', function(req, res){
  res.sendFile('C:/Users/Carlos/.atom/Web-Bot/index.html');
});

app.post('/learn/:user/:skill',function(req, res){
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
db.collection('ram').insert({skill}, function(err, records) {
		if (err) throw err;
    else console.log("Insertion saved to ram db");
	});
});
});
};

app.delete('/remove/:user/:skill',function(req, res){
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
app.get('/api/googlemaps/:place/:user', function(req,res){
  res.redirect('http://maps.googleapis.com/maps/api/geocode/json?address='+req.params.place);
  MongoClient.connect(url, function(err, db) {
    if(err) throw err;
    var date= new Date();
    var data= {user:req.params.user, date:date, action:"GOOGLEMAPS"};
    db.collection('bot').insert(data, function(err, records) {
        if (err) throw err;
        else console.log(req.params.user + " just used the Googlemaps api");
      });
    });
});
app.get('/api/translator/es/en/:string/:user', function(req,res){
  res.redirect('https://translate.google.com/?hl=es/en/#es/en/'+ req.params.string);
  MongoClient.connect(url, function(err, db) {
    if(err) throw err;
    var date= new Date();
    var data= {user:req.params.user, date:date, action:"TRANSLATOR"};
    db.collection('bot').insert(data, function(err, records) {
        if (err) throw err;
        else console.log(req.params.user + " just used the translation api");
      });
    });
});

app.get('/api/spotify/search/:track/:user', function(req,res){
  res.redirect('https://developer.spotify.com/web-api/console/get-search-item/?q='+ req.params.track+ '&type=track#complete');
  MongoClient.connect(url, function(err, db) {
    if(err) throw err;
    var date= new Date();
    var data= {user:req.params.user, date:date, action:"SPOTIFY"};
    db.collection('bot').insert(data, function(err, records) {
        if (err) throw err;
        else console.log(req.params.user + " just used the Spotify api");
      });
    });
});

app.get('/api/ulacit/plan/:user', function(req,res){
  res.redirect('http://www.ulacit.ac.cr/files/planestudio/pg300_033.pdf');
  MongoClient.connect(url, function(err, db) {
    if(err) throw err;
    var date= new Date();
    var data= {user:req.params.user, date:date, action:"ULACIT"};
    db.collection('bot').insert(data, function(err, records) {
        if (err) throw err;
        else console.log(req.params.user + " just used the Ulacit api");
      });
    });
});
app.listen(3000);
