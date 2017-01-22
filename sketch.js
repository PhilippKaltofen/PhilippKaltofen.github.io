var points;

var setup = function(){
	createCanvas(windowWidth, 15);
	frameRate(60);
	noStroke();
	background(255, 200, 0);
	points = [];
	for(var i = 0; i < 15; i++){
		points[i] = new p(width / 14 * i, random(0,height-3));
	}
}

var draw = function(){
	background(250);
	for(var i = 0; i < points.length - 1; i++){
		points[i].move();
		fill(255, 200, 0, 100);
		beginShape();
		vertex(points[i].position.x, 0);
		vertex(points[i].position.x, points[i].position.y);
		vertex(points[i+1].position.x, points[i+1].position.y);		
		vertex(points[i+1].position.x, 0);
		endShape(CLOSE);
		points[i].drawP();
	}
}

var p = function(x, y){
	this.position = createVector(x, y);
	this.size = 6;
	this.dir = 0.05;

	this.drawP = function(){
		fill(255, 200, 0);
		ellipse(this.position.x, this.position.y, this.size, this.size);
	}

	this.move = function(){
		this.position.y += this.dir;
		if(this.position.y < 0 || this.position.y > height - 3){
			this.dir *= -1;
		}
	}
}