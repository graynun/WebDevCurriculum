"use strict";

var express = require('express'),
	app = express(),
	WebSocket = require('ws'),
	WebSocketServer = WebSocket.Server,
	wss = new WebSocketServer({port:8080});
// var ws = new WebSocket({port:8080});

// app.use(express.static(__dirname));

var server = app.listen(8080, function(){
	console.log("Server ever started?");
});


app.use(function(req, res, next){
	req.socket.on("error", function(e){
		console.log("req socket error");
		console.log(e);
	});

	res.socket.on("error", function(e){
		console.log("res socket error");
		console.log(e);
	})
})

app.get('/', function(req, res){
	res.send('/client/index.html');
})

// ws.on('open', function open(){
// 	ws.send('something?');
// })

// ws.on('message', function(data, flag){
// 	console.log(data);
// })