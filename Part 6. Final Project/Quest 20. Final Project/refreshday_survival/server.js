const path = require('path'),
	express =require('express'),
	app = express(),
	http = require('http').Server(app),
	io = require('socket.io')(http),
	session = require('express-session');
	bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('client'));
app.use(session({
	secret: 'randomjibberjabber?!',
	resave: false,
	saveUninitialized: true,
	maxAge: 3 * 60 * 1000
}));


http.listen(8080, ()=>{
	console.log("start to listening at 8080");
});

app.get('/', (req, res)=>{
	res.sendFile(path.join(__dirname, "/client/login.html"));
});

app.post('/login', (req, res)=>{
	console.log(req.body.username);
	res.redirect('/main?username='+req.body.username);
});

app.get('/main', (req, res)=>{
	res.sendFile(path.join(__dirname, '/client/main.html'));
});




io.on('connection', (socket)=>{
	// console.log(socket.adapter);
	console.log("aaargh");

	socket.on('requestToJoinChat', (username)=>{
		console.log(username);
		socket.username = username;
		io.emit('joinChat', username);	
	});

	socket.on('sendMessage', (message)=>{
		console.log(message);
		io.emit('receiveMessage', message);
	});

	socket.on('applyActivity', (activityNo)=>{
		console.log(activityNo);
		console.log(socket.username);
		if(socket.activityJoined === undefined){
			socket.activityJoined = activityNo;	
			io.emit('joinActivity', activityNo, socket.username);
		}else{
			socket.emit('cannotJoinActivity');
		}
	});

	socket.on('leaveActivity', ()=>{
		console.log(socket.activityJoined);
		console.log(socket.username);
		io.emit('leaveActivity', socket.activityJoined, socket.username);
		socket.activityJoined = undefined;
		console.log(socket.activityJoined);
	})
});

