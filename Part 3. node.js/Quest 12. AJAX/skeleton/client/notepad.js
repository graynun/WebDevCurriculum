"use strict";

var Notepad = function() {
	/* TODO: 그 외에 또 어떤 클래스와 메소드가 정의되어야 할까요? */
	this.noteArea,
	this.fileList = new FileList();

	this.mapEvent();
};

Notepad.prototype.mapEvent = function(){
	var that = this;

	document.querySelector(".saveFile").onclick = function(){
		that.saveFile();
	}
	document.querySelector(".reloadFileList").onclick = function(){
		that.fileList.reloadList();
	}
}

Notepad.prototype.saveFile = function(){
	var that = this;

	var req = new XMLHttpRequest();

	req.onreadystatechange = function(){
		if(req.readyState === XMLHttpRequest.DONE){
			if(req.status === 200){
				console.log("safely saved on fs");
				that.fileList.reloadList();
			}else{
				console.log("req status is not 200");
			}
		}
	}

	req.open('POST', 'http://localhost:8080/savefile');
	req.setRequestHeader('Content-type', 'application/json;charset=utf-8');
	
	var content = {
		title: "file" + Number(that.fileList.fileNameList.length+1) ,
		content: document.querySelector(".fileBody").value
	};
	
	req.send(JSON.stringify(content));
}


var NoteArea = function(){
	
}

var FileList = function(){
	this.fileNameList = [];
}

FileList.prototype.reloadList = function(){
	console.log("fileList reloadList called");
	var that = this;

	var req = new XMLHttpRequest();
	
	req.onreadystatechange = function(){
		if(req.readyState === XMLHttpRequest.DONE){
			if(req.status === 200){
				document.querySelector(".fileList").innerHTML = "";

				that.fileNameList = JSON.parse(req.responseText);
				for(var i=0;i<that.fileNameList.length;i++){
					document.querySelector(".fileList").innerHTML += "<li>"+that.fileNameList[i]+"</li>";
				}	
			}else{
				console.log("req status is not 200");
			}
		}
	};
	req.open('GET', 'http://localhost:8080/reloadFileList');
	req.send();
}