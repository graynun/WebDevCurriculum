"use strict";

console.log("loaded?");

class Sketchboard {
	constructor(){
		this.selectedObject = undefined;
		this.triangleNo = 1,
		this.rectangleNo = 1,
		this.circleNo = 1;

		console.log("sketchboard created?");

		this.bindEvent();
	}

	bindEvent(){
		document.querySelector('.createTriangle').addEventListener('click', (e) => {
			this.createObject("triangle");
			let socketInfo = {
				"type": "triangle",
				"number": this.triangleNo
			}
			socket.emit('createObject', socketInfo);
			this.objectCounter("triangle");
		})

		document.querySelector('.createRectangle').addEventListener('click', (e) => {
			this.createObject("rectangle");
			let socketInfo = {
				"type": "rectangle",
				"number": this.rectangleNo
			}
			socket.emit('createObject', socketInfo);
			this.objectCounter("rectangle");
		})

		document.querySelector('.createCircle').addEventListener('click', (e) => {
			this.createObject("circle");
			let socketInfo = {
				"type": "circle",
				"number": this.circleNo
			}
			socket.emit('createObject', socketInfo);
			this.objectCounter("circle");
		})

		// <button class="leave">나가기</button>
		document.querySelector('.leave').addEventListener('click', (e) => {
			console.log("ever gets here?");
			socket.close();
			let xmlhttpreq = new XMLHttpRequest();

			xmlhttpreq.onreadystatechange = () => {
				if(xmlhttpreq.readyState === XMLHttpRequest.DONE && xmlhttpreq.status === 200){
					window.location.replace(xmlhttpreq.responseURL);
				}
			}

			xmlhttpreq.open("GET", "/leave");
			xmlhttpreq.send();
		});

		var that = this;

		document.addEventListener('keydown', (e) => {
			console.log(socket);
			if(that.selectedObject !== undefined){
				let currentTop = Number(that.selectedObject.style.top.split("px")[0]);
				let currentLeft = Number(that.selectedObject.style.left.split("px")[0]);
				let currentInfo;
				switch(e.key){
					case 'ArrowDown':
						console.log(that.selectedObject.classList[1]);
						currentTop += 10;
						that.selectedObject.style.top = currentTop + "px";
						currentInfo = {
							selectedObject: that.selectedObject.classList[1],
							currentTop: currentTop,
							currentLeft: currentLeft
						};
						socket.emit('moveObject', currentInfo);
						break;
					case 'ArrowUp':
						console.log(currentTop);
						if(currentTop > 10) currentTop -= 10;
						that.selectedObject.style.top = currentTop + "px";
						currentInfo = {
							selectedObject: that.selectedObject.classList[1],
							currentTop: currentTop,
							currentLeft: currentLeft
						};
						socket.emit('moveObject', currentInfo);
						break;
					case 'ArrowLeft':
						console.log(currentLeft);
						if(currentLeft > 10) currentLeft -= 10;
						that.selectedObject.style.left = currentLeft + "px";
						currentInfo = {
							selectedObject: that.selectedObject.classList[1],
							currentTop: currentTop,
							currentLeft: currentLeft
						};
						socket.emit('moveObject', currentInfo);
						break;
					case 'ArrowRight':
						console.log(currentLeft);
						if(currentLeft > 0) currentLeft += 10;
						that.selectedObject.style.left = currentLeft + "px";
						currentInfo = {
							selectedObject: that.selectedObject.classList[1],
							currentTop: currentTop,
							currentLeft: currentLeft
						};
						socket.emit('moveObject', currentInfo);
						break;
					case 'Delete':
						that.selectedObject.parentNode.removeChild(that.selectedObject);
						socket.emit('deleteObject', that.selectedObject.classList[1]);
						that.selectedObject = undefined;
						break;
					default:
						return;	
				}
			}
		})
	}

	createObject(objectType){
		console.log(this.triangleNo);
		let template = document.querySelector('.'+objectType);
		let content = document.importNode(template.content, true);
		let object = content.childNodes[1];
		let objectTag, socketInfo;
		if(objectType === "triangle"){
			objectTag = objectType + this.triangleNo.toString();
		}else if(objectType === "rectangle"){
			objectTag = objectType + this.rectangleNo.toString();
		}else if(objectType === "circle"){
			objectTag = objectType + this.circleNo.toString();
		}else{
			throw new Error("undefined object type");
		}
		object.classList.add(objectTag);

		this.initializeObject(object);
		this.selectObject(object);
		document.querySelector('.sketchboard').appendChild(object);
	}

	remoteCreateObject(objectInfo){
		let objectType = objectInfo['type'],
			objectNo = objectInfo['number'];
		this.setObjectCounter(objectType, objectNo);
		this.createObject(objectType);
		this.objectCounter(objectType);
	}

	moveObject(objectInfo){
		if(this.selectedObject === document.querySelector("."+objectInfo['selectedObject'])){
			this.selectedObject.style.left = objectInfo['currentLeft']+"px";
			this.selectedObject.style.top = objectInfo['currentTop']+"px";
		}
	}

	deleteObject(object){
		if(object === this.selectedObject.classList[1]){
			this.selectedObject.parentNode.removeChild(this.selectedObject);
			this.selectedObject = undefined;
		}
	}

	objectCounter(objectType){
		switch(objectType){
			case 'triangle':
				this.triangleNo++;
				break;
			case 'rectangle':
				this.rectangleNo++;
				break;
			case 'circle':
				this.circleNo++;
				break;
			default:
				throw new Error("undefined object type");
		}
	}

	setObjectCounter(type, no){
		switch(type){
			case 'triangle':
				this.triangleNo = no;
				break;
			case 'rectangle':
				this.rectangleNo = no;
				break;
			case 'circle':
				this.circleNo = no;
				break;
			default:
				throw new Error("undefined object type");
		}
	}

	selectObject(objectDiv){
		if(this.selectedObject !== undefined){
			if(this.selectedObject.classList.contains("triangleContainer")){
				this.selectedObject.querySelector('svg>polygon').style.stroke = "none";		
			}else if(this.selectedObject.classList.contains("rectangleContainer")){
				this.selectedObject.querySelector('svg>rect').style.stroke = "none";
			}else{
				this.selectedObject.querySelector('svg>circle').style.stroke = "none";		
			}
		}

		this.selectedObject = objectDiv;

		if(this.selectedObject.classList.contains("triangleContainer")){
			this.selectedObject.querySelector('svg>polygon').style.stroke = "#FF0000";
			this.selectedObject.querySelector('svg>polygon').style['stroke-width'] = "2";
			this.selectedObject.querySelector('svg>polygon').style['stroke-linejoin'] = "round";
		}else if(this.selectedObject.classList.contains("rectangleContainer")){
			this.selectedObject.querySelector('svg>rect').style.stroke = "#FF0000";
			this.selectedObject.querySelector('svg>rect').style['stroke-width'] = "4";
			this.selectedObject.querySelector('svg>rect').style['stroke-linejoin'] = "round";
		}else{
			this.selectedObject.querySelector('svg>circle').style.stroke = "#FF0000";
			this.selectedObject.querySelector('svg>circle').style['stroke-width'] = "4";
			this.selectedObject.querySelector('svg>circle').style['stroke-linejoin'] = "round";
		}
	}

	initializeObject(objectDiv){
		objectDiv.addEventListener('click', (e)=>{
			this.selectObject(objectDiv);
			socket.emit('selectObject', objectDiv.classList[1]);
		});
		this.setInitialLocation(objectDiv);
	}

	setInitialLocation(objectDiv){
		objectDiv.style.top = "10px";
		objectDiv.style.left = "10px";
	}
}