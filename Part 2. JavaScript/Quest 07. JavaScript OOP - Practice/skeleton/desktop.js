var Desktop = function() {
	/* TODO: Desktop 클래스는 어떤 멤버함수와 멤버변수를 가져야 할까요? */
	this.domObj = document.querySelector(".desktop"),
	this.memberIcons = [],
	this.memberWindow = [],
	this.movingItem = null;
};

Desktop.prototype.bindEvent = function(){
	var that = this;

	this.domObj.addEventListener('mousemove', function(event){
		if(that.movingItem !== null) that.movingItem.movePosition(event);
	})
}

Desktop.prototype.createIcon = function(name){
	var newIcon = new Icon(name);
	this.memberIcons.push(newIcon);
	this.domObj.appendChild(newIcon.domObj);

	var that = this;

	newIcon.domObj.addEventListener("selectMovingItem", function(){
		that.selectMovingItem(newIcon);
	})
	newIcon.domObj.addEventListener("deselectMovingItem", function(){
		that.deselectMovingItem();
	})
}

Desktop.prototype.createFolder = function(name){
	var newFolder = new Folder(name);
	this.memberIcons.push(newFolder);
	this.domObj.appendChild(newFolder.domObj);

	var that = this;

	newFolder.domObj.addEventListener("selectMovingItem", function(){
		that.selectMovingItem(newFolder);
	})
	newFolder.domObj.addEventListener("deselectMovingItem", function(){
		that.deselectMovingItem();
	})
	newFolder.domObj.addEventListener("createWindow", function(){
		that.createWindow(newFolder);
	})
}

Desktop.prototype.createWindow = function(icon){
	var newWindow = new Window(icon.name, icon);
	this.memberWindow.push(newWindow);
	this.domObj.appendChild(newWindow.domObj);

	var that = this;

	newWindow.domObj.addEventListener("selectMovingItem", function(){
		that.selectMovingItem(newWindow);
	})
	newWindow.domObj.addEventListener("deselectMovingItem", function(){
		that.deselectMovingItem();
	})
}

Desktop.prototype.selectMovingItem = function(item){
	this.movingItem = item;
}

Desktop.prototype.deselectMovingItem = function(){
	this.movingItem = null;
}


var Icon = function(name) {
	/* TODO: Icon 클래스는 어떤 멤버함수와 멤버변수를 가져야 할까요? */
	this.domObj,
	this.name = name,
	this.position = [0,0],
	this.offset = [0,0];

	this.setDom(name);
	this.bindEvent();
	this.setPosition(200, 400);
};

Icon.prototype.bindEvent = function(){
	var that = this;

	this.domObj.addEventListener('mousedown', function(event){
		that.setOffset(event);
		that.fireEvent("selectMovingItem");
	})
	this.domObj.addEventListener('mouseup', function(){
		that.fireEvent("deselectMovingItem");
	})
}

Icon.prototype.setDom = function(name){
	var domObj = document.createElement('div');
	domObj.classList.add("icon");
	domObj.classList.add(name);
	domObj.innerHTML = name;

	this.domObj = domObj;
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

Icon.prototype.fireEvent = function(eventName){
	var event = new Event(eventName);
	this.domObj.dispatchEvent(event);
}

var Folder = function(name) {
	/* TODO: Folder 클래스는 어떤 멤버함수와 멤버변수를 가져야 할까요? */
	this.domObj,
	this.name = name,
	this.position = [0,0],
	this.offset = [0,0];

	this.setDom(name);
	this.bindEvent();
	this.setPosition(400, 200);
};

Folder.prototype.bindEvent = function(){
	var that = this;

	this.domObj.addEventListener('mousedown', function(event){
		that.setOffset(event);
		that.fireEvent("selectMovingItem");
	})
	this.domObj.addEventListener('mouseup', function(){
		that.fireEvent("deselectMovingItem");
	})
	this.domObj.addEventListener('dblclick', function(){
		that.fireEvent("createWindow");
	})
}

Folder.prototype.setDom = function(name){
	var domObj = document.createElement('div');
	domObj.classList.add("folder");
	domObj.classList.add(name);
	domObj.innerHTML = name;

	this.domObj = domObj;
}

Folder.prototype.setPosition = Icon.prototype.setPosition;
Folder.prototype.setOffset = Icon.prototype.setOffset;
Folder.prototype.movePosition = Icon.prototype.movePosition;
Folder.prototype.fireEvent = Icon.prototype.fireEvent;

var Window = function(name, icon) {
	/* TODO: Window 클래스는 어떤 멤버함수와 멤버변수를 가져야 할까요? */
	this.domObj,
	this.position = [0,0],
	this.offset = [0,0],
	this.connectedIcon = icon,
	this.name = icon.name;

	this.setDom(name);
	this.bindEvent();
	this.setPosition(400, 400);
};

Window.prototype.setDom = function(name){
	var domObj = document.createElement('div');
	domObj.classList.add("window");
	domObj.classList.add(name);
	domObj.innerHTML = name;

	this.domObj = domObj;
}

Window.prototype.bindEvent = Icon.prototype.bindEvent;
Window.prototype.setPosition = Icon.prototype.setPosition;
Window.prototype.setOffset = Icon.prototype.setOffset;
Window.prototype.movePosition = Icon.prototype.movePosition;
Window.prototype.fireEvent = Icon.prototype.fireEvent;