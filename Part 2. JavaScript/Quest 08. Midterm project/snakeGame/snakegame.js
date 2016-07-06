"use strict";

var PlayArea = function(xSize, ySize){
	this.domObj,
	this.width = xSize,
	this.height = ySize,
	this.snake,
	this.gridBlockArr = {},
	this.apple;

	this.createDom();
	document.body.appendChild(this.domObj);

	this.createBlocks(this.width, this.height);
	this.snake = new Snake(this, 3);
	this.generateApple();
}

PlayArea.prototype.createDom = function(){
	var dom = document.createElement('section');
	dom.classList.add("playArea");

	this.domObj = dom;
}

PlayArea.prototype.createBlocks = function(xSize, ySize){
	for(var i=0;i<ySize;i++){
		for(var j=0;j<xSize;j++){
			var gridBlock = new GridBlock(j,i);
			this.domObj.appendChild(gridBlock.domObj);

			var key = gridBlock.position;
			this.gridBlockArr[key] = gridBlock;
			gridBlock.domObj.innerHTML = key;
		}
	}
}

PlayArea.prototype.generateApple = function(){
	var randX = Math.floor(Math.random() * this.width);
	var randY = Math.floor(Math.random() * this.height);
	var key = randX + "," + randY;

	var selectedBlock = this.gridBlockArr[key];
	if(selectedBlock.isApple === true || selectedBlock.isSnake === true){
		console.log("can't be an apple - something's on the grid block");
		this.generateApple();
	}else{
		selectedBlock.isApple = true;
		selectedBlock.domObj.classList.add("apple");
		this.apple = this.gridBlockArr[key];
	}
}

PlayArea.prototype.isBlockOnGrid = function(blockKey){
	if(this.gridBlockArr[blockKey] === undefined) {
		return false;
	}else{
		return true;
	}
}

PlayArea.prototype.isBlockSnake = function(blockKey){
	if(this.gridBlockArr[blockKey].isSnake === true){
		return true;
	}else{
		return false;
	}
}

PlayArea.prototype.isBlockApple = function(blockKey){
	if(this.gridBlockArr[blockKey] === this.apple){
		return true;
	}else{
		return false;
	}
}

PlayArea.prototype.makeBlockApple = function(blockKey){
	this.gridBlockArr[blockKey].becomeApple();
}

PlayArea.prototype.releaseBlockApple = function(blockKey){
	this.gridBlockArr[blockKey].becomeNormalFromApple();
}

var GridBlock = function(x, y){
	this.domObj,
	this.position = [x, y],
	this.isSnake = false,
	this.isApple = false;

	this.createDom();
}

GridBlock.prototype.createDom = function() {
	var dom = document.createElement('div');
	dom.classList.add("gridBlock");

	this.domObj = dom;
}

GridBlock.prototype.becomeSnake = function(){
	this.isSnake = true;
	this.domObj.classList.add("snake");
}

GridBlock.prototype.becomeNormalFromSnake = function(){
	this.isSnake = false;
	this.domObj.classList.remove("snake");
}

GridBlock.prototype.becomeApple = function(){
	this.isApple = true;
	this.domObj.classList.add("apple");	
}

GridBlock.prototype.becomeNormalFromApple = function(){
	this.isApple = false;
	this.domObj.classList.remove("apple");
}


var Snake = function(playArea, length){
	this.length = length,
	this.blocks = [],
	this.playArea = playArea;

	for(var i=0;i<length;i++){
		var key = i + "," + 0;
		this.makeBlockSnakeTail(key);
	}

	this.bindEvents();
	this.setIntervalRight(500);
}

Snake.prototype.bindEvents = function(){
	var that = this;
	document.addEventListener('keydown', function(event){
		switch (event.keyCode){
			case 38:
				if(that.movingDirection() === "down"){
					console.log("do nothing because it can't go up");
				}else{
					that.moveUp();
				}
				break;
			case 40:
				if(that.movingDirection() === "up"){
					console.log("do nothing because it can't go down");
				}else{
					that.moveDown();
				}
				break;
			case 37:
				if(that.movingDirection() === "right"){
					console.log("do nothing because it can't go left");
				}else{
					that.moveLeft();
				}
				break;
			case 39:
				if(that.movingDirection() === "left"){
					console.log("do nothing because it can't go right");
				}else{
					that.moveRight();
				}
				break;
			default:
				console.log("input is not an arrow key");
		}
	})
}

Snake.prototype.calculateIntervalTime = function(){
	var time;
	if(this.blocks.length < 3){
		time = 500;
	}else if(this.blocks.length < 6){
		time = 450;
	}else if(this.blocks.length < 9){
		time = 400;
	}else if(this.blocks.length < 12){
		time = 350;
	}else if(this.blocks.length < 15){
		time = 300;
	}else if(this.blocks.length < 18){
		time = 250;
	}else{
		time = 200;
	}
	return time;
}

Snake.prototype.setIntervalRight = function(time){
	var that = this;
	this.startMoveRight  = setInterval(function(){
		that.moveRight();
	}, time);
}

Snake.prototype.setIntervalLeft = function(time){
	var that = this;
	this.startMoveLeft  = setInterval(function(){
		that.moveLeft();
	}, time);
}

Snake.prototype.setIntervalUp = function(time){
	var that = this;
	this.startMoveUp  = setInterval(function(){
		that.moveUp();
	}, time);
}

Snake.prototype.setIntervalDown = function(time){
	var that = this;
	this.startMoveDown  = setInterval(function(){
		that.moveDown();
	}, time);
}

Snake.prototype.clearIntervals = function(){
	clearInterval(this.startMoveRight);
	clearInterval(this.startMoveLeft);
	clearInterval(this.startMoveUp);
	clearInterval(this.startMoveDown);
}

Snake.prototype.makeBlockSnakeTail = function(blockKey){
	this.playArea.gridBlockArr[blockKey].becomeSnake();
	this.blocks.push(this.playArea.gridBlockArr[blockKey]);	
}

Snake.prototype.makeBlockSnakeHead = function(blockKey){
	this.playArea.gridBlockArr[blockKey].becomeSnake();
	this.blocks[this.blocks.length] = this.playArea.gridBlockArr[blockKey];	
}

Snake.prototype.removeTailBlock = function(){
	this.blocks[0].becomeNormalFromSnake();
	this.blocks.splice(0, 1);
}

Snake.prototype.movingDirection = function(){
	var headX = this.blocks[this.blocks.length - 1].position[0];
	var headY = this.blocks[this.blocks.length - 1].position[1];
	var neckX = this.blocks[this.blocks.length - 2].position[0];
	var neckY = this.blocks[this.blocks.length - 2].position[1];

	if(headX === neckX + 1){
		return "right";
	}else if(headX === neckX - 1){
		return "left";
	}else if(headY === neckY + 1){
		return "down";
	}else if(headY === neckY - 1){
		return "up";
	}else{
		console.log("can't happen - no direction");
	}
}

Snake.prototype.ableToMove = function(nextBlockKey){
	var tailPosition = this.blocks[0].position[0] + "," + this.blocks[0].position[1];
	if(!this.playArea.isBlockOnGrid(nextBlockKey)){
		this.clearIntervals();
		console.log("reached the right edge of the playArea");
		return false;
	}else if(tailPosition === nextBlockKey){
		return true;
	}else if(this.playArea.isBlockSnake(nextBlockKey)){
		this.clearIntervals();
		console.log("crushed on its own body");
		return false;
	}else{
		return true;
	}
}

Snake.prototype.eatApple = function(nextBlockKey){
	this.playArea.apple.becomeNormalFromApple();
	this.makeBlockSnakeHead(nextBlockKey);
}

Snake.prototype.moveToNext = function(nextBlockKey){
	this.removeTailBlock();
	this.makeBlockSnakeTail(nextBlockKey);	
}

Snake.prototype.moveForward = function(nextBlockKey){
	if(this.playArea.isBlockApple(nextBlockKey)){
		this.eatApple(nextBlockKey);
		this.playArea.generateApple();
	}else{
		this.moveToNext(nextBlockKey);
	}
}

Snake.prototype.moveRight = function(){
	var headX = this.blocks[this.blocks.length - 1].position[0];
	var headY = this.blocks[this.blocks.length - 1].position[1];
	var nextBlockKey = Number(headX+1) + "," + headY;

	this.clearIntervals();
	if(this.ableToMove(nextBlockKey)){
		this.moveForward(nextBlockKey);
		this.setIntervalRight(this.calculateIntervalTime());
	}else{
		console.log("game over");
	}
	
}

Snake.prototype.moveDown = function(){
	var headX = this.blocks[this.blocks.length - 1].position[0];
	var headY = this.blocks[this.blocks.length - 1].position[1];
	var nextBlockKey = headX + "," + Number(headY+1);

	this.clearIntervals();
	if(this.ableToMove(nextBlockKey)){
		this.moveForward(nextBlockKey);
		this.setIntervalDown(this.calculateIntervalTime());
	}else{
		console.log("game over");
	}
	
}

Snake.prototype.moveUp = function(){
	var headX = this.blocks[this.blocks.length - 1].position[0];
	var headY = this.blocks[this.blocks.length - 1].position[1];
	var nextBlockKey = headX + "," + Number(headY-1);

	this.clearIntervals();
	if(this.ableToMove(nextBlockKey)){
		this.moveForward(nextBlockKey);
		this.setIntervalUp(this.calculateIntervalTime());
	}else{
		console.log("game over");
	}
	
}

Snake.prototype.moveLeft = function(){
	var headX = this.blocks[this.blocks.length - 1].position[0];
	var headY = this.blocks[this.blocks.length - 1].position[1];
	var nextBlockKey = Number(headX-1) + "," + headY;

	this.clearIntervals();
	if(this.ableToMove(nextBlockKey)){
		this.moveForward(nextBlockKey);
		this.setIntervalLeft(this.calculateIntervalTime());
	}else{
		console.log("game over");
	}
}