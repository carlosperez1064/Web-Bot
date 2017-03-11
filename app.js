/*Nombre: R2D2
ID: NDAyMjMwNjg5 http://www.url-encode-decode.com/base64-encode-decode/?_ga=1.119663560.1309185146.1487959216
Hecho por: Carlos Pérez Rodríguez.
Fecha de creación: 23.02.2017
*/
var express = require('express'); //Contiene funciones que permiten hacer uso de recursos web muy útiles y flexibles.
var app = express(); //Retorna métodos, por lo tanto hay que asignarlo a una variable para que las funciones puedan ser invocadas.
var MongoClient = require('mongodb').MongoClient;//Se importa el servicio de base de datos de MongoDB.
var url= 'mongodb://localhost:27017/web-bot';//Se asigna el url de ls BD a una variable para que el código se vea mejor.
app.use(express.bodyParser());//Utilizado para tener acceso a los datos que conforman al objeto JSON en los requests hechos por el cliente.

//Esta función es la presentación del Web-Bot cuyo nombre es R2D2.
app.get('/r2d2', function(req, res){
  res.sendFile('C:/Users/Carlos/.atom/Web-Bot/index.html');
});

//Con esta ruta, el cliente podrá enseñarle al Web-Bot habilidades básicas.
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

  db.collection('bot', function(err, collection) {//Se asegura de que haya conexión con la colección llamada 'bot'
  if (!err){
    console.log("All good");
  }
  db.collection('ram', function(err, collection) {//Y de que hay también contacto con la colección 'ram'
  if (!err){
    console.log("All good");
  }
});
//E inserta en el la colección 'bot' el registro de actividad y en 'ram' la habilidad aprendida una vez que la conexión con la bd y las colecciones está activa.
db.collection('bot').insert(doc, function(err, records) {
		if (err) throw err;
    else console.log("Insertion saved to bot db");
	});
db.collection('ram').insert({skill:doc.skill, parameters:doc.parameters}, function(err, records) {
		if (err) throw err;
    else console.log("Insertion saved to ram db");
	});
});
});
};
//El siguiente método es el encargado de hacer que el bot aprenda funciones interesantes como consulta de APIs o que aprenda a traducir en/a cualquier idioma.
app.post('/learn/api',function(req, res){
  var date= new Date();
  var items= req.body;//Se le asigna a una variable local la información incluida en el request a fin de poder utilizar dicha información de una mejor manera.
  var data= {user:items.user, date:date, skill:items.skill, parameters:items.parameters, action:"INSERT"};
  insertSkillToDb(data);//Se insertan en la base de datos.
  console.log(data);
  res.send(data);
});
//Y este método se encarga de ejecutar las funciones aprendidas.
app.get('/exe/api/:skill/:x', function(req,res){
  MongoClient.connect(url, function(err, db) {
    if(err) throw err;
    db.collection('ram', function(err, collection) {
      collection.find({"skill":req.params.skill}).toArray(function(err, result) {
        var parameters=(result[0].parameters);
        var redirect= "";
        for (var i in parameters) {
          if (parameters[i] == 'x')
            redirect+=req.params.x;
          else
            redirect+=parameters[i];
      }
      res.redirect(redirect);
    });
  });
});
});

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

app.listen(3000);
