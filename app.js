var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var nforce = require('nforce');

var routes = require('./routes/index');

var app = express();
var server = require('http').Server(app);
// attach socket.io and listen
var io = require('socket.io')(server);
// get a reference to the socket once a client connects
var socket = io.sockets.on('connection', function (socket) { });

var org = nforce.createConnection({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: 'http://localhost:3000/oauth/_callback',
  environment: 'production',
  mode: 'single'
});

org.authenticate({ username: process.env.USERNAME, password: process.env.PASSWORD }, function(err, oauth) {

  if(err) return console.log(err);
  if(!err) {
    console.log('*** Successfully connected to Salesforce ***');
    // add any logic to perform after login
  }

  // subscribe to a pushtopic
  var str = org.stream({ topic: 'Printer_Ink_Level__e', isPlatformEvent: true, oauth: oauth });

  str.on('connect', function(){
    console.log('Connected to pushtopic: ' + config.PUSH_TOPIC);
  });

  str.on('error', function(error) {
    console.log('Error received from pushtopic: ' + error);
  });

  str.on('data', function(data) {
    console.log('Received the following from event stream ---');
    console.log(data);
    // emit the record to be displayed on the page
    socket.emit('record-processed', JSON.stringify(data));
  });

});

app.set('port', process.env.PORT || 3001);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use("/lib", express.static(path.join(__dirname,'node_modules'))); 


app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

server.listen(app.get('port'), function() {
  console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});

module.exports = app;
