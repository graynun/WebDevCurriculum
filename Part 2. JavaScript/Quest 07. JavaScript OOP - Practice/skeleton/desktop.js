var Desktop = function() {
	/* TODO: Desktop 클래스는 어떤 멤버함수와 멤버변수를 가져야 할까요? */
	this.domObj = document.querySelector(".desktop"),
	this.memberIcons = [],
	this.memberWindow = [],
	this.movingItem = null;
};

Desktop.prototype.bindEvent = function(){
	var that = this;

	this.domObj.addEventListener("selectMovingItem", function(){
		if(event.target.classList[0] === "icon" || event.target.classList[0] === "folder") {
			for(var i=0; i<that.memberIcons.length;i++) {
				if(that.memberIcons[i].name === event.target.classList[1]) {
					that.selectMovingItem(that.memberIcons[i]);
				}
			}
		}else {
			for(var i=0; i<that.memberWindow.length;i++) {
				if(that.memberWindow[i].name === event.target.classList[1]) {
					that.selectMovingItem(that.memberWindow[i]);
				}
			}
		}
	});

	this.domObj.addEventListener('mousemove', function(event){
		if(that.movingItem !== null) that.movingItem.movePosition(event);
	})

	this.domObj.addEventListener("deselectMovingItem", function(){
		that.movingItem = null;
	})

	this.domObj.addEventListener("createWindow", function(){
		for(var i=0; i<that.memberIcons.length;i++){
			if(that.memberIcons[i].name === event.target.classList[1]){
				that.createWindow(that.memberIcons[i]);
			}
		}
	})
}

Desktop.prototype.createIcon = function(name){
	var newIcon = new Icon(name);
	newIcon.bindEvent();
	newIcon.setPosition(200, 400);

	this.memberIcons.push(newIcon);
	this.domObj.appendChild(newIcon.domObj);
}

Desktop.prototype.createFolder = function(name){
	var newFolder = new Folder(name);
	newFolder.bindEvent();
	newFolder.setPosition(400, 200);

	this.memberIcons.push(newFolder);
	this.domObj.appendChild(newFolder.domObj);
}

Desktop.prototype.createWindow = function(icon){
	var newWindow = new Window(icon.name, icon);
	newWindow.bindEvent();
	newWindow.setPosition(200, 200);	

	this.memberWindow.push(newWindow);
	this.domObj.appendChild(newWindow.domObj);
}

Desktop.prototype.selectMovingItem = function(item){
	this.movingItem = item;
}

Desktop.prototype.deselectMovingItem = function(){
	this.movingItem = null;
}


var Icon = function(name) {
	/* TODO: Icon 클래스는 어떤 멤버함수와 멤버변수를 가져야 할까요? */
	var domObj = document.createElement('div');
	domObj.classList.add("icon");
	domObj.classList.add(name);
	domObj.innerHTML = name;

	this.domObj = domObj,
	this.name = name,
	this.position = [0,0],
	this.offset = [0,0];
};

Icon.prototype.bindEvent = function(){
	var that = this;

	var selectMovingItem = new Event("selectMovingItem", {"bubbles": true});
	var deselectMovingItem = new Event("deselectMovingItem", {"bubbles": true});

	this.domObj.addEventListener("selectMovingItem", function(){
		console.log("selectMovingItem on " + that.name);
	})

	this.domObj.addEventListener("deselectMovingItem", function(){
		console.log("deselectMovingItem on " + that.name);
	})

	this.domObj.addEventListener('mousedown', function(event){
		that.setOffset(event);
		this.dispatchEvent(selectMovingItem);
	})
	this.domObj.addEventListener('mouseup', function(){
		this.dispatchEvent(deselectMovingItem);
	})
}

Icon.prototype.setPosition = function(x,y){
	this.position[0] = x;
	this.position[1] = y;

	this.domObj.style.left = x + "px";
	this.domObj.style.top = y + "px";
}

Icon.prototype.setOffset = function(event){
	this.offset[0] = event.clientX - this.domObj.offsetLeft;
	this.offset[1] = event.clientY - this.domObj.offsetTop;
}

Icon.prototype.movePosition = function(event){
	this.setPosition(event.clientX - this.offset[0], event.clientY - this.offset[1]);
}


var Folder = function(name) {
	/* TODO: Folder 클래스는 어떤 멤버함수와 멤버변수를 가져야 할까요? */
	var domObj = document.createElement('div');
	domObj.classList.add("folder");
	domObj.classList.add(name);
	domObj.innerHTML = name;

	this.domObj = domObj,
	this.name = name,
	this.position = [0,0],
	this.offset = [0,0];
};

Folder.prototype.bindEvent = function(){
	var that = this;

	var selectMovingItem = new Event("selectMovingItem", {"bubbles": true});
	var deselectMovingItem = new Event("deselectMovingItem", {"bubbles": true});
	var createWindow = new Event("createWindow", {"bubbles": true});

	this.domObj.addEventListener("selectMovingItem", function(){
		console.log("selectMovingItem on " + that.name);
	})

	this.domObj.addEventListener("deselectMovingItem", function(){
		console.log("deselectMovingItem on " + that.name);
	})

	this.domObj.addEventListener('mousedown', function(event){
		that.setOffset(event);
		this.dispatchEvent(selectMovingItem);
	})
	this.domObj.addEventListener('mouseup', function(){
		this.dispatchEvent(deselectMovingItem);
	})
	this.domObj.addEventListener('dblclick', function(){
		this.dispatchEvent(createWindow);
	})
}

Folder.prototype.setPosition = Icon.prototype.setPosition;
Folder.prototype.setOffset = Icon.prototype.setOffset;
Folder.prototype.movePosition = Icon.prototype.movePosition;


var Window = function(name, icon) {
	/* TODO: Window 클래스는 어떤 멤버함수와 멤버변수를 가져야 할까요? */
	var domObj = document.createElement('div');
	domObj.classList.add("window");
	domObj.classList.add(name);
	domObj.innerHTML = icon.name;

	this.domObj = domObj,
	this.position = [0,0],
	this.offset = [0,0],
	this.connectedIcon = icon,
	this.name = icon.name;
};

Window.prototype.bindEvent = Icon.prototype.bindEvent;

Window.prototype.setPosition = Icon.prototype.setPosition;
Window.prototype.setOffset = Icon.prototype.setOffset;
Window.prototype.movePosition = Icon.prototype.movePosition;
