const path = require('path'),
	express =require('express'),
	app = express(),
	http = require('http').Server(app),
	https = require('https'),
	io = require('socket.io')(http),
	session = require('express-session');
	bodyParser = require('body-parser'),
	db = require('./db.js'),
	sequelize = db.sequelize,
	Activity_info = db.Activity_info,
	Activity_join_log = db.Activity_join_log,
	Chat_log = db.Chat_log;

const googleClientID = "660527717768-7jaidrhsib4v48tq4vs8dt6an89e5ks5.apps.googleusercontent.com";
//이런 정보는 어떻게 저장하는 것이 가장 좋을까?

Chat_log.sync();
Activity_info.sync().then(()=>{
	return Activity_join_log.sync();
});

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
	console.log(req.body.access_token);

	let outermostRes = res;
	let validateURL = "https://www.googleapis.com/oauth2/v3/tokeninfo?access_token="+req.body.access_token;
	https.get(validateURL, (res)=>{
		let receivedData;
		res.on('data', (chunk)=>{
			receivedData = JSON.parse(chunk.toString());
		});
		res.on('end', ()=>{
			console.log(receivedData);
			if(receivedData.aud === googleClientID){
				let userinfoURL = "https://www.googleapis.com/oauth2/v2/userinfo?access_token="+req.body.access_token;
				https.get(userinfoURL, (res)=>{
					let receivedUserInfo;
					res.on('data', (res)=>{
						receivedUserInfo = JSON.parse(res.toString());
					})
					res.on('end', ()=>{
						console.log(receivedUserInfo);
						outermostRes.redirect('/main?username='+receivedUserInfo.name);
					})
				})
			}
		})
	})
});

app.get('/main', (req, res)=>{
	res.sendFile(path.join(__dirname, '/client/main.html'));
});




io.on('connection', (socket)=>{
	const today = new Date().toDateString().replace(/\s/g, '');
	const joinTime = new Date();
	// 이런식으로 pseudo-전역변수 써도 되는걸까?

	socket.on('requestActivityInfo', ()=>{
		console.log("eer gets requestActivityInfo?");
		Activity_info.findAll({
			attributes: ['id', 'title', 'description'],
			where: {
				available_date:{
					gt: new Date(2016, 8, 1),
					lt: new Date(2016, 9, 1)
				}
			}
		}).then((queryResult)=>{
			let activityInfoArr = [];
			for(let i=0;i<queryResult.length;i++){
				activityInfoArr.push(queryResult[i].dataValues);
			}
			console.log(activityInfoArr);
			socket.emit('receiveActivityInfo', activityInfoArr);
		})
	})

 
	socket.on('requestToJoinChat', (username)=>{
		console.log(username);
		socket.username = username;
		//socket.username식으로 session 활용하는거랑 유사하게 마음대로 실어서 사용해도 좋은지?
		// 이거 클라이언트에도 같은방식으로 하는데 과연 괜찮은 것인가?

		Activity_join_log.findAll().then((queryResult)=>{
			let currentActivity_join_log = queryResult;
			for(let i=0;i<queryResult.length;i++){
				socket.emit('joinActivity', "a"+queryResult[i].dataValues.activity_id, queryResult[i].dataValues.username);
				if(queryResult[i].dataValues.username === socket.username){
					socket.activityJoined = "a"+queryResult[i].dataValues.activity_id;
				}
			}		
		});

		io.emit('joinChat', username);
	});

	socket.on('fetchChatLog', (lastChatId)=>{
		console.log(lastChatId);
		let whereOptions = {
			chat_day: today,
			created_at: {
				lt: joinTime
			}
		};
		
		if(lastChatId !== -1){
			whereOptions.id = {$lt: lastChatId};
		}

		console.log(whereOptions);

		Chat_log.findAll({
			where: whereOptions,
			// order: [['created_at', 'DESC']], => 이거 이렇게 하면 나중에 후회하게 될까?
			order: [['id', 'DESC']],
			limit: 100
		}).then((chatlogQuery)=>{
			let lastId = Infinity;

			for(let key in chatlogQuery){
				console.log("chat history id "+chatlogQuery[key].dataValues.id);
				if(chatlogQuery[key].dataValues.id < lastId) lastId = chatlogQuery[key].dataValues.id;
				socket.emit('receiveOldMessage', chatlogQuery[key].dataValues.username, chatlogQuery[key].dataValues.chat_message);
			}
			console.log(Object.keys(chatlogQuery).length);
			if(Object.keys(chatlogQuery).length < 100) lastId = -1;
			socket.emit('lastChatId', lastId);
		});
	});

	socket.on('sendMessage', (message)=>{
		console.log("from username "+ socket.username);
		console.log("on day "+today);
		console.log("message is \n"+message);

		Chat_log.create({
			chat_day: today,
			username: socket.username,
			chat_message: message
		});

		io.emit('receiveMessage', socket.username, message);
	});

	socket.on('applyActivity', (activityNo)=>{
		console.log(activityNo);
		console.log(socket.username);
		if(socket.activityJoined === undefined){
			socket.activityJoined = activityNo;	
			console.log(activityNo.slice(1));
			Activity_join_log.create({
				username: socket.username,
				activity_id: Number(activityNo.slice(1))
			}).then((log)=>{
				console.log(log);
			});
			io.emit('joinActivity', activityNo, socket.username);
		}else{
			socket.emit('cannotJoinActivity');
		}
	});

	socket.on('leaveActivity', ()=>{
		console.log(socket.activityJoined);
		console.log(socket.username);
		Activity_join_log.destroy({
			where:{
				username: socket.username,
				activity_id: socket.activityJoined.slice(1)
			}
		});
		io.emit('leaveActivity', socket.activityJoined, socket.username);
		socket.activityJoined = undefined;
		console.log(socket.activityJoined);
	})
});

