"use strict";

let express = require('express'),
	app = express(),
	http = require('http').Server(app),
	io = require('socket.io')(http);

app.use(express.static(__dirname));

// var server = app.listen(8080, function(){
// 	console.log("Server ever started?");
// });



app.get('/', function(req, res){
	res.sendFile(__dirname+'/client/index.html');
})

io.on('connection', function(socket){
	console.log('a user connected');
	socket.on('chat message', function(msg){
		console.log("message is "+msg);
		io.emit('chat message', msg);
	});
});

http.listen(8080, function(){
	console.log("Server started at 8080");
})


