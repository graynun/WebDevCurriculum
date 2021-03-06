class RuleBook {
	constructor(jointime, socket, chatManager) {
		this.jointime = jointime,
		this.username = undefined,
		this.activityJoined = undefined;
		this.language = undefined;

		this.socket = socket,
		this.chatManager = chatManager;

		this.bindSocketEvents();
		this.bindEvents();
		this.initialize();
	}

	initialize() {
		this.appendLoadMore();
		
		this.socket.emit('getLanguageInfo');
		this.socket.emit('requestToJoinChat');
		this.socket.emit('fetchActivityInfo', this.language);
		
	}

	bindEvents() {
		document.addEventListener('keypress', (e)=>{
			if(e.key === "Enter"){
				let message = document.querySelector('.chatContent').value;
				if(message !== ""){
					document.querySelector('.chatContent').value = "";
					this.socket.emit('sendMessage', this.username, message);				
				}
			}
		})

		document.querySelector('.signout').addEventListener('click', ()=>{
			console.log("Ever called?");
			this.socket.emit('disconnectSocket');
			let logoutreq = new XMLHttpRequest();
			logoutreq.onload = ()=>{
				if(logoutreq.status === 200){
					window.location.replace(logoutreq.responseURL);
				}
			}

			logoutreq.open('GET', '/logout');
			logoutreq.send();
		});

		document.querySelector('.changeLanguage').addEventListener('click', ()=>{
			if (document.querySelector('.changeLanguage').innerText === 'English') {
				this.setLanguage('en');
				this.socket.emit('fetchActivityInfo', 'en');
			} else {
				this.setLanguage('kr');
				this.socket.emit('fetchActivityInfo', 'kr');
			}
		});
	}

	bindSocketEvents() {
		var that = this;

		this.socket.on('receiveLanguageInfo', (language)=>{
			this.language = language;
			this.setLanguage();
		});

		this.socket.on('receiveActivityInfo', (activityInfo)=>{
			console.log(activityInfo);
			for(var key in activityInfo){
				that.appendActivityDom(activityInfo[key].id, activityInfo[key].title, activityInfo[key].description, activityInfo[key].quota);
			}
		})

		this.socket.on('joinChat', (username)=>{
			console.log("Ever called joinchat?");
			this.username = username;
			document.querySelector('.username').innerText = username;
			let msg;
			(this.language === 'kr')? msg = "<strong>"+username+"</strong> 님이 입장하셨습니다." : msg = "<strong>"+username+"</strong> entered." 
			this.chatManager.appendMessage('system', msg);
		})

		this.socket.on('receiveMessage', (author, message)=>{
			console.log(author, message);
			this.chatManager.appendMessage(author, message);
		})

		this.socket.on('receiveOldMessage', (author, message)=>{
			console.log(message);
			this.chatManager.appendOldMessage(author, message);
		})

		this.socket.on('lastChatId', (lastId)=>{
			if(lastId !== -1){
				this.chatManager.lastChatId = lastId;
				this.appendLoadMore();
			}else{
				let loadMore = document.createElement('p');
				(this.language === 'kr')? loadMore.innerText = "읽지 않은 채팅 내역이 없습니다" : loadMore.innerText = "You've reached at the very beginning of chatlog."
				document.querySelector('.chatWindow').insertBefore(loadMore, document.querySelector('.chatWindow>p'));
			}
			console.log(this.chatManager.lastChatId);
		})

		this.socket.on('joinActivity', (activityNo, username)=>{
			console.log(activityNo, username);

			let li = document.createElement('li');
			li.innerHTML = username;
			if(username === this.username){
				this.activityJoined = activityNo;

				li.classList.add('owner');
				let remove = document.createElement('div');
				remove.classList.add('leaveActivity');
				remove.innerHTML = '✕';
				remove.addEventListener('click', ()=>{
					this.socket.emit('leaveActivity', this.username, this.activityJoined);
				});
				li.appendChild(remove);
			}
			document.querySelector('.a'+activityNo+' .applicantList').appendChild(li);

			document.querySelector('.a'+activityNo+' .currentQuota').innerText = document.querySelector('.a'+activityNo+' .applicantList').childNodes.length - 1;
		})

		this.socket.on('activityFull', ()=>{
			(this.language === 'kr')? alert("정원이 초과되었습니다.") : alert('The activity is already full');
		})


		this.socket.on('leaveActivity',(username, activityNo)=>{
			console.log(activityNo, username);
			if(this.username === username && this.activityJoined === activityNo) {
				this.activityJoined = undefined;

				let ul = document.querySelector('.a'+activityNo+' .applicantList').childNodes;
				document.querySelector('.a'+activityNo+' .currentQuota').innerText = ul - 2 || 0;
				for (let i=0;i<ul.length;i++){
					if (ul[i].innerText !== undefined && ul[i].innerText.indexOf(username) !== -1) ul[i].parentNode.removeChild(ul[i]);
				}
			}else{
				throw new Error("inappropriate joined activity info");
			}
		})
	}

	appendActivityDom(id, title, description, quota) {
		console.log(id, title, description, quota);
		let aNo = 'a'+id;
		let template = document.querySelector('.activityTemplate');
		let content = document.importNode(template.content, true);
		content.querySelector('.activity').classList.add(aNo);
		content.querySelector('.activityTitle').innerText = title;
		(this.language === 'kr')? content.querySelector('span.quota').innerText = " / "+quota+" 명" : content.querySelector('span.quota').innerText = " / "+quota+" person";
		if(description !== null) content.querySelector('.activityDescription').innerText = description;

		content.querySelector('.applyActivity').addEventListener('click', ()=>{
			console.log("current activityJoined "+this.activityJoined);
			if(this.activityJoined === undefined){
				this.socket.emit("applyActivity", id, this.username);
			}else{
				(this.language === 'kr')? alert("이미 액티비티에 들어가 있습니다.") : alert("Already joined an activity.");
			}
			
		});

		document.querySelector('.activityContainer').insertBefore(
			content, document.querySelector('.addActivity')
		);
	}

	appendLoadMore(){
		console.log("Ever called initialize?");

		let loadMore = document.createElement('p');
		loadMore.classList.add('loadMore');
		(this.language === 'kr')? loadMore.innerText = "채팅내역 더보기" : loadMore.innerText = "Load more"
		loadMore.addEventListener('click', ()=>{
			loadMore.parentNode.removeChild(loadMore);
			this.socket.emit('fetchChatLog', this.chatManager.lastChatId, Date.parse(this.jointime));
		})

		document.querySelector('.chatWindow').insertBefore(loadMore, document.querySelector('.chatWindow>p'));
	}

	setLanguage(language){
		 if (language === "ko"){
		 	this.language === "ko";

			document.querySelector('.pageTitle').innerText = "리프레시 데이 선착순 신청표";
			document.querySelector('.changeLanguage').innerText = "English";
			document.querySelector('.signout').innerText = "로그아웃";	
		} else if (language === "en") {
			this.language === "en";

			document.querySelector('.pageTitle').innerText = "Refreshday Activity sign up";
			document.querySelector('.changeLanguage').innerText = "한글";
			document.querySelector('.signout').innerText = "Signout";	
		} else {
			if (this.language === "ko"){
				document.querySelector('.pageTitle').innerText = "리프레시 데이 선착순 신청표";
				document.querySelector('.changeLanguage').innerText = "English";
				document.querySelector('.signout').innerText = "로그아웃";	
			} else {
				document.querySelector('.pageTitle').innerText = "Refreshday Activity sign up";
				document.querySelector('.changeLanguage').innerText = "한글";
				document.querySelector('.signout').innerText = "Signout";	
			}
		}
	}
}

class ChatManager {
	constructor(){
		this.dom = document.querySelector('.chatRoom'),
		this.lastChatId = -1;

		this.bindEvents();
	}

	bindEvents(){
		var that = this;

		this.dom.querySelector('.minimizeChat').addEventListener('click', ()=>{
			if(that.dom.querySelector('.minimizeChat').classList.contains('close')){
				that.dom.style.bottom = "0";
			}else{
				that.dom.style.bottom = "-358px";
			}
			that.dom.querySelector('.minimizeChat').classList.toggle('close');
		})
	}

	appendMessage(author, message){
		console.log(author, message);
		let p = document.createElement('p');
		let m = document.createElement('span');
		m.innerHTML = message;
		
		if(author !== 'system'){
			let a = document.createElement('span');
			a.innerHTML = author;
			a.classList.add("author");
			p.appendChild(a);
		} else {
			m.classList.add("system");
		}
			p.appendChild(m);
			console.log(p);
		this.dom.querySelector('.chatWindow').appendChild(p);
		this.dom.querySelector('.chatWindow').scrollTop = this.dom.querySelector('.chatWindow').scrollHeight;
	}

	appendOldMessage(author, message){
		let p = document.createElement('p');

		let a = document.createElement('span');
		a.innerHTML = author;
		a.classList.add("author");
		p.appendChild(a);

		let m = document.createElement('span');
		m.innerHTML = message;
		p.appendChild(m);

		this.dom.querySelector('.chatWindow').insertBefore(p, document.querySelector('.chatWindow>p'));
	}
}

class ActivityManager {
	constructor(){
		this.activities = [];
	}


}



window.onload = ()=>{
	const socket = io('http://localhost:8080', {'forceNew': true});
	const chatManager = new ChatManager();
	const ruleBook = new RuleBook(new Date(), socket, chatManager);
};