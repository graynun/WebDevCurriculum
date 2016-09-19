"use strict";

let express = require('express'),
	app = express(),
	session = require('express-session'),
	http = require('http').Server(app),
	io = require('socket.io')(http);

app.use(express.static(__dirname));
// app.use(
// 	session({
// 		secret: 'change string whenvever I want to',
// 		resave: false,
// 		saveUninitialized: false,
// 		cookie: {
// 			secure: false,
// 			maxAge: 2 * 60 * 1000
// 		}
// 	})
// );

http.listen(8080, ()=>{
	console.log("server started at 8080");
});

app.get('/', (req, res)=>{
	res.sendFile(__dirname+'/client/index.html');
})

app.get('/join', (req, res)=>{
	console.log("++++++++++++req.headers.roomname at /join+++++++++++++++++");
	console.log(req.headers.roomname);

	// req.session.save((err)=> {
	// 	if(err) throw err;
	// 	console.log("saved session");
		res.redirect('/sketchboard?room='+req.headers.roomname);		
	// })
});

app.get('/sketchboard', (req, res)=>{
	console.log("++++++++++++req room at /sketchboard+++++++++++++++++");
	console.log(req.url.split(/\=/g)[1]);
	res.sendFile(__dirname+'/client/sketchboard.html');
});

app.get('/leave', (req, res)=> {
	// req.session.destroy((err)=> {
	// 	if(err) throw err;
	// 	console.log("successfully destroyed session");
		res.redirect('/');
	// })
})


io.on('connection', (socket) => {
	console.log("+++++++++++++++++++++++++++++++++++++++socket adapter on root connection++++++++++++++++++++++++++++");
	console.log(socket.adapter.rooms);
	// console.log(socket.client.request);

	// socket.join("room1");

	socket.on('createObject', (objectInfo) => {
		console.log("created object is ");
		console.log(objectInfo);
		objectNoWatcher.increaseNoInfo(objectInfo['type']);
		socket.broadcast.emit('createObject', objectInfo);
	});

	socket.on('selectObject', (object) => {
		console.log("Selected object is " + object);
		socket.broadcast.emit('selectObject', object);
	})

	socket.on('moveObject', (currentInfo)=> {
		console.log("ever gets to here?");
		console.log(currentInfo);
		socket.broadcast.emit('moveObject', currentInfo);
	});

	socket.on('deleteObject', (object) => {
		console.log("item to delete");
		console.log(object);
		socket.broadcast.emit('deleteObject', object);
	});

	socket.on('requestInitialNo', () =>{
		let triangle = {
			type: "triangle",
			number: objectNoWatcher.triangleNo
		};
		let rectangle = {
			type: "rectangle",
			number: objectNoWatcher.rectangleNo
		};
		let circle = {
			type: "circle",
			number: objectNoWatcher.circleNo
		};
		socket.emit('loadInitialNo', triangle, rectangle, circle);
	})
});


class ObjectNoWatcher {
	constructor(){
		this.triangleNo = 1,
		this.rectangleNo = 1,
		this.circleNo = 1;
	}

	increaseNoInfo(object){
		switch(object){
			case 'triangle':
				this.triangleNo++;
				break;
			case 'rectangle':
				this.rectangleNo++;
				break;
			case 'circle':
				this.circleNo++;
				break;
			default:
				throw new Error("undefined object");
		}
	}
}

let objectNoWatcher = new ObjectNoWatcher();
