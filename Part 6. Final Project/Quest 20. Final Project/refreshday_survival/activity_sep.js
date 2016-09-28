const db = require('./db.js'),
	sequelize = db.sequelize,
	Activity_info = db.Activity_info,
	Activity_join_log = db.Activity_join_log;

Activity_info.sync().then(()=>{
	return Activity_join_log.sync();
}).then(()=>{
	return Activity_info.create({
		title: "발 또는 등 마사지\n(Foot or back massage)",
		description: "발마사지와 등마사지 중에 하나 선택\n1시, 2시 타임 나누어 진행 (8명/7명)", 
		available_date: new Date(2016, 8, 15)
	});
}).then(()=>{
	return Activity_info.create({
		title: "낚시카페\n(Fishing)",
		description: "잡은 물고기는 가져갈 수 없으며, 운이 좋으면 상품으로 교환할 수도 있음.\n컵라면/커피 무한제공", 
		available_date: new Date(2016, 8, 15)
	});	
}).then(()=>{
	return Activity_info.create({
		title: "케익만들기\n(Baking(cake))",
		description: "기본은 같고 데코레이션은 준비된 것 중에 자유롭게 선택할 수 있음",
		available_date: new Date(2016, 8, 15)
	});	
}).then(()=>{
	return Activity_info.create({
		title: "볼링\n(Bowling)",
		available_date: new Date(2016, 8, 15)
	});		
}).then(()=>{
	return Activity_info.create({
		title: "방탈출\n(Escape room)",
		description: "특별한 테마의 방안에 갇힌 참가자들이 숨겨진 단서들을 활용하여 주어진 시간동안 방을 탈출하는 게임입니다.",
		available_date: new Date(2016, 8, 15)
	});	
}).then(()=>{
	return Activity_info.create({
		title: "캔들만들기\n(Candle Making)",
		description: "위의 링크에서 플라워데코레이션 캔들을 만들 예정입니다.", 
		available_date: new Date(2016, 0, 15)
	});
}).then(()=>{
	return Activity_info.create({
		title: "플라워레슨\n(Flower Arrangement)",
		available_date: new Date(2016, 0, 15)
	});	
}).then(()=>{
	return Activity_info.create({
		title: "방탈출\n(Escape Room)",
		description: "특별한 테마의 방안에 갇힌 참가자들이 숨겨진 단서들을 활용하여 주어진 시간동안 방을 탈출하는 게임입니다.",
		available_date: new Date(2016, 0, 15)
	});	
}).then(()=>{
	return Activity_info.create({
		title: "스케이트\n(Ice Skating)",
		description: "장갑을 꼭 착용해야합니다\n(현장 구입 가능)",
		available_date: new Date(2016, 0, 15)
	});		
}).then(()=>{
	return Activity_info.create({
		title: "클라이밍\n(Climbing)",
		description: "- 90분 강습 진행\n- 이후 시간은 자유롭게 운동 가능\n- 운동복 따로 준비, 샤워 가능, 수건 제공",
		available_date: new Date(2016, 0, 15)
	});	
});