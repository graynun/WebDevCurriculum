"use strict";

let express = require('express'),
	app = express(),
	session = require('express-session'),
	http = require('http').Server(app),
	io = require('socket.io')(http);

app.use(express.static(__dirname));
app.use(
	session({
		secret: 'change string whenvever I want to',
		resave: false,
		saveUninitialized: false,
		cookie: {
			secure: false,
			maxAge: 2 * 60 * 1000
		}
	})
);


app.use('/', (req, res, next) => {
	// console.log("req.session.user "+req.session.user);
	// console.log("req.sessionID "+req.sessionID);
	next();
})

app.get('/', (req, res)=>{
	res.sendFile(__dirname+'/client/index.html');
})

app.get('/join', (req, res)=>{
	// console.log(req.headers);
	console.log(req.headers.roomname);
	res.redirect('/sketchboard');
});

app.get('/sketchboard', (req, res)=>{
	res.sendFile(__dirname+'/client/sketchboard.html');
})

http.listen(8080, ()=>{
	console.log("server started at 8080");
});


io.use((socket, next)=>{
	// console.log("socket request header cookies");
	// console.log(socket.request.headers);
	// console.log(socket.handshake.url);
	console.log(socket.rooms);
	console.log(socket.id);
	next();
})


io.on('connection', (socket)=>{
	// console.log("connected?");
	// console.log("++++++++++++++++++++++++++++adapter+++++++++++++++++++++++++++++");
	// console.log(socket.adapter);
	// console.log("++++++++++++++++++++++++++++conn+++++++++++++++++++++++++++++");
	// console.log(socket.conn.id);


	socket.on('createroom', (json)=>{
		console.log("Ever gets to here?");
		let roomname = json.roomname;
		socket.join(roomname, (err)=>{
			if(err) throw err;
			console.log(socket.id);
			console.log(socket.rooms);
			console.log(socket.client);
			console.log(socket.conn);
		})
	})
})

