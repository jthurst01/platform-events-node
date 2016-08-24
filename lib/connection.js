'use strict'
 
var nforce = require('nforce');
var express = require('express');
var app = express();
var http = require('http');

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

var io = require('socket.io').listen(server);


var org = nforce.createConnection({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: 'http://localhost:3000/oauth/_callback',
  environment: 'production',
  mode: 'single'
});

org.authenticate({ username: process.env.USERNAME, password: process.env.PASSWORD}, function(err, resp){
  // the oauth object was stored in the connection object
  if(!err) console.log('Successfully connected to Salesforce. Cached token: ' + org.oauth.access_token);
  if(err) console.log('Cannot connect to Salesforce: ' + err);
  var client = org.createStreamClient();

	var accs = client.subscribe({ topic: 'Printer_Ink_Level__e', isPlatformEvent: true });

	accs.on('error', function(err) {
		console.log('subscription error');
		console.log(err);
		client.disconnect();
	});

	accs.on('data', function(data) {
		console.log(data);
		io.emit('newEvent', JSON.stringify(data));
	});
});

module.exports = org, app;

