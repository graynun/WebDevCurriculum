"use strict";

var Notepad = function() {
	/* TODO: 그 외에 또 어떤 클래스와 메소드가 정의되어야 할까요? */
	this.noteArea = new NoteArea(),
	this.fileList = new FileList(),
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

	document.addEventListener('remapFileNameEvent', function(event){
		that.mapFileNameEvent();
	})
}

Notepad.prototype.mapFileNameEvent = function(){
	if(this.selectedFile !== undefined) document.querySelector("."+this.selectedFile).classList.add("selected");	

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

	fetch('http://localhost:8080/savefile', {
		method: 'POST',
		headers: new Headers({
			'Content-type': 'application/json;charset=utf-8'
		}),
		body: JSON.stringify(content)
	}).then(function(response){
		if(response.status !== 200) throw new Error("oops? "+response.status+" "+response.statusText);
		return;
	}, function(reject){
		console.log("fetch failed  " + reject);
	}).then(function(resolved){
		console.log("safely saved on fs");
		that.fileList.reloadList();
		var selectHighLighter = new Event('selectedFile');
		document.dispatchEvent(selectHighLighter);
	}, function(reject){
		console.log("saveFile rejected while processing the response with "+ reject);
	})
}


var NoteArea = function(){
	this.textareaDom = document.querySelector(".fileBody");
}

NoteArea.prototype.showFileContent = function(fileName){
	var that = this;

	fetch("http://localhost:8080/readFile?fileName=" + fileName, {method: 'GET'})
	.then(function(response){
		if(response.status !== 200) throw new Error("oops? "+response.status+" "+response.statusText);
		return response.text();
	},function(reject){
		console.log("fetch failed  " + reject);
	}).then(function(fileContent){
		console.log(typeof fileContent);
		that.textareaDom.value = fileContent;
	}, function(reject){
		console.log("showFileContent rejected while processing the response with "+ reject);
	});
}

var FileList = function(){
	this.fileListDom = document.querySelector(".fileList");
	// this.fileNameList = [],
	this.fileList = [];

	this.reloadList();
}

FileList.prototype.reloadList = function(){
	console.log("reloadList of fileList called");
	var that = this;

	fetch('http://localhost:8080/reloadFileList', {method: 'GET'})
	.then(function(response){
		if(response.status !== 200) throw new Error("oops? "+response.status+" "+response.statusText);
		return response.json();
	}, function(reject){
		console.log("fetch failed with error  "+ reject);
	}).then(function(fileNameList){
		console.log(fileNameList);
		that.fileNameList = fileNameList;

		that.fileListDom.innerHTML = "";
		for(var i=0;i<that.fileNameList.length;i++){
			// that.fileListDom.innerHTML += "<li class="+that.fileNameList[i]+">"+that.fileNameList[i]+"</li>";
			var myFile = new File(that.fileNameList[i]);
			that.fileList.push(myFile);
			var dom = document.createElement('div');
			dom.innerHTML = myFile.fileName;
			dom.classList.add(myFile.fileName);

			that.fileListDom.appendChild(dom);
		}	

		// var lieventmapper = new Event('remapFileNameEvent');
		// document.dispatchEvent(lieventmapper);

	}, function(reject){
		console.log("reloadList rejected while processing the response with "+ reject);
	});
}


var File = function(fileName){
	this.dom = document.createElement('div'),
	this.dom.classList.add("fileTab")
	this.dom.innerHTML = fileName,
	document.querySelector('.fileTabContainer').appendChild(this.dom);
	this.fileName = fileName;
}




