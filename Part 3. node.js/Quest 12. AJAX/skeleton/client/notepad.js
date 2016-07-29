var Notepad = function() {
	/* TODO: 그 외에 또 어떤 클래스와 메소드가 정의되어야 할까요? */
	this.noteArea,
	this.fileList;

	this.mapEvent();
};

Notepad.prototype.mapEvent = function(){
	var that = this;

	document.querySelector(".saveFile").onclick = function(){
		that.saveFile();
	}
}

Notepad.prototype.saveFile = function(){
	var req = new XMLHttpRequest();
	// req.onload
	// req.onerror

	// req.header
	req.open('POST', 'http://localhost:8080/savefile');
	req.setRequestHeader('Content-type', 'text/javscript charset=utf-8');
	console.log(document.querySelector(".fileBody").value);
	var content = {
		'title': "file01",
		'content': document.querySelector(".fileBody").value
	};
	console.log(content);
	req.send(JSON.stringify(content));
}


var NoteArea = function(){
	
}

var FileList = function(){

}