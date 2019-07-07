"use strict";

;(function() {


function SetSlider() {

	var self = this;

	this.generateStructure = function(data) {

		self.elemSet = document.getElementById(data);
	 
		self.sliderBox = document.createElement("div");
		self.sliderBox.classList.add("slider-box");
		self.sliderContent = document.createElement("div");
		self.sliderContent.style.right = 0;
		self.sliderContent.classList.add("slider-content");
		self.sliderBox.appendChild(self.sliderContent);

		self.elemSet.appendChild(self.sliderBox);

		self.left = document.createElement("div");
		self.left.classList.add("go-left");
		self.left.id = "go-left";
		self.right = document.createElement("div");
		self.right.classList.add("go-right");
		self.right.id = "go-right";

		self.elemSet.appendChild(self.left);
		self.elemSet.appendChild(self.right);
	}

	this.setImages = function(mas) {
		mas.forEach( function(item, i, mas) {
			var img = new Image();
			img.src = item;
			self.sliderContent.appendChild(img);
			self.imgCountFull = i + 1;
		});
	}

	this.params = function(par) {

		self.sliderBox.style.width = par.quantityImg * par.widthImg + "px";
		self.sliderContent.style.transition = par.animSpeed / 1000 + "s";

		function arrowMove() {
			self.direction = 0;

			if(!par.arrow) {
				self.left.style.display = self.right.style.display = "none";
			};

			self.right.onclick = function() {
				self.direction = Math.min(self.direction + par.widthImg * par.countImg, par.widthImg * ( self.imgCountFull - par.quantityImg ) );
				self.sliderContent.style.right = self.direction + "px";
			};

			self.left.onclick = function() {
				self.direction = Math.max(0, self.direction - par.widthImg * par.countImg);
				self.sliderContent.style.right = self.direction + "px";
			};
		}
		arrowMove();

		function draggableMove() {
			if(!par.draggable) return;

			self.sliderContent.onmousedown = function(event) {

				var event = event || window.event;

				var thumbCoords = getCoords(self.sliderContent);
				var shiftX = event.pageX - thumbCoords.left;
				var sliderCoords = getCoords(event.target);

				document.onmousemove = function(event) {
					var event = event || window.event;

					var newLeft = event.pageX - shiftX - sliderCoords.left;

					console.log(-newLeft);

					if(-newLeft < 0) return;

					if(-newLeft > par.widthImg * (self.imgCountFull - par.countImg) ) return;
					
					self.sliderContent.style.right = -newLeft  + "px";
				}

			  self.sliderContent.onmouseup = function() {
			    document.onmousemove = self.sliderContent.onmouseup = null;

			  };

			  self.sliderContent.ondragstart = function() {
 			 	return false;
			  };

				
			};

		}
		draggableMove();

		function loopMove() {
			if(!par.loop.enable) {
				clearInterval(timeLoopId);
				return;	
			}

			var timeLoopId = setInterval(() => {

				console.log(self.direction);
				console.log()

				if(self.direction >= par.widthImg * ( self.imgCountFull - par.quantityImg )) {
					self.direction = 0;
				}else{
					self.direction = Math.min(self.direction + par.widthImg * par.countImg, par.widthImg * ( self.imgCountFull - par.quantityImg ) );
				}

				self.sliderContent.style.right = self.direction + "px";

			}, par.loop.delay);
		}
		loopMove();

		function getCoords(elem) {
		  var box = elem.getBoundingClientRect();

		  return {
		    top: box.top + pageYOffset,
		    left: box.left + pageXOffset
		  };

		}

	}
}

var slide = new SetSlider();
slide.generateStructure("one");

slide.setImages([
	"img/1.jpg",
	"img/2.jpg",
	"img/3.jpg",
	"img/4.jpg",
	"img/5.jpg"
]);

slide.params({
	arrow : true,
	loop : {
		enable : true,
		delay : 1000
	},
	draggable : false,
	animSpeed : 100,
	countImg : 1,
	widthImg : 277,
	quantityImg : 2
});


})();