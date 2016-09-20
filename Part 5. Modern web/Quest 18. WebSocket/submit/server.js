"use strict";

let express = require('express'),
	app = express(),
	http = require('http').Server(app),
	io = require('socket.io')(http);

app.use(express.static(__dirname));


http.listen(8080, ()=>{
	console.log("server started at 8080");
});

app.get('/', (req, res)=>{
	res.sendFile(__dirname+'/client/index.html');
})

app.get('/sketchboard', (req, res)=>{
	console.log("++++++++++++req room at /sketchboard+++++++++++++++++");
	console.log(req.url.split(/\=/)[1]);
	if(req.url.split(/\=/)[1] === undefined) res.redirect('/');
	res.sendFile(__dirname+'/client/sketchboard.html');
});

app.get('/leave', (req, res)=> {
	res.redirect('/');
});


io.on('connection', (socket) => {
	console.log("+++++++++++++++++++++++++++++++++++++++socket adapter on root connection++++++++++++++++++++++++++++");
	console.log(socket.adapter.rooms);

	socket.on('joinRoom', (roomname)=> {
		console.log("socket "+ Object.keys(socket.rooms)[1] + " wants to join room "+roomname);

		socket.join(roomname);

		let triangle, rectangle, circle;
		if(roomManager.rooms[roomname] === undefined){
			roomManager.generateRoom(roomname);

			triangle = {
				type: "triangle",
				number: 1
			};
			rectangle = {
				type: "rectangle",
				number: 1
			};
			circle = {
				type: "circle",
				number: 1
			};

		}else{
			triangle = {
				type: "triangle",
				number: roomManager.rooms[roomname]['triangleNo']
			};
			rectangle = {
				type: "rectangle",
				number: roomManager.rooms[roomname]['rectangleNo']
			};
			circle = {
				type: "circle",
				number: roomManager.rooms[roomname]['circleNo']
			};
		}
		socket.emit('loadInitialNo', triangle, rectangle, circle);
	})


	socket.on('createObject', (objectInfo) => {
		console.log(socket.adapter.rooms);
		console.log("at " + Object.keys(socket.rooms)[1]);
		console.log("created object is ");
		console.log(objectInfo);

		roomManager.increaseNoInfo(Object.keys(socket.rooms)[1], objectInfo['type']);
		socket.broadcast.to(Object.keys(socket.rooms)[1]).emit('createObject', objectInfo);
	});

	socket.on('selectObject', (object) => {
		console.log("at " + Object.keys(socket.rooms)[1]);
		console.log("Selected object is " + object);

		socket.broadcast.to(Object.keys(socket.rooms)[1]).emit('selectObject', object);
	})

	socket.on('moveObject', (currentInfo)=> {
		console.log("at " + Object.keys(socket.rooms)[1]);
		console.log("moveObject");
		console.log(currentInfo);

		socket.broadcast.to(Object.keys(socket.rooms)[1]).emit('moveObject', currentInfo);
	});

	socket.on('deleteObject', (object) => {
		console.log("at " + Object.keys(socket.rooms)[1]);
		console.log("item to delete");
		console.log(object);

		socket.broadcast.to(Object.keys(socket.rooms)[1]).emit('deleteObject', object);
	});
});


class RoomManager {
	constructor(){
		this.rooms = {};
	}

	generateRoom(roomname){
		let room = {
			name: roomname,
			triangleNo: 1,
			rectangleNo: 1,
			circleNo: 1
		}
		this.rooms[roomname] = room;
	}

	increaseNoInfo(roomname, object){
		if(this.rooms[roomname] !== undefined){
			switch(object){
				case 'triangle':
					this.rooms[roomname]['triangleNo']++;
					break;
				case 'rectangle':
					this.rooms[roomname]['rectangleNo']++;
					break;
				case 'circle':
					this.rooms[roomname]['circleNo']++;
					break;
				default:
					throw new Error("undefined object");
			}
		}
	}
}

let roomManager = new RoomManager();
