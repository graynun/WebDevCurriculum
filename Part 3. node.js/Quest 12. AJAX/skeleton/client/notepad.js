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

	req.onreadychangestate = function(){
		if(req.readyState === XMLHttpRequest.DONE){
			if(req.status === 200){
				that.fileList.reloadList();
			}else{
				console.log("req status is not 200");
			}
		}
	}

	req.open('POST', 'http://localhost:8080/savefile');
	req.setRequestHeader('Content-type', 'application/json;charset=utf-8');
	
	var content = {
		title: "file01",
		content: document.querySelector(".fileBody").value
	};
	
	req.send(JSON.stringify(content));
}


var NoteArea = function(){
	
}

var FileList = function(){

}

FileList.prototype.reloadList = function(){
	var req = new XMLHttpRequest();

	req.onreadystatechange = function(){
		if(req.readyState === XMLHttpRequest.DONE){
			if(req.status === 200){
				console.log(req.responseText);
				document.querySelector(".fileList").innerHTML += req.responseText;
			}else{
				console.log("req status is not 200");
			}
		}
		
	};

	req.open('GET', 'http://localhost:8080/reloadFileList');
	req.send();
}