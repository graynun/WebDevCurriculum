"use strict";

var Notepad = function() {
	/* TODO: 그 외에 또 어떤 클래스와 메소드가 정의되어야 할까요? */
	this.dom = document.querySelector(".notepad");
	this.noteArea = new NoteArea(),
	this.fileList = new FileList(),
	this.fileTab = new FileTab(),
	this.fileArr = {},
	this.selectedFile = undefined;

	this.mapEvents();
	this.loadFiles();
};

Notepad.prototype.mapEvents = function(){
	var that = this;

	document.querySelector(".saveFile").onclick = function(){
		that.saveFile();	
	}

	document.querySelector(".newFile").onclick = function(){
		var deselectFile = new Event('deselectFile');
		that.dom.dispatchEvent(deselectFile);
	}

	this.dom.addEventListener('deselectFile', function(){
		that.fileList.deselectFile();
		that.fileTab.deselectFile();
		that.deselectFile();

		that.noteArea.emptyContentArea();
	})

	this.dom.addEventListener('selectFile', function(event){
		that.selectedFile = event.detail;
		that.noteArea.showFileContent(that.selectedFile);
		that.fileList.selectFile(that.selectedFile);
		that.fileTab.selectFile(that.selectedFile);
	})

	this.dom.addEventListener('removeTab', function(event){
		that.fileTab.removeTab(event.detail);
	})
}

Notepad.prototype.loadFiles = function(){
	var that = this;

	fetch('http://localhost:8080/reloadFileList', {method: 'GET'})
	.then(function(response){
		if(response.status !== 200) throw new Error("oops? "+response.status+" "+response.statusText);
		return response.json();
	}).then(function(fileNameList){
		for(var i=0;i<fileNameList.length;i++){
			if(that.fileArr[fileNameList[i]] === undefined){
				var myFile = new NotepadItem(fileNameList[i]);
				that.fileArr[myFile.fileName]= myFile;
			}
		}	

		that.fileList.emptyList();
		that.fileList.reloadList(that.fileArr);

		if(that.selectedFile !== undefined){
			var selectFile = new CustomEvent('selectFile', {
				detail: that.selectedFile
			});
			that.dom.dispatchEvent(selectFile);
		}
		
	}).catch(function(error){
		console.log("Error happened "+ error.message);
	});
}

Notepad.prototype.selectFile = function(notepadItem){
	this.selectedFile = notepadItem;
}

Notepad.prototype.deselectFile = function(){
	this.selectedFile = undefined;
}

Notepad.prototype.saveFile = function(){
	var that = this;
	
	var content;

	if(this.selectedFile === undefined){
		if(this.fileList.fileListArr.length === 0){
			content ={
				title: "file1" ,
				content: document.querySelector(".fileBody").value	
			};

			var myFile = new NotepadItem("file1");
			that.fileArr.push(myFile);
			this.selectFile(myFile);
		}else{
			content = {
				title: "file" + Number(that.fileList.fileListArr.length+1),
				content: document.querySelector(".fileBody").value
			}
			var myFile = new NotepadItem("file" + Number(that.fileList.fileListArr.length+1));
			that.fileArr[myFile.fileName] = myFile;
			this.selectFile(myFile);
		}
	}else{
		content = {
			title: this.selectedFile.fileName,
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
	}).then(function(resolved){
		console.log("safely saved on fs");
		that.loadFiles();
	}).catch(function(error){
		console.log("Error happened "+ error.message);
	});
}


var NotepadItem = function(fileName){
	this.fileName = fileName,
	this.tabExist = false,
	this.fileListExist = false;
}

var FileList = function(){
	this.fileListDom = document.querySelector(".fileList"),
	this.fileListArr = [];
}

FileList.prototype.reloadList = function(fileArr){
	var that = this;	
	for(var key in fileArr){
		var fileListItem = new FileListItem(fileArr[key]);
		this.fileListArr.push(fileListItem);
		this.fileListDom.appendChild(fileListItem.dom);
	}
}

FileList.prototype.emptyList = function(){
	this.fileListArr = [];
	while(this.fileListDom.firstChild){
		this.fileListDom.removeChild(this.fileListDom.firstChild);
	}
}

FileList.prototype.selectFile = function(selectedFile){
	for(var i=0;i<this.fileListArr.length;i++){
		if(selectedFile === this.fileListArr[i].notepadItem) this.fileListArr[i].beSelected();
	}
}

FileList.prototype.deselectFile = function(){
	for(var i=0;i<this.fileListArr.length;i++){
		if(this.fileListArr[i].selected === true) {
			this.fileListArr[i].beDeselected();
		}
	}
}

var FileListItem = function(notepadItem){
	this.dom,
	this.notepadItem = notepadItem,
	this.fileName = notepadItem.fileName,
	this.selected = false;

	this.createDom();
	this.mapDomEvent();
}

FileListItem.prototype.createDom = function(){
	var dom = document.createElement('li');
	dom.innerHTML = this.fileName;
	dom.classList.add(this.fileName);
	this.dom = dom;
	this.notepadItem.fileListExist = true;
}

FileListItem.prototype.mapDomEvent = function() {
	var that = this;

	this.dom.onclick = function(){
		var deselectFile = new Event('deselectFile', {"bubbles":true});
		that.dom.dispatchEvent(deselectFile);

		var selectFile = new CustomEvent('selectFile', {
			detail: that.notepadItem,
			bubbles: true
		});

		that.dom.dispatchEvent(selectFile);
	};
};

FileListItem.prototype.beSelected = function(){
	this.selected = true;
	this.dom.classList.add('selected');
}

FileListItem.prototype.beDeselected = function(){
	this.selected = false;
	this.dom.classList.remove('selected');
}


var FileTab = function(){
	this.dom = document.querySelector(".fileTabContainer"),
	this.fileTabArr = [];
}

FileTab.prototype.createTab = function(selectedFile){
	var fileTabItem = new FileTabItem(selectedFile);
	this.fileTabArr.push(fileTabItem);
	this.dom.appendChild(fileTabItem.dom);
}

FileTab.prototype.selectFile = function(selectedFile){
	if(selectedFile.tabExist === false) {
		this.createTab(selectedFile);
		this.selectFile(selectedFile);	
	}else{
		for(var i=0;i<this.fileTabArr.length;i++){		
			if(selectedFile === this.fileTabArr[i].notepadItem) {
				this.fileTabArr[i].beSelected();
			}
		}
	}
}

FileTab.prototype.deselectFile = function(){
	for(var i=0;i<this.fileTabArr.length;i++){
		if(this.fileTabArr[i].selected === true) {
			this.fileTabArr[i].beDeselected();
		}
	}
}

FileTab.prototype.removeTab = function(notepadItem){
	notepadItem.tabExist = false;

	for(var i=0;i<this.fileTabArr.length;i++){
		if(this.fileTabArr[i].fileName === notepadItem.fileName) {
			this.dom.removeChild(this.fileTabArr[i].dom);
			this.fileTabArr.splice(i, 1);
		}
	}
}


var FileTabItem = function(selectedFile){
	this.dom,
	this.closeDom,
	this.notepadItem = selectedFile,
	this.fileName = selectedFile.fileName,
	this.selected = false;

	this.createDom();
}

FileTabItem.prototype.createDom = function(){
	var dom = document.createElement('div');
	dom.classList.add(this.fileName);
	dom.innerHTML = this.fileName;
	this.dom = dom;

	var closeDom = document.createElement('span');
	closeDom.classList.add("close");
	closeDom.innerHTML = "X";
	this.closeDom = closeDom;
	this.dom.appendChild(this.closeDom);

	this.notepadItem.tabExist = true;

	this.mapDomEvent();
}

FileTabItem.prototype.mapDomEvent = function() {
	var that = this;

	this.dom.onclick = function(){
		var deselectFile = new Event('deselectFile', {"bubbles":true});
		that.dom.dispatchEvent(deselectFile);

		var selectFile = new CustomEvent('selectFile', {
			bubbles: true,
			detail: that.notepadItem
		});
		that.dom.dispatchEvent(selectFile);
	};

	this.closeDom.addEventListener('click', function(event){
		if(that.selected === true){
			var deselectFile = new Event('deselectFile', {"bubbles":true});
			that.dom.dispatchEvent(deselectFile);
		}
		
		var removeTab = new CustomEvent('removeTab', {
			bubbles: true,
			detail: that.notepadItem
		});
		that.dom.dispatchEvent(removeTab);
	});
};

FileTabItem.prototype.beSelected = function(){
	this.selected = true;
	this.dom.classList.add('selected');
}

FileTabItem.prototype.beDeselected = function(){
	this.selected = false;
	this.dom.classList.remove('selected');
}


var NoteArea = function(){
	this.textareaDom = document.querySelector(".fileBody");
}

NoteArea.prototype.showFileContent = function(selectedFile){
	var that = this;

	fetch("http://localhost:8080/readFile?fileName=" + selectedFile.fileName, {method: 'GET'})
	.then(function(response){
		if(response.status !== 200) throw new Error("oops? "+response.status+" "+response.statusText);
		return response.text();
	}).then(function(fileContent){
		that.textareaDom.value = fileContent;
	}).catch(function(error){
		console.log("Error happened "+ error.message);
	});
}

NoteArea.prototype.emptyContentArea = function(){
	this.textareaDom.value = "";
}
