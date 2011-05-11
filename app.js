
/**
 * Module dependencies.
 */

var express = require('express');
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/test');
var models = require('./models/models.js');
var Wishes = db.model('Wish');
var Token = db.model('Token');
var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'your secret here' }));
  app.use(express.compiler({ src: __dirname + '/public', enable: ['sass'] }));
  app.use(express.favicon(__dirname + '/public/favicon.ico'));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});


//
var users = [{ name: 'Tere', email: 'tere@tere.com'},
    { name: 'Jose', email: 'jose@tere.com'},
    { name: 'Mika', email: 'mika@tere.com'},
    { name: 'Bono', email: 'bono@tere.com'},
    { name: 'Dario', email: 'dario@tere.com'}
]

// Routes

app.get('/', function(req, res){
  res.render('index', {
    title: 'Hello'
  });
});

app.get('/tutupa', function(req, res){
  res.render('tutupa', {
    layout: false,
    title: 'TUTUPA!'
  });
});

app.get('/friday', function(req, res){
  res.render('friday', {
    layout: false,
    title: 'FRIDAY!'
  });
});

app.get('/loopit/:id', function(req,res){
    res.render('loopit',{
        layout:false,
        title: 'loopit',
        videoid: req.params.id
    })
})

app.get('/wishes', function(req, res) {
   Wishes.find({}).sort('created_time', -1).execFind( function(err, wishes) {
//       wishes.forEach(function(wish) {
//          console.log(wish.doc.location) ;
//          console.log(wish.doc) ;
//       });
    res.render('wishes', {layout: false, title: 'Hello', wishes: wishes});
   });
});

app.get('/maps', function(req, res) {
   Wishes.find({}).sort('created_time', -1).execFind( function(err, wishes) {
//       wishes.forEach(function(wish) {
//          console.log(wish.doc.location) ;
//          console.log(wish.doc) ;
//       });
    res.render('maps', {title: 'Hello', wishes:wishes});
   });
});


app.get('/updateToken', function(req, res) {
   //console.log(req);
   var lastToken = new Token({access_token : req.query.code,
                              created_date : new Date(Date.now()).toISOString()});
   console.log(req.query.code);
   lastToken.save();
   res.render('index', {
    title: 'Hello'
  });
})

app.get('/users', function(req, res) {
   res.render('users', {title: 'Hello',users:users});
});



// Only listen on $ node app.js

if (!module.parent) {
  app.listen(80008);
  console.log("Express server listening on port %d", app.address().port);
}
