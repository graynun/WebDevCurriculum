class RuleBook {
	constructor(socket, chatManager) {
		this.socket = socket,
		this.chatManager = chatManager,
		this.activityNo = 0;
		
		this.bindSocketEvents();
		this.bindEvents();
		this.initialize();
	}

	initialize() {
		// this.appendActivityDom();

		let username = decodeURIComponent(window.location.search.split("=")[1]);
		this.socket.username = username;
		this.socket.emit('requestActivityInfo');
		this.socket.emit('requestToJoinChat', username);
	}

	bindEvents() {
		// document.querySelector('.addActivity').addEventListener('click', ()=>{
		// 	this.appendActivityDom();
		// });

		document.addEventListener('keypress', (e)=>{
			if(e.key === "Enter"){
				let message = document.querySelector('.chatContent').value;
				if(message !== ""){
					document.querySelector('.chatContent').value = "";
					this.socket.emit('sendMessage', message);				
				}
			}
		})
	}

	bindSocketEvents() {
		var that = this;

		this.socket.on('receiveActivityInfo', (activityInfo)=>{
			for(let i=0;i<activityInfo.length;i++){
				that.appendActivityDom(activityInfo[i].id, activityInfo[i].title);
			}
		})

		this.socket.on('joinChat', (username)=>{
			let msg = "<strong>"+username+"</strong> 님이 입장하셨습니다.";
			this.chatManager.appendMessage(msg);
		})

		this.socket.on('receiveMessage', (message)=>{
			console.log(message);
			this.chatManager.appendMessage(message);
		})

		this.socket.on('joinActivity', (activityNo, username)=>{
			console.log(activityNo, username);

			let li = document.createElement('li');
			li.innerHTML = username;
			if(username === this.socket.username){
				li.classList.add('owner');
				let remove = document.createElement('span');
				remove.classList.add('leaveActivity');
				remove.innerHTML = 'X';
				remove.addEventListener('click', ()=>{
					this.socket.emit('leaveActivity');
				});
				li.appendChild(remove);
			}
			document.querySelector('.'+activityNo+' .applicantList').appendChild(li);
		})

		this.socket.on('cannotJoinActivity', ()=>{
			alert("이미 액티비티에 들어가 있습니다.");
		})

		this.socket.on('leaveActivity',(activityNo, username)=>{
			console.log(activityNo, username);
			let ul = document.querySelector('.'+activityNo+' .applicantList').childNodes;
			for(let i=0;i<ul.length;i++){
				if(ul[i].innerText === username+"X" ||ul[i].innerText === username) ul[i].parentNode.removeChild(ul[i]);
			}
		})
	}

	appendActivityDom(id, title) {
		console.log(id, title);
		let aNo = "a"+id;

		let template = document.querySelector('.activityTemplate');
		let content = document.importNode(template.content, true);
		content.querySelector('.activity').classList.add(aNo);
		content.querySelector('.activityTitle').innerText = title;

		content.querySelector('.applyActivity').addEventListener('click', ()=>{
			this.socket.emit("applyActivity", aNo);
		});

		document.querySelector('.activityContainer').insertBefore(
			content, document.querySelector('.addActivity')
		);

	}
}

class ChatManager {
	constructor(){
		this.dom = document.querySelector('.chatRoom');
		this.bindEvents();
	}

	bindEvents(){
		var that = this;

		this.dom.querySelector('.minimizeChat').addEventListener('click', ()=>{
			if(that.dom.querySelector('.minimizeChat').classList.contains('close')){
				that.dom.style.bottom = "0";

			}else{
				that.dom.style.bottom = "-400px";
			}
			that.dom.querySelector('.minimizeChat').classList.toggle('close');
		})
	}

	appendMessage(message){
		let p = document.createElement('p');
		p.innerHTML = message;
		this.dom.querySelector('.chatWindow').appendChild(p);
		this.dom.querySelector('.chatWindow').scrollTop = this.dom.querySelector('.chatWindow').scrollHeight;
	}

}



window.onload = ()=>{
	const socket = io('http://localhost:8080');
	const chatManager = new ChatManager();
	const ruleBook = new RuleBook(socket, chatManager);
};