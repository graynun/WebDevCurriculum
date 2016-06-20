"use strict";

var input = prompt("Enter a number");

var linenum = Number(input);

if(linenum === NaN){
	console.log("The input was not a number");
}else{
	printStar(linenum);
	// console.log(linenum);

}

function printStar(num){
	// for(var i=1; i<=num; i++){
	// 	// var str = drawSpace(num-i) + drawStar(2*i - 1);
	// 	var str = makeLine(i, num);
	// 	console.log(str);
	// }

	console.log(makeWholeLine(num));
}

// function drawStar(num){
// 	var str = "";
// 	for(var i=1; i<=num; i++){
// 		str += "*";
// 	}
// 	return str;
// }

// function drawSpace(num){
// 	var str = "";
// 	for(var i=0; i<num; i++){
// 		str += " ";
// 	}
// 	return str;
// }

function makeEachLine(num, input) {
	var str = "";
	for(var i=input; i>num; i--){
		str += " ";
	}
	for(var i=1; i<2*num; i++){
		str += "*";
	}
	return str;
}

function makeWholeLine(num) {
	var str = ""
	for(var i=1; i<=num; i++){
		str += makeEachLine(i, num) + "\n";
	}
	return str;
}