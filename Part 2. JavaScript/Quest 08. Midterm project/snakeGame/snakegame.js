"use strict";

var PlayArea = function(xSize, ySize){
	this.domObj,
	this.width = xSize,
	this.height = ySize,
	this.gridBlockArr = [];

	this.createDom();
	document.body.appendChild(this.domObj);

	for(var i=0;i<ySize;i++){
		this.gridBlockArr[i] = [];
		
		for(var j=0;j<xSize;j++){
			var gridBlock = new GridBlock(i,j);
			this.domObj.appendChild(gridBlock.domObj);
			this.gridBlockArr[i][j] = gridBlock;
		}
	}
}

PlayArea.prototype.createDom = function(){
	var dom = document.createElement('section');
	dom.classList.add("playArea");

	this.domObj = dom;
}


var GridBlock = function(y, x){
	this.domObj,
	this.position = [y, x],
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
		this.placeOnGrid(0,i);
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
		console.log("move down?");
	}, 500);
}

Snake.prototype.placeOnGrid = function(y,x){
	this.playArea.gridBlockArr[y][x].isSnake = true;
	this.playArea.gridBlockArr[y][x].domObj.classList.add("snake");

	this.blocks.push(this.playArea.gridBlockArr[y][x]);	
}

Snake.prototype.clearIntervals = function(){
	clearInterval(this.startMoveRight);
	clearInterval(this.startMoveLeft);
	clearInterval(this.startMoveUp);
	clearInterval(this.startMoveDown);
}

Snake.prototype.moveRight = function(){
	var headX = this.blocks[this.blocks.length - 1].position[1];
	var headY = this.blocks[this.blocks.length - 1].position[0];
	var neckX = this.blocks[this.blocks.length - 2].position[1];



	if(headX >= this.playArea.gridBlockArr[headY].length - 1){
		this.clearIntervals();
		console.log("reached the right edge of the playArea");
	}else if(headX === neckX - 1){
		console.log("do nothing because it can't go right");
	}else if(this.playArea.gridBlockArr[headY][headX+1].isSnake === true){
		this.clearIntervals();
		console.log("crushed on its own body");
	}else{
		this.blocks[0].isSnake = false;
		this.blocks[0].domObj.classList.remove("snake");
		this.blocks.splice(0, 1);

		this.placeOnGrid(headY, headX+1);
	}
}

Snake.prototype.moveDown = function(){
	// console.log("moveDown called?");
	var headX = this.blocks[this.blocks.length - 1].position[1];
	var headY = this.blocks[this.blocks.length - 1].position[0];
	var neckY = this.blocks[this.blocks.length - 2].position[0];

	//console.log(this.playArea.gridBlockArr[headY+1][headX].isSnake);

	if(headY >= this.playArea.gridBlockArr.length - 1){
		this.clearIntervals();
		console.log("reached at the bottom of the playArea");
	}else if(headY === neckY-1){
		console.log("do nothing because it can't go down");
	}else if(this.playArea.gridBlockArr[headY+1][headX].isSnake === true){
		this.clearIntervals();
		console.log("crushed on its own body");
	}else{
		this.blocks[0].isSnake = false;
		this.blocks[0].domObj.classList.remove("snake");
		this.blocks.splice(0, 1);

		this.placeOnGrid(headY+1, headX);
	}
	
}

Snake.prototype.moveUp = function(){
	var headX = this.blocks[this.blocks.length - 1].position[1];
	var headY = this.blocks[this.blocks.length - 1].position[0];
	var neckY = this.blocks[this.blocks.length - 2].position[0];



	//console.log(this.playArea.gridBlockArr[headY-1][headX].isSnake);


	if(headY < 1){
		this.clearIntervals();
		console.log("reached at the top of the playArea");
	}else if(headY === neckY+1){
		console.log("do nothing because it can't go up");
	}else if(this.playArea.gridBlockArr[headY-1][headX].isSnake === true){
		this.clearIntervals();
		console.log("crushed on its own body");
	}else{
		this.blocks[0].isSnake = false;
		this.blocks[0].domObj.classList.remove("snake");
		this.blocks.splice(0, 1);

		this.placeOnGrid(headY-1, headX);
	}
}

Snake.prototype.moveLeft = function(){
	var headX = this.blocks[this.blocks.length - 1].position[1];
	var headY = this.blocks[this.blocks.length - 1].position[0];
	var neckX = this.blocks[this.blocks.length - 2].position[1];

	//console.log(this.playArea.gridBlockArr[headY][headX-1].isSnake);
	
	if(headX < 1){
		this.clearIntervals();
		console.log("reached at the left edge of the playArea");
	}else if(headX === neckX+1){
		console.log("do nothing because it can't go left");
	}else if(this.playArea.gridBlockArr[headY][headX-1].isSnake === true){
		this.clearIntervals();
		console.log("crushed on its own body");
	}else {
		this.blocks[0].isSnake = false;
		this.blocks[0].domObj.classList.remove("snake");
		this.blocks.splice(0, 1);

		this.placeOnGrid(headY, headX-1);
	}
		
}