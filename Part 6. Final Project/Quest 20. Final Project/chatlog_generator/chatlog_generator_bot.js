const fs = require('fs'),
	Sequelize = require('sequelize'),
	db = require('../refreshday_survival/db.js'),
	Chat_log = db.Chat_log,
	today = new Date().toDateString().replace(/\s/g, ''),
	usernameArr = ['피카츄', '라이츄', '파이리', '꼬부기', '버터플', '야도란', '피죤', '또가스', '거북왕', '푸린'];

Chat_log.sync().then(()=>{
	fs.readFile('shower.txt', (err, data)=>{
		if(err) throw err;
		const body = data.toString('utf8');

		let body_arr = body.split(/\n\n/g);
		console.log(body_arr.length);

		for(let i=0;i<body_arr.length;i++){
			Chat_log.create({
				chat_day: today,
				username: usernameArr[Math.floor(Math.random()*10)],
				chat_message: body_arr[i]
			});			
		}
	})
});


