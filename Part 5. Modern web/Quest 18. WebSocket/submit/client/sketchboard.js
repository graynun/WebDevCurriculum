"use strict";

console.log("loaded?");


class Sketchboard {
	constructor(){
		this.selectedObject = undefined;

		console.log("sketchboard created?");

		this.bindEvent();
	}

	bindEvent(){
		document.querySelector('.createTriangle').addEventListener('click', (e) => {
			this.createTriangle();
		})

		document.querySelector('.createRectangle').addEventListener('click', (e) => {
			this.createRectangle();
		})

		document.querySelector('.createCircle'). addEventListener('click', (e) => {
			this.createCircle();
		})

		var that = this;

		document.addEventListener('keydown', (e) => {
			if(that.selectedObject !== undefined){
				let currentTop = Number(that.selectedObject.style.top.split("px")[0]);
				let currentLeft = Number(that.selectedObject.style.left.split("px")[0]);
				switch(e.key){
					case 'ArrowDown':
						console.log(currentTop);
						currentTop += 10;
						that.selectedObject.style.top = currentTop + "px";
						break;
					case 'ArrowUp':
						console.log(currentTop);
						if(currentTop > 10) currentTop -= 10;
						that.selectedObject.style.top = currentTop + "px";
						break;
					case 'ArrowLeft':
						console.log(currentLeft);
						if(currentLeft > 10) currentLeft -= 10;
						that.selectedObject.style.left = currentLeft + "px";
						break;
					case 'ArrowRight':
						console.log(currentLeft);
						if(currentLeft > 0) currentLeft += 10;
						that.selectedObject.style.left = currentLeft + "px";
						break;
					case 'Delete':
						that.selectedObject.parentNode.removeChild(that.selectedObject);
						that.selectedObject = undefined;
						break;
					default:
						return;	
				}
			}
		})
	}

	createTriangle(){
		let template = document.querySelector('.triangle');
		let content = document.importNode(template.content, true);
		let triangle = content.childNodes[1];

		this.initializeObject(triangle);
		this.selectObject(triangle);
		document.querySelector('.sketchboard').appendChild(triangle);
	}

	createRectangle(){
		let template = document.querySelector('.rectangle');
		let content = document.importNode(template.content, true);
		let rectangle = content.childNodes[1];

		this.initializeObject(rectangle);
		this.selectObject(rectangle);
		document.querySelector('.sketchboard').appendChild(rectangle);
	}
	createCircle(){
		let template = document.querySelector('.circle');
		let content = document.importNode(template.content, true);
		let circle = content.childNodes[1];
		
		this.initializeObject(circle);
		this.selectObject(circle);
		document.querySelector('.sketchboard').appendChild(circle);
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
		});
		this.setInitialLocation(objectDiv);
	}

	setInitialLocation(objectDiv){
		objectDiv.style.top = "10px";
		objectDiv.style.left = "10px";
	}
}