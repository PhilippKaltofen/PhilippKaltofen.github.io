// audio
var mic;
var fft;

var hands;

var setup = function(){
    createCanvas(windowWidth, windowHeight);
    background(240);
    textFont("Nunito");
    noStroke();

    // load sprites
    image_clapping = loadImage("assets/clapping.png");

    mic = new p5.AudioIn();
    mic.start();
    mic.amp(5);

    fft = new p5.FFT();
    fft.setInput(mic);

    hands = [];
    for(var i = 0; i < 10; i++){
        hands[i] = new clappingHand();
    }
    
}

var draw = function(){
    background(240,240,240);

    for(var i = 0; i < hands.length; i++){
        hands[i].drawClappingHand();
    }
}

var clappingHand = function(){
    this.position = createVector(random(0, width), -100);
    this.speed = random(1, 5);

    this.drawClappingHand = function(){
        image(image_clapping, this.position.x, this.position.y, this.speed * 50 * mic.getLevel(), this.speed * 50 * mic.getLevel());
        this.position.y += this.speed;
        if(this.position.y > height + 100){
            this.position.y = -100;
        }
    }
}