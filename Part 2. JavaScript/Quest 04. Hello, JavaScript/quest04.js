"use strict";

var input = prompt("Enter a number");

var linenum = parseInt(input);

if(linenum === NaN){
	console.log("The input was not a number");
}else{
	printStar(linenum);
}

function printStar(num){
	var linenum = num;
	for(var i=1; i<=num; i++){
		var str = drawSpace(num-i) + drawStar(2*i - 1);
		console.log(str);
	}
}

function drawStar(num){
	var str = "";
	for(var i=1; i<=num; i++){
		str += "*";
	}
	return str;
}

function drawSpace(num){
	var str = "";
	for(var i=0; i<num; i++){
		str += " ";
	}
	return str;
}