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


http.listen(8080, ()=>{
	console.log("server started at 8080");
});

app.use('/', (req, res, next) => {
	// console.log("req.session.user "+req.session.user);
	// console.log("req.sessionID "+req.sessionID);
	next();
})

app.get('/', (req, res)=>{
	res.sendFile(__dirname+'/client/index.html');
	// res.sendFile(__dirname+'/trial.html');
})

app.get('/join', (req, res)=>{
	// console.log(req.headers);
	// if(req.headers.roomname !== undefined) req.session.roomname = req.headers.roomname;

	io.on('connection', (socket) => {
		console.log("socket adapter on connection at /join");
		if(req.headers.roomname !== undefined) socket.roomname = req.headers.roomname;
		console.log(socket.adapter);
	})

	res.redirect('/sketchboard');
});

app.get('/sketchboard', (req, res)=>{
	console.log("sketchboard roomname?" + req.headers.roomname);
	io.on('connection', (socket)=>{
		console.log("socket adapter on connection at /sketchboard");
		// console.log(socket.adapter);
		console.log("room is "+ socket.roomname);

		socket.join(socket.roomname, (err)=>{
			if(err) throw err;
			console.log("successfully joined room " + socket.roomname);
		})

		socket.on('test', (str)=>{
			console.log(str);
			socket.to(socket.roomname).emit('test', str);
		})

		socket.on('leaveroom', ()=>{
			console.log("Ever called?");
			// console.log(res);
			socket.disconnect();
			socket.on('disconection', ()=>{
				console.log("successfully closed socket");
			})
			// res.redirect('/');	
			// socket.on('disconnect', ()=>{
			// 	console.log("ever disconnected?");
			
			// });
		})


	})

	res.sendFile(__dirname+'/client/sketchboard.html');
})


