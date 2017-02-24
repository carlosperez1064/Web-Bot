/*Nombre: R2D2
ID: NDAyMjMwNjg5 http://www.url-encode-decode.com/base64-encode-decode/?_ga=1.119663560.1309185146.1487959216
Hecho por: Carlos Pérez Rodríguez.
Fecha de creación: 23.02.2017
*/
var express = require('express'); //Contiene funciones que permiten hacer uso de recursos web muy útiles y flexibles.
var app = express(); //Retorna métodos, por lo tanto hay que asignarlo a una variable para que las funciones puedan ser invocadas.
var MongoClient = require('mongodb').MongoClient;//Se importa el servicio de base de datos de MongoDB.
var url= 'mongodb://localhost:27017/web-bot';//Se asigna el url de ls BD a una variable para que el código se vea mejor.

//Esta función es la presentación del Web-Bot cuyo nombre es R2D2.
app.get('/r2d2', function(req, res){
  res.sendFile('C:/Users/Carlos/.atom/Web-Bot/index.html');
});

//Con esta ruta, el cliente podrá enseñarle al Web-Bot habilidades.
app.post('/learn/:user/:skill',function(req, res){
  var date= new Date();
  var data= {user:req.params.user, skill: req.params.skill, date:date, action:"INSERT"};
  insertSkillToDb(data); //Llama al método que se encarga de insertar en la base de datos
  res.send(data);
  console.log(data);
});

function insertSkillToDb(doc){
MongoClient.connect(url, function(err, db) { //Se asegura de que haya una conexión con la base de datos y las colecciones a utilizar (bot y ram).
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
//E inserta en el la colección 'bot' el registro de actividad y en 'ram' la habilidad aprendida una vez que la conexión con la bd y las colecciones tá activa.
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
//Este método permite eliminar habilidades (desaprender) de la base de datos 'ram'.
app.delete('/remove/:user/:skill',function(req, res){
  var date= new Date();
  var data= {user:req.params.user, skill: req.params.skill, date:date, action:"REMOVE"};
  remove(data);//Invoca al método que se encarga de efectuar la eliminación de hecho.
  res.send(data);
  console.log(data);
});

function remove(doc){
  MongoClient.connect(url, function(err, db) {//Revisa que haya conexión con la bd y las colecciones.
    if(err) throw err;
    else console.log("We are connected");

    db.collection('bot').insert(doc, function(err, records) {
    		if (err) throw err;
        else console.log("Removal saved to bot db");
    	});
    db.collection('ram').remove({"skill":doc.skill}, function(err, removes){//Y por último, elimina la habilidad.
      if (err) throw err;
      else console.log("Skill removed from ram db");
    });
});
};

app.get('/show/status/:user',function(req, res){//Este método muestra el estado, o lista de entradas y acciones que el cliente ha realizado,
  MongoClient.connect(url, function(err, db) {//sea ingresar habilidades, eliminarlas, chequeado la lista de habilidades o el estado o ejecutado alguna de éstas.
    if(err) throw err;
    db.collection('bot', function(err, collection) {
      collection.find().toArray(function(err, result) {//Primero recorre todos los registros y los incluye en un arreglo
        res.send(result);//Y por último envía el resultado al cliente,
        console.log("The status list has been checked");
      });
    });
    var date= new Date();
    var data= {user:req.params.user, date:date, action:"SHOW STATUS"};
    db.collection('bot').insert(data, function(err, records) {//Por último, guarda en la bd la acción de chequeo de registro.
        if (err) throw err;
        else console.log("Status check saved to bot db");
      });
  });
});

app.get('/show/skills/:user',function(req, res){//Muestra el registro de todas las habilidades que tiene R2D2.
  MongoClient.connect(url, function(err, db) {
    if(err) throw err;
    db.collection('ram', function(err, collection) {
      collection.find().toArray(function(err, result) {//Recorre la colección e incluye todos los resultados en un Array.
        res.send(result);//Y por último se los envía al cliente.
        console.log("The skill list has been cheked");
      });
    });
    var date= new Date();
    var data= {user:req.params.user, date:date, action:"SHOW SKILLS"};
    db.collection('bot').insert(data, function(err, records) {//Naturalmente, registra la actividad en la bd dedicada a los registros de actividad.
        if (err) throw err;
        else console.log("Skill list check saved to bot db");
      });
  });
});

//Los métodos que se encuentran a partir de este punto son conocimientos que tiene el web-bot per sé, es decir, vienen incluidos con el servicio. Más abajo las explica.
app.get('/api/googlemaps/:user/:place', function(req,res){
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
//Traduce de español a inglés.
app.get('/api/translator/:user/:string/', function(req,res){
  res.redirect('https://translate.google.com/?hl=es/en/#es/en/'+ req.params.string);//Redirecciona al cliente a al sitio web de google.
  MongoClient.connect(url, function(err, db) {
    if(err) throw err;
    var date= new Date();
    var data= {user:req.params.user, date:date, action:"TRANSLATOR"};
    db.collection('bot').insert(data, function(err, records) {//Guarda el registro de actividad.
        if (err) throw err;
        else console.log(req.params.user + " just used the translation api");
      });
    });
});
//Busca canciones en spotify.
app.get('/api/spotify/:user/:track', function(req,res){
  res.redirect('https://developer.spotify.com/web-api/console/get-search-item/?q='+ req.params.track+ '&type=track#complete');//Redirecciona al cliente al api de spotify
  MongoClient.connect(url, function(err, db) {
    if(err) throw err;
    var date= new Date();
    var data= {user:req.params.user, date:date, action:"SPOTIFY"};
    db.collection('bot').insert(data, function(err, records) {//Guarda el registro de actividad.
        if (err) throw err;
        else console.log(req.params.user + " just used the Spotify api");
      });
    });
});
//Devuelve el plan de estudios de Ingeniería Informática de la ULACIT.
app.get('/api/ulacit/:user', function(req,res){
  res.redirect('http://www.ulacit.ac.cr/files/planestudio/pg300_033.pdf');//Redirecciona y devuelve el .pdf.
  MongoClient.connect(url, function(err, db) {
    if(err) throw err;
    var date= new Date();
    var data= {user:req.params.user, date:date, action:"ULACIT"};//Y guarda el registro de actividad.
    db.collection('bot').insert(data, function(err, records) {
        if (err) throw err;
        else console.log(req.params.user + " just used the Ulacit api");
      });
    });
});
//Busca videos en Youtube.
app.get('/api/youtube/:user/:search', function(req,res){
  res.redirect('https://www.youtube.com/results?search_query=' + req.params.search);//Redirecciona al cliente a los resultados de la búsqueda.
  MongoClient.connect(url, function(err, db) {
    if(err) throw err;
    var date= new Date();
    var data= {user:req.params.user, date:date, action:"YOUTUBE"};
    db.collection('bot').insert(data, function(err, records) {//Guarda el registro de actividad.
        if (err) throw err;
        else console.log(req.params.user + " just used the Youtube api");
      });
    });
});

app.listen(3000);
