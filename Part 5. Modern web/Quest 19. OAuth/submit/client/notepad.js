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
	this.loadLastStatus();
};

Notepad.prototype.loadLastStatus = function(){
	var that = this;

	XMLHTTPGetRequestMaker(that, "http://localhost:8080/loadLastStatus", function(that, responseText){
		var lastStatus = JSON.parse(responseText);

		document.querySelector(".fileListArea>h1").innerHTML = lastStatus.user+"'s file list";

		if(lastStatus.lastTabs.length !== 0){
			for(var i=0;i<lastStatus.lastTabs.length;i++){
				for(var filename in that.fileArr){
					if(that.fileArr[filename].fileNo === lastStatus.lastTabs[i]){
						that.fileTab.createTab(that.fileArr[filename]);
						if(lastStatus.lastTabs[i] === lastStatus.lastSelected){
							var selectFile = new CustomEvent('selectFile', {
								detail: that.fileArr[filename],
								bubbles: true
							});
							that.dom.dispatchEvent(selectFile);						
						}
					}
				}
			}
		}
	})
	
}

Notepad.prototype.mapEvents = function(){
	var that = this;

	document.querySelector(".saveFile").onclick = function(){
		that.saveFile();	
	}

	document.querySelector(".newFile").onclick = function(){
		var deselectFile = new Event('deselectFile');
		that.dom.dispatchEvent(deselectFile);
	}

	document.querySelector(".logout").onclick = function(){
		console.log("Logout called");

		var statusInfo = {};

		for(var i=0;i<that.fileTab.fileTabArr.length;i++){
			// currentTabs.push(that.fileTab.fileTabArr[i].fileName);
			var filename = that.fileTab.fileTabArr[i].fileName,
				fileno = that.fileTab.fileTabArr[i].notepadItem.fileNo;

			if(that.fileTab.fileTabArr[i].notepadItem === that.selectedFile){
				statusInfo[filename] = [fileno, true];
			}else{
				statusInfo[filename] = [fileno, false];
			}
		}

		XMLHTTPPostRequestMaker(that, "http://localhost:8080/logout", statusInfo, function(that, resText, responseURL){
			window.location.replace(responseURL);
		});
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
	XMLHTTPGetRequestMaker(this, 'http://localhost:8080/reloadFileList', this.appendList);
}

Notepad.prototype.appendList = function(subject, list){
	var fileNameList = JSON.parse(list);
	
	for (var fileName in fileNameList){
		if(subject.fileArr[fileName] === undefined){
			var myFile = new NotepadItem(fileName, fileNameList[fileName]);
			subject.fileArr[myFile.fileName]= myFile;
		}		
	}

	subject.fileList.emptyList();
	subject.fileList.reloadList(subject.fileArr);

	if(subject.selectedFile !== undefined){
		var selectFile = new CustomEvent('selectFile', {
			detail: subject.selectedFile
		});
		subject.dom.dispatchEvent(selectFile);
	}
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
		}else{
			content = {
				title: "file" + Number(that.fileList.fileListArr.length+1),
				content: document.querySelector(".fileBody").value
			}
			var myFile = new NotepadItem("file" + Number(that.fileList.fileListArr.length+1));
		}

		that.fileArr[myFile.fileName] = myFile;
		this.selectFile(myFile);

	}else{
		content = {
			title: this.selectedFile.fileName,
			content: document.querySelector(".fileBody").value
		};
	}

	XMLHTTPPostRequestMaker(this, 'http://localhost:8080/savefile', content, function(that, resText, resUrl){
		that.reloadListAndSelect(that, JSON.parse(resText).fileNo);
	});
}

Notepad.prototype.reloadListAndSelect = function(subject, fileNo){
	console.log("safely saved on fs");
	console.log(fileNo);
	this.selectedFile.fileNo = fileNo;
	subject.loadFiles();
	var selectHighLighter = new Event('selectedFile');
	document.dispatchEvent(selectHighLighter);
}


var NotepadItem = function(fileName, fileNo){
	this.fileName = fileName,
	this.fileNo = null,
	this.tabExist = false,
	this.fileListExist = false;
	if(fileNo !== null) this.fileNo = fileNo; 
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
	document.querySelector(".fileName").innerHTML = "File name: " + selectedFile.fileName;
	var req = XMLHTTPGetRequestMaker(this, "http://localhost:8080/readFile?fileName=", this.showContent, selectedFile.fileName);
}

NoteArea.prototype.emptyContentArea = function(){
	document.querySelector(".fileName").innerHTML = "New File";
	this.textareaDom.value = "";
}

NoteArea.prototype.showContent = function(subject, content){
	subject.textareaDom.value = content;
}




var XMLHTTPGetRequestMaker = function(subject, url, callback, fileName){
	// subject를 받지 않고 callback을 우아하게 부를 수 있는 방법은 없나?

	var req = new XMLHttpRequest();

	req.onreadystatechange = function(){
		if(req.readyState === XMLHttpRequest.DONE){ 
			if(req.status === 200){
				callback(subject, req.responseText);
			}else{
				console.log("req status is not 200");
			}
		}
	};

	url = fileName === undefined? url : url+fileName;
	req.open('GET', url);
	req.send();
}

var XMLHTTPPostRequestMaker = function(subject, url, content, callback){
// subject를 받지 않고 callback을 우아하게 부를 수 있는 방법은 없나?

	var req = new XMLHttpRequest();

	req.onreadystatechange = function(){
		if(req.readyState === XMLHttpRequest.DONE){
			if(req.status === 200){
				console.log(req.responseText);
				callback(subject, req.responseText, req.responseURL);
			}else{
				console.log("req status is not 200");
			}
		}
	}

	req.open('POST', url);
	req.setRequestHeader('Content-type', 'application/json;charset=utf-8');
	req.send(JSON.stringify(content));	
};

