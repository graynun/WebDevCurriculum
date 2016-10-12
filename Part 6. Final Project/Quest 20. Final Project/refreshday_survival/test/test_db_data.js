const db = require('./test_db.js'),
	chat_generator = require('../../chatlog_generator/chatlog_generator_bot.js'),
	Activity_info = db.Activity_info,
	Activity_join_log = db.Activity_join_log,
	Chat_log = db.Chat_log;

module.exports = new Promise(
	(resolve, reject)=>{
		let today = new Date();

		Activity_info.sync().then(()=>{
			return Activity_join_log.sync();
		}).then(()=>{
			return Activity_info.create({
				title_kr: "발 또는 등 마사지",
				title_en: "Foot or back massage",
				description_kr: "발마사지와 등마사지 중에 하나 선택\n1시, 2시 타임 나누어 진행 (8명/7명)", 
				description_en: "Choose one(either foot or back)\nSeparated into two groups\n(8 ppl at 1pm / 7 ppl at 2pm)", 
				available_date: new Date(today.getYear()+1900, today.getMonth(), 15),
				quota: 0,
			});
		}).then(()=>{
			return Activity_info.create({
				title_kr: "낚시카페",
				title_en: "Fishing",
				description_kr: "잡은 물고기는 가져갈 수 없으며, 운이 좋으면 상품으로 교환할 수도 있음.\n컵라면/커피 무한제공", 
				description_en: "Can't take fishes you catch. \nFishes can be traded with gifts(if lucky)\nUnlimited cup noodle / coffee provided", 
				available_date: new Date(today.getYear()+1900, today.getMonth(), 15),
				quota: 10
			});	
		}).then(()=>{
			return Activity_info.create({
				title_kr: "케익만들기",
				title_en: "Baking(cake)",
				description_kr: "기본은 같고 데코레이션은 준비된 것 중에 자유롭게 선택할 수 있음",
				description_en: "Can choose the decoration design",
				available_date: new Date(today.getYear()+1900, today.getMonth(), 15),
				quota: 2
			});	
		}).then(()=>{
			return Activity_info.create({
				title_kr: "볼링",
				title_en: "Bowling",
				available_date: new Date(today.getYear()+1900, today.getMonth(), 15),
				quota: 20
			});		
		}).then(()=>{
			return Activity_info.create({
				title_kr: "방탈출",
				title_en: "Escape room",
				description_kr: "특별한 테마의 방안에 갇힌 참가자들이 숨겨진 단서들을 활용하여 주어진 시간동안 방을 탈출하는 게임입니다.",
				description_en: "Escape from a room using hidden clues.",
				available_date: new Date(today.getYear()+1900, today.getMonth(), 15),
				quota: 1
			});	
		}).then(()=>{
			return Activity_info.create({
				title_kr: "캔들만들기",
				title_en: "Candle Making",
				description_kr: "위의 링크에서 플라워데코레이션 캔들을 만들 예정입니다.", 
				description_en: "We will be making the flower decoration candle in the link above.", 
				available_date: new Date(2016, 0, 15),
				quota: 10
			});
		}).then(()=>{
			return Activity_info.create({
				title_kr: "플라워레슨",
				title_en: "Flower Arrangement",
				available_date: new Date(2016, 0, 15),
				quota: 10
			});	
		}).then(()=>{
			return Activity_info.create({
				title_kr: "방탈출",
				title_en: "Escape room",
				description_kr: "특별한 테마의 방안에 갇힌 참가자들이 숨겨진 단서들을 활용하여 주어진 시간동안 방을 탈출하는 게임입니다.",
				description_en: "Escape from a room using hidden clues.",
				available_date: new Date(2016, 0, 15),
				quota: 1
			});	
		}).then(()=>{
			return Activity_info.create({
				title_kr: "스케이트",
				title_en: "Ice Skating",
				description_kr: "장갑을 꼭 착용해야합니다\n(현장 구입 가능)",
				description_en: "-Freestyle ice skating\n-Gloves are required",
				available_date: new Date(2016, 0, 15),
				quota: 20
			});		
		}).then(()=>{
			return Activity_info.create({
				title_kr: "클라이밍",
				title_en: "Climbing",
				description_kr: "- 90분 강습 진행\n- 이후 시간은 자유롭게 운동 가능\n- 운동복 따로 준비, 샤워 가능, 수건 제공",
				description_en: "-90 minutes of instruction\n-Individual climbing is allowed after\n-Showers and towels available\n-Comfortable clothing recommended",
				available_date: new Date(2016, 0, 15),
				quota: 1
			});	
		}).then(()=>{
			return chat_generator;
		}).then(()=>{
			resolve(true);
		});
	}
);

