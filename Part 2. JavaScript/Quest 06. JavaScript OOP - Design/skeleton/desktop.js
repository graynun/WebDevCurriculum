var Desktop = function(numberOfIcons, numberOfFolders) {
	/* TODO: Desktop 클래스는 어떤 멤버함수와 멤버변수를 가져야 할까요? */
	var domObj,
		memberIcons;

	this.createIcon = function(){
	},
	this.createFolder = function(){
	}
};

var Icon = function(name) {
	/* TODO: Icon 클래스는 어떤 멤버함수와 멤버변수를 가져야 할까요? */
	var domObj,
		position;
	this.name = name;

	this.moveLocation = function(){
	}
};

var Folder = function(name) {
	/* TODO: Folder 클래스는 어떤 멤버함수와 멤버변수를 가져야 할까요? */
	var domObj,
		position;
	this.name = name;

	this.moveLocation = function(){
	},
	this.onDoubleClick = function(){
	}
};

var Window = function(icon) {
	/* TODO: Window 클래스는 어떤 멤버함수와 멤버변수를 가져야 할까요? */
	var domObj,
		position,
		width,
		height,
		connectedIcon = icon,
		name = icon.name;

	this.moveLocation = function(){
	}
};
