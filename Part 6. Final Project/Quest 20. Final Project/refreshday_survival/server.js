const path = require('path'),
	express =require('express'),
	app = express(),
	http = require('http').Server(app),
	https = require('https'),
	io = require('socket.io')(http),
	bodyParser = require('body-parser'),
	cookieParser = require('cookie-parser'),
	jwt = require('jsonwebtoken'),
	db = require('./db.js'),
	sequelize = db.sequelize,
	Activity_info = db.Activity_info,
	Activity_join_log = db.Activity_join_log,
	Chat_log = db.Chat_log;

let activityInfo = {};
// 이거 좀 더 우아하게 할 수 없나?

const googleClientID = "660527717768-7jaidrhsib4v48tq4vs8dt6an89e5ks5.apps.googleusercontent.com",
	jwtkey = "random jibber jabber :P";
//이런 정보는 어떻게 저장하는 것이 가장 좋을까? ==> config에 양이 많으면 따로 빼서 저장을...

Chat_log.sync();
Activity_info.sync().then(()=>{
	return Activity_join_log.sync();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());
app.use(express.static('client'));



http.listen(8080, ()=>{
	console.log("start to listening at 8080");
});

app.get('/', (req, res)=>{
	console.log(req.cookies);
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
						let userinfo = {
							username: receivedUserInfo.name,
							email: receivedUserInfo.email
						};

						jwt.sign(userinfo, jwtkey, {}, (err, token)=>{
							if(err) throw err;
							outermostRes.cookie("jwt", token);
							outermostRes.redirect('/main');
						})
					})
				})
			}
		})
	})
});

app.get('/logout', (req, res)=>{
	res.clearCookie('jwt');
	res.redirect('/');
})

app.get('/main', (req, res)=>{
	jwt.verify(req.cookies.jwt, jwtkey, {}, (err, userinfo)=>{
		if(userinfo === undefined){
			console.log(new Error("no authenticaated user"));
			res.redirect('/');
		}else{
			console.log("****************************jwt verified info **********************************");
			console.log(userinfo.username);
			console.log(userinfo.email);
			res.sendFile(path.join(__dirname, '/client/main.html'));	
		} 
	});
});




io.on('connection', (socket)=>{
	socket.on('fetchActivityInfo', ()=>{
		console.log("eer gets fetchActivityInfo?");
		Activity_info.findAll({
			attributes: ['id', 'title', 'description', 'quota'],
			where: {
				available_date:{
					gt: new Date(2016, 8, 1),
					lt: new Date(2016, 9, 1)
				}
			}
		}).then((queryResult)=>{
			for(let i=0;i<queryResult.length;i++){
				queryResult[i].dataValues.currentQuota = 0;
				activityInfo[queryResult[i].dataValues.id] = queryResult[i].dataValues;
			}
			console.log(activityInfo);
			socket.emit('receiveActivityInfo', activityInfo);
		})
	})

 
	socket.on('requestToJoinChat', ()=>{
		console.log("****************requestTOJoin socket header cookie*********************");
		let currentjwt = socket.handshake.headers.cookie.split(/jwt=/g)[1];
		console.log(currentjwt);

		jwt.verify(currentjwt, jwtkey, {}, (err, userinfo)=>{
			if(err) throw err;
			if(userinfo === undefined){
				throw new Error("no authenticaated user");
			}else{
				io.emit('joinChat', userinfo.username);	

				Activity_join_log.findAll().then((queryResult)=>{
					let currentActivity_join_log = queryResult;
					for(let i=0;i<queryResult.length;i++){
						socket.emit('joinActivity', queryResult[i].dataValues.activity_id, queryResult[i].dataValues.username);
					}		
				});
			}
		})
	});

	socket.on('fetchChatLog', (lastChatId, jointime)=>{
		let joinDate = new Date(jointime);
		let yesterday = new Date(jointime);
		yesterday.setDate(yesterday.getDate() - 1);

		let whereOptions = {
			created_at: {
				$lt: joinDate,
				$gt: yesterday
			}
		};

		if(lastChatId !== -1){
			whereOptions.id = {$lt: lastChatId};
		}

		console.log(whereOptions);

		Chat_log.findAll({
			where: whereOptions,
			// order: [['created_at', 'DESC']], => 이거 이렇게 하면 나중에 후회하게 될까? 데이터 순서는 별 차이 없을거라는듯?
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

	socket.on('sendMessage', (username, message)=>{
		console.log(socket.handshake.headers);

		jwt.verify(currentjwt, jwtkey, {}, (err, userinfo)=>{
			if(err) throw err;
			if(userinfo === undefined){
				throw new Error("no authenticaated user");
			}else{
				console.log("from username "+ userinfo.username);
				console.log("message is \n"+message);

				Chat_log.create({
					username: userinfo.username,
					chat_message: message
				});
				io.emit('receiveMessage', userinfo.username, message);
			}
		});
	});

	socket.on('applyActivity', (activityNo, username)=>{
		console.log(activityNo);
		let activity_no = Number(activityNo);

		if(activityInfo[activity_no].currentQuota >= activityInfo[activity_no].quota){
			socket.emit('activityFull');
		}else{
			activityInfo[activity_no].currentQuota++;
			Activity_join_log.create({
				username: username,
				activity_id: activity_no
			}).then((log)=>{
				console.log(log);
				io.emit('joinActivity', activity_no, username);
			});
		}


		// else{
		// 	socket.emit('cannotJoinActivity');
		// }
		// 현재 들어가있는 액티비티 유무 판정을 클라에게 미룬 것이 잘한 짓인가?
	});

	socket.on('leaveActivity', (username, activityJoined)=>{
		Activity_join_log.destroy({
			where:{
				username: username,
				activity_id: activityJoined
			}
		});
		io.emit('leaveActivity', username, activityJoined);
	});

	socket.on('disconnectSocket', ()=>{
		console.log("Socket disconnect called");
		socket.disconnect();
		console.log(socket);
	})
});

