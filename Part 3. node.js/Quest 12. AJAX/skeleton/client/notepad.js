"use strict";

var Notepad = function() {
	/* TODO: 그 외에 또 어떤 클래스와 메소드가 정의되어야 할까요? */
	this.noteArea = new NoteArea(),
	this.fileList = new FileList(this),
	this.selectedFile;

	this.mapEvent();
};

Notepad.prototype.mapEvent = function(){
	var that = this;

	document.querySelector(".saveFile").onclick = function(){
		that.saveFile();	
	}

	document.querySelector(".newFile").onclick = function(){
		if(that.selectedFile !== undefined) document.querySelector("."+that.selectedFile).classList.remove("selected");
		that.selectedFile = undefined;
		document.querySelector(".fileBody").value = "";
	}
}

Notepad.prototype.mapFileNameEvent = function(){
	console.log("ever called mapFileNameEvent?");
	var that = this;

	for(var i=0;i<this.fileList.fileNameList.length;i++){
		document.querySelector("."+that.fileList.fileNameList[i]).onclick = function(){
			if(that.selectedFile !== undefined) document.querySelector("."+that.selectedFile).classList.remove("selected");

			that.selectedFile = this.className;
			this.classList.add("selected");
			that.noteArea.showFileContent(that.selectedFile);
		}
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
	
	var content;

	if(this.selectedFile === undefined){
		if(this.fileList.fileNameList.length === 0){
			content ={
				title: "file1" ,
				content: document.querySelector(".fileBody").value	
			};
			this.selectedFile = "file1";
		}else{
			content = {
				title: "file" + Number(that.fileList.fileNameList.length+1),
				content: document.querySelector(".fileBody").value
			}
			this.selectedFile = "file" + Number(that.fileList.fileNameList.length+1);
		}
	}else{
		content = {
			title: this.selectedFile,
			content: document.querySelector(".fileBody").value
		};
	}
	
	req.send(JSON.stringify(content));
}


var NoteArea = function(){	
}

NoteArea.prototype.showFileContent = function(fileName){
	var that = this;

	var req = new XMLHttpRequest();

	req.onreadystatechange = function(){
		if(req.readyState === XMLHttpRequest.DONE){
			if(req.status === 200){
				console.log(req.responseText);
				document.querySelector(".fileBody").value = req.responseText;
			}else{
				console.log("req status is not 200");
			}
		}
	}

	var url = "http://localhost:8080/readFile?fileName=" + fileName;

	req.open('GET', url);
	req.send();
}

var FileList = function(notepad){
	this.notepad = notepad;
	this.fileNameList = [];

	this.reloadList();
}

FileList.prototype.reloadList = function(){
	console.log("reloadList of fileList called");
	var that = this;

	var req = new XMLHttpRequest();
	
	req.onreadystatechange = function(){
		if(req.readyState === XMLHttpRequest.DONE){ 
			if(req.status === 200){
				document.querySelector(".fileList").innerHTML = "";

				that.fileNameList = JSON.parse(req.responseText);

				for(var i=0;i<that.fileNameList.length;i++){
					document.querySelector(".fileList").innerHTML += "<li class="+that.fileNameList[i]+">"+that.fileNameList[i]+"</li>";
					if(that.fileNameList[i]===that.notepad.selectedFile){
						document.querySelector("."+that.notepad.selectedFile).classList.add("selected");
					}
				}	

				that.notepad.mapFileNameEvent();

			}else{
				console.log("req status is not 200");
			}
		}
	};

	req.open('GET', 'http://localhost:8080/reloadFileList');
	req.send();
}







