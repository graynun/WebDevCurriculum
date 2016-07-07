"use strict";

var RuleBook = function(){
	this.playArea,
	this.snake,
	this.apple;	

	this.playArea = new PlayArea(13, 10);
	this.snake = new Snake(this);

	for(var i=0;i<3;i++){
		var key = i + "," + 0;
		this.makeBlockSnakeTail(key);
	}

	this.generateApple();
	this.snake.move();	
}

RuleBook.prototype.makeBlockSnakeTail = function(blockKey){
	this.playArea.gridBlockArr[blockKey].becomeSnake();
	this.snake.blocks.push(this.playArea.gridBlockArr[blockKey]);	
}

RuleBook.prototype.makeBlockSnakeHead = function(blockKey){
	this.playArea.gridBlockArr[blockKey].becomeSnake();
	this.snake.blocks[this.snake.blocks.length] = this.playArea.gridBlockArr[blockKey];	
}

RuleBook.prototype.isBlockOnGrid = function(blockKey){
	if(this.playArea.gridBlockArr[blockKey] === undefined) {
		return false;
	}else{
		return true;
	}
}

RuleBook.prototype.isBlockSnake = function(blockKey){
	if(this.playArea.gridBlockArr[blockKey].isSnake === true){
		return true;
	}else{
		return false;
	}
}

RuleBook.prototype.isBlockApple = function(blockKey){
	if(this.playArea.gridBlockArr[blockKey] === this.apple){
		return true;
	}else{
		return false;
	}
}

RuleBook.prototype.makeBlockApple = function(blockKey){
	this.playArea.gridBlockArr[blockKey].becomeApple();
}

RuleBook.prototype.removeAppleBlock = function(blockKey){
	this.playArea.gridBlockArr[blockKey].becomeNormalFromApple();
}

RuleBook.prototype.generateApple = function(){
	var randX = Math.floor(Math.random() * this.playArea.width);
	var randY = Math.floor(Math.random() * this.playArea.height);
	var key = randX + "," + randY;

	var selectedBlock = this.playArea.gridBlockArr[key];
	if(selectedBlock.isApple === true || selectedBlock.isSnake === true){
		console.log("can't be an apple - something's on the grid block");
		this.generateApple();
	}else{
		selectedBlock.becomeApple();
		this.apple = this.playArea.gridBlockArr[key];
	}
}

RuleBook.prototype.calculateIntervalTime = function(){
	var time;

	var snakeLength = this.snake.blocks.length || 3;

	if(snakeLength < 4){
		time = 500;
	}else if(snakeLength < 7){
		time = 450;
	}else if(snakeLength < 10){
		time = 400;
	}else if(snakeLength < 13){
		time = 350;
	}else if(snakeLength < 16){
		time = 300;
	}else if(snakeLength < 19){
		time = 250;
	}else if(snakeLength < 22){
		time = 200;
	}else if(snakeLength < 25){
		time = 150;
	}else{
		time = 100;
	}

	console.log(time);
	return time;
}



RuleBook.prototype.canSnakeMove = function(nextBlockKey){
	var tailPosition = this.snake.blocks[0].position[0] + "," + this.snake.blocks[0].position[1];
	if(!this.isBlockOnGrid(nextBlockKey)){
		console.log("reached the right edge of the playArea");
		return false;
	}else if(tailPosition === nextBlockKey){
		return true;
	}else if(this.isBlockSnake(nextBlockKey)){
		this.snake.clearIntervals();
		console.log("crushed on its own body");
		return false;
	}else{
		return true;
	}
}


var PlayArea = function(xSize, ySize){
	this.domObj,
	this.width = xSize,
	this.height = ySize,
	this.gridBlockArr = {},
	this.apple;

	this.createDom();
	document.body.appendChild(this.domObj);

	this.createBlocks(this.width, this.height);
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
		}
	}
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


var Snake = function(ruleBook){
	this.blocks = [],
	this.ruleBook = ruleBook,
	this.direction = "right";

	this.bindEvents();
}

Snake.prototype.bindEvents = function(){
	var that = this;
	document.addEventListener('keydown', function(event){
		switch (event.keyCode){
			case 38:
				if(that.direction === "down"){
					console.log("do nothing because it can't go up");
				}else{
					that.direction = "up";
				}
				break;
			case 40:
				if(that.direction === "up"){
					console.log("do nothing because it can't go down");
				}else{
					that.direction = "down";
				}
				break;
			case 37:
				if(that.direction === "right"){
					console.log("do nothing because it can't go left");
				}else{
					that.direction = "left";
				}
				break;
			case 39:
				if(that.direction === "left"){
					console.log("do nothing because it can't go right");
				}else{
					that.direction = "right";
				}
				break;
			default:
				console.log("input is not an arrow key");
		}
	})
}

Snake.prototype.generateNextBlockKey = function(){
	var headX = this.blocks[this.blocks.length - 1].position[0];
	var headY = this.blocks[this.blocks.length - 1].position[1];
	var direction = this.direction;
	var nextBlockKey;
	
	switch (direction){
		case "up":
			nextBlockKey = headX + "," + Number(headY-1);
			break;
		case "down":
			nextBlockKey = headX + "," + Number(headY+1);
			break;
		case "left":
			nextBlockKey = Number(headX-1) + "," + headY;
			break;
		case "right":
			nextBlockKey = Number(headX+1) + "," + headY;
			break;
		default:
			console.log("something's wrong - input not an direction");
	}
	return nextBlockKey;
}

Snake.prototype.move = function(){
	var nextBlockKey = this.generateNextBlockKey();
	
	if(this.ruleBook.canSnakeMove(nextBlockKey)){
		if(this.ruleBook.isBlockApple(nextBlockKey)){
			this.eatApple(nextBlockKey);
			this.ruleBook.generateApple();
		}else{
			this.moveToNext(nextBlockKey);
		}
	}else{
		clearTimeout(this.snakeTimeout);
		console.log("game over");
		return;
	}

	var that = this;
	var time = this.ruleBook.calculateIntervalTime();
	this.snakeTimeout = setTimeout(function(){
		that.move()},
	time);
}

Snake.prototype.eatApple = function(nextBlockKey){
	this.ruleBook.apple.becomeNormalFromApple();
	this.ruleBook.makeBlockSnakeHead(nextBlockKey);
}

Snake.prototype.moveToNext = function(nextBlockKey){
	this.removeTailBlock();
	this.ruleBook.makeBlockSnakeTail(nextBlockKey);	
}

Snake.prototype.removeTailBlock = function(){
	this.blocks[0].becomeNormalFromSnake();
	this.blocks.splice(0, 1);
}