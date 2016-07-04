"use strict";

var PlayArea = function(xSize, ySize){
	this.domObj,
	this.width = xSize,
	this.height = ySize,
	this.gridBlockArr = {};

	this.createDom();
	document.body.appendChild(this.domObj);

	for(var i=0;i<ySize;i++){
		for(var j=0;j<xSize;j++){
			var gridBlock = new GridBlock(j,i);
			this.domObj.appendChild(gridBlock.domObj);

			var key = gridBlock.position;
			this.gridBlockArr[key] = gridBlock;
		}
	}
}

PlayArea.prototype.createDom = function(){
	var dom = document.createElement('section');
	dom.classList.add("playArea");

	this.domObj = dom;
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


var Snake = function(playArea, length){
	this.length = length,
	this.blocks = [],
	this.playArea = playArea;

	for(var i=0;i<length;i++){
		this.placeOnGrid(i,0);
	}

	this.setIntervalRight();
}

Snake.prototype.setIntervalRight = function(){
	this.startMoveRight  = setInterval(function(){
		snake.moveRight();
	}, 500);
}

Snake.prototype.setIntervalLeft = function(){
	this.startMoveLeft  = setInterval(function(){
		snake.moveLeft();
	}, 500);
}

Snake.prototype.setIntervalUp = function(){
	this.startMoveUp  = setInterval(function(){
		snake.moveUp();
	}, 500);
}

Snake.prototype.setIntervalDown = function(){
	this.startMoveDown  = setInterval(function(){
		snake.moveDown();
	}, 500);
}

Snake.prototype.placeOnGrid = function(x,y){
	var key = x+","+y
	this.playArea.gridBlockArr[key].isSnake = true;
	this.playArea.gridBlockArr[key].domObj.classList.add("snake");

	this.blocks.push(this.playArea.gridBlockArr[key]);	
}

Snake.prototype.clearIntervals = function(){
	clearInterval(this.startMoveRight);
	clearInterval(this.startMoveLeft);
	clearInterval(this.startMoveUp);
	clearInterval(this.startMoveDown);
}

Snake.prototype.moveRight = function(){
	var headX = this.blocks[this.blocks.length - 1].position[0];
	var headY = this.blocks[this.blocks.length - 1].position[1];
	var neckX = this.blocks[this.blocks.length - 2].position[0];

	var nextBlockKey = Number(headX+1) + "," + headY;

	if(headX >= this.playArea.width - 1){
		this.clearIntervals();
		console.log("reached the right edge of the playArea");
	}else if(headX === neckX - 1){
		console.log("do nothing because it can't go right");
		this.setIntervalRight();
	}else if(this.playArea.gridBlockArr[nextBlockKey].isSnake === true){
		this.clearIntervals();
		console.log("crushed on its own body");
	}else{
		this.blocks[0].isSnake = false;
		this.blocks[0].domObj.classList.remove("snake");
		this.blocks.splice(0, 1);

		this.placeOnGrid(headX+1, headY);
	}
}

Snake.prototype.moveDown = function(){
	// console.log("moveDown called?");
	var headX = this.blocks[this.blocks.length - 1].position[0];
	var headY = this.blocks[this.blocks.length - 1].position[1];
	var neckY = this.blocks[this.blocks.length - 2].position[1];

	var nextBlockKey = headX + "," + Number(headY+1);

	//console.log(this.playArea.gridBlockArr[headY+1][headX].isSnake);

	if(headY >= this.playArea.height - 1){
		this.clearIntervals();
		console.log("reached at the bottom of the playArea");
	}else if(headY === neckY-1){
		console.log("do nothing because it can't go down");
		this.setIntervalDown();
	}else if(this.playArea.gridBlockArr[nextBlockKey].isSnake === true){
		this.clearIntervals();
		console.log("crushed on its own body");
	}else{
		this.blocks[0].isSnake = false;
		this.blocks[0].domObj.classList.remove("snake");
		this.blocks.splice(0, 1);

		this.placeOnGrid(headX, headY+1);
	}
	
}

Snake.prototype.moveUp = function(){
	var headX = this.blocks[this.blocks.length - 1].position[0];
	var headY = this.blocks[this.blocks.length - 1].position[1];
	var neckY = this.blocks[this.blocks.length - 2].position[1];

	var nextBlockKey = headX + "," + Number(headY-1);

	if(headY < 1){
		this.clearIntervals();
		console.log("reached at the top of the playArea");
	}else if(headY === neckY+1){
		this.setIntervalUp();
		console.log("do nothing because it can't go up");
	}else if(this.playArea.gridBlockArr[nextBlockKey].isSnake === true){
		this.clearIntervals();
		console.log("crushed on its own body");
	}else{
		this.blocks[0].isSnake = false;
		this.blocks[0].domObj.classList.remove("snake");
		this.blocks.splice(0, 1);

		this.placeOnGrid(headX, headY-1);
	}
}

Snake.prototype.moveLeft = function(){
	var headX = this.blocks[this.blocks.length - 1].position[0];
	var headY = this.blocks[this.blocks.length - 1].position[1];
	var neckX = this.blocks[this.blocks.length - 2].position[0];

	var nextBlockKey = Number(headX-1) + "," + headY;

	if(headX < 1){
		this.clearIntervals();
		console.log("reached at the left edge of the playArea");
	}else if(headX === neckX+1){
		this.setIntervalLeft();
		console.log("do nothing because it can't go left");
	}else if(this.playArea.gridBlockArr[nextBlockKey].isSnake === true){
		this.clearIntervals();
		console.log("crushed on its own body");
	}else {
		this.blocks[0].isSnake = false;
		this.blocks[0].domObj.classList.remove("snake");
		this.blocks.splice(0, 1);

		this.placeOnGrid(headX-1, headY);
	}
		
}