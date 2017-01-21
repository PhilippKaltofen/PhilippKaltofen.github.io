var gameOver;

var player;
var gravity;

var mainColor;
var mainColor_dark;
var accentColor;

var fab;
var bN;
var tB;
var aB;
var nav;

// assets
var sprite_walk_left;
var sprite_walk_right;
var sprite_jump_left;
var sprite_jump_right;
var sprite_menu;
var sprite_woman_shopping;
var sprite_leave;
var sprite_happy;
var sprite_happy_talking;
var sprite_delete;

var setup = function(){
    createCanvas(360, 620);
    background(240);
    textFont("Roboto");
    noStroke();

    // load sprites
    sprite_walk_right = loadImage("assets/walk_right.png");
    sprite_walk_left = loadImage("assets/walk_left.png");
    sprite_jump_right = loadImage("assets/jump_right.png");
    sprite_jump_left = loadImage("assets/jump_left.png");
    sprite_menu = loadImage("assets/menu.png");
    sprite_woman_shopping = loadImage("assets/womanShopping.png");
    sprite_leave = loadImage("assets/leave.png");
    sprite_happy = loadImage("assets/happy.png");
    sprite_happy_talking = loadImage("assets/happy_talking.png");
    sprite_delete = loadImage("assets/delete.png");

    // vars
    gameOver = false;
    player = new player();
    gravity = 5;

    mainColor = color(255, 193, 7);
    mainColor_dark = color(255, 111, 0, 100);
    accentColor = color(244, 67, 54);

    fab = new floatingActionButton(300, 500);
    bN = new bottomNavigation();
    tB = new topBar();
    aB = new appBar();
    nav = new navigation();
}

var draw = function(){
    if(gameOver == false){
        background(240);

        fill(20);
        text("404 Page not found", width / 2, height / 2);

        // draw elements
        bN.drawBottomNavigation();    
        aB.drawAppBar();
        tB.drawTopBar();
        nav.drawNavigation();
    } else {
        background(mainColor);
    }

    if(keyIsDown(65)){
        player.moveLeft();
    }
    // "D"
    if(keyIsDown(68)){
        player.moveRight();
    }
    // "W"
    if(keyIsDown(87)){
        player.moveUp();
    }

    if(gameOver == false){
        fab.drawButton();
    }
    player.drawPlayer();
    player.movePlayer();
}

var player = function(){
    this.position = createVector(300 - 15, 500);
    this.onGround = false;
    this.speed = 3;
    this.upForce = 0;
    this.timesJumped = 0;
    this.activeImage = sprite_walk_left;

    this.drawPlayer = function(){
        image(this.activeImage, this.position.x, this.position.y);

    }

    this.movePlayer = function(){
        // gravity
        if(this.onGround == false){
            this.position.y += gravity;
            if(this.position.y >= height - 25){
                this.onGround = true;
                this.timesJumped = 0;
            }
        }

        if(this.position.x > bN.position.x - 15 && this.position.y >= height - 56 - 25){
            this.onGround = true;
            this.timesJumped = 0;
            if(this.upForce < 5){
                this.upForce = 0;
            }
        } else {
            if(this.position.y < height -25){
                this.onGround = false;
            }            
        }

        // decay jump
        if(this.upForce > 0){
            this.upForce -= 0.1;
            // upForce
            this.position.y -= this.upForce;
            this.onGround = false;
        }

        // walk out of sides
        if(this.position.x < -10){
            this.position.x = width;
        }
        if(this.position.x > width){
            this.position.x = -9;
        }

        if(this.onGround){
            if(this.activeImage == sprite_jump_left){
                this.activeImage = sprite_walk_left;
            } else if(this.activeImage == sprite_jump_right) {
                this.activeImage = sprite_walk_right;
            }
        }
    }

    this.moveLeft = function(){
        this.position.x -= this.speed;
        if(this.onGround){
            this.activeImage = sprite_walk_left;
        } else {
            this.activeImage = sprite_jump_left;
        }
    }

    this.moveRight = function(){
        this.position.x += this.speed;
        if(this.onGround){
            this.activeImage = sprite_walk_right;
        } else {
            this.activeImage = sprite_jump_right;
        }
    }

    this.moveUp = function(){
        if(this.timesJumped < 2){
            this.upForce = 10;
            this.timesJumped++;
            if(this.activeImage == sprite_walk_right){
                this.activeImage = sprite_jump_right;
            } else if(this.activeImage == sprite_walk_left){
                this.activeImage = sprite_jump_left;
            }
        }        
    }

    this.animation_jump_to_walk = function(){
        // change sprite
        if(player.activeImage == sprite_jump_left){
            player.activeImage = sprite_walk_left;
        } else if(player.activeImage == sprite_jump_right) {
            player.activeImage = sprite_walk_right;
        }
    }
}

var floatingActionButton = function(x, y){
    this.size = 64;
    this.position = createVector(x, y);
    this.color = accentColor;

    this.drawButton = function(){
        // shadow
        fill(20, 20, 20, 50);
        ellipse(this.position.x, this.position.y + 1, this.size + 2, this.size + 2);
        fill(20, 20, 20, 50);
        ellipse(this.position.x, this.position.y + 2, this.size + 2, this.size + 2);
        // button
        fill(this.color);
        noStroke();
        ellipse(this.position.x, this.position.y, this.size, this.size);
        // icon
        fill(255);
        textAlign(CENTER);
        textSize(30);
        text("+", this.position.x, this.position.y + 12);

        // input
        if(dist(this.position.x, this.position.y, mouseX - 10, mouseY - 30) < 32 && mouseIsPressed && player.onGround){
            this.position.x = mouseX - 10;
            this.position.y = mouseY - 30;
        }

        // interact with player
        if(dist(this.position.x, this.position.y, player.position.x, player.position.y) < 32){
            if(player.position.y < this.position.y){
                player.onGround = true;
                player.timesJumped = 0;
                // change sprite
                player.animation_jump_to_walk();
            } else {
                player.upForce = 0;                
            }
        }
    }
}

var bottomNavigation = function(){
    this.color = color(255, 255, 255);
    this.position = createVector(0, height - 56);

    this.drawBottomNavigation = function(){
        // shadow
        fill(20, 20, 20, 50);
        rect(0, height - 58, width, 58);
        fill(20, 20, 20, 50);
        rect(0, height - 60, width, 60);

        // background
        fill(this.color);
        rect(this.position.x, this.position.y, width, 56);
    }
}

var appBar = function(){
    this.color = mainColor;
    this.text = "Escape the App"

    this.drawAppBar = function(){
        // background
        fill(this.color);
        rect(0, 0, width, 72);
        // title
        fill(255);
        textAlign(LEFT);
        textFont("Roboto");
        textSize(22);
        text(this.text, 72, 54);
        // navigation icon
        image(sprite_menu, 16, 34);

        // input
        if(dist(mouseX - 10, mouseY - 30, 25, 50) < 15 && mouseIsPressed){
            nav.open();
        }
    }
}

var navigation = function(){
    this.position = createVector(-250, 0);
    this.opening = false;
    this.closing = false;
    this.deleted = false;

    this.drawNavigation = function(){
        if(this.opening){
            if(this.position.x < 0){
                this.position.x += 5;
                bN.position.x += 5;
                // player.upForce = 5;
            }
            fill(20, 20, 20, 150 + this.position.x);
            rect(0, 0, width, height);
        }        
        if(this.closing){
            if(this.position.x > -250){
                this.position.x -= 5;
                bN.position.x -= 5;
            }            
            fill(20, 20, 20, 150 + this.position.x);
            rect(0, 0, width, height);
        }
        // background
        fill(255);
        rect(this.position.x, this.position.y, 250, height);
        // top 
        fill(mainColor);
        rect(this.position.x, this.position.y, 250, 160);
        // top leave icon
        image(sprite_leave, this.position.x + 220, 130);
        // profile pic
        fill(255);
        ellipse(this.position.x + 125, 80, 64, 64);
        // middleline
        stroke(0,0,0, 30);
        line(0, 160 + (height - 160) / 2, this.position.x + 250, 160 + (height - 160) / 2);
        noStroke();
        // text
        fill(0);
        textSize(18);
        text("Inbox", this.position.x + 16, 160 + 16 * 3);
        text("My Videos", this.position.x + 16, 160 + 16 * 6);
        text("Navigation", this.position.x + 16, 160 + 16 * 9);        
        text("Trash", this.position.x + 16, 160 + 16 * 12);
        text("What a weird App", this.position.x + 16, 160 + 16 * 17);
        text("Settings", this.position.x + 16, 160 + 16 * 20);
        text("Profile", this.position.x + 16, 160 + 16 * 23);
        if(this.deleted == false){
            if(mouseX - 10 < 250 && mouseY - 30 > 560 && mouseY - 30 < 586){
                image(sprite_delete, this.position.x + 16, 557);
                text("Dont jump", this.position.x + 72, 160 + 16 * 26);
                if(mouseIsPressed){
                    this.deleted = true;
                }
            } else {
                text("Dont jump", this.position.x + 16, 160 + 16 * 26);
            }
        }

        // dont let player jump if not deleted
        if(this.deleted == false && this.position.x == 0){
            player.upForce = 0;
        }

        // hitbox line
        if(player.position.y < 160 + (height - 160) / 2 && player.position.y > (160 + (height - 160) / 2) - 20 && player.position.x < this.position.x + 250){
            player.onGround = true;
            player.timesJumped = 0;
            player.animation_jump_to_walk();
        }
        // hitbox top area
        if(player.position.y < 160 && player.position.y > 140 && player.position.x < this.position.x + 250){
            player.onGround = true;
            player.timesJumped = 0;
            player.animation_jump_to_walk();
        }

        // let player exit
        if(dist(player.position.x, player.position.y, this.position.x + 220, 130) < 20){
            this.exitCard();
        }

        // input
        // close
        if(mouseX > 250 + 10 && mouseIsPressed){
            this.closing = true;
            this.opening = false;
        }
        // help
        if(dist(mouseX - 10, mouseY - 30, this.position.x + 125, 80) < 32 && mouseIsPressed){
            image(sprite_happy_talking, this.position.x + 113, 68);            
            fill(20, 20, 20, 20);
            rect(this.position.x + 150, 51, 140, 30, 8);
            fill(20, 20, 20, 20);
            rect(this.position.x + 150, 52, 140, 30, 8);
            fill(accentColor);
            rect(this.position.x + 150, 50, 140, 30, 8);
            fill(255);
            textSize(15);
            text("Get to the exit icon!", this.position.x + 155, 70);
        } else {
            image(sprite_happy, this.position.x + 113, 68);
        }
    }

    this.exitCard = function(){
        // fade background
        fill(20, 20, 20, 20);
        rect(0,0, width, height);
        // shadow
        fill(0, 0, 0, 20);
        rect(38, 198, 284, 284, 4);
        fill(0, 0, 0, 20);
        rect(39, 199, 282, 282, 4);
        // show dialog
        fill(255);
        rect(40, 200, 280, 280, 4);
        // text
        fill(0);
        textSize(36);
        text("Good Job!", 56, 256);
        textSize(20);
        text("Do you want to exit \nthis app?", 56, 344);
        textAlign(RIGHT);
        textSize(16);
        fill(mainColor);
        text("EXIT", 320 - 96, 480 - 24);
        text("CANCEL", 320 - 16, 480 - 24);
        textAlign(LEFT);

        if(dist(320 - 96, 480 - 24, mouseX - 10, mouseY - 30) < 20 && mouseIsPressed){
            gameOver = true;
        }
    }

    this.open = function(){
        this.opening = true;
        this.closing = false;
    }
}

var topBar = function(){
    this.color = mainColor_dark;

    this.drawTopBar = function(){
        fill(this.color);
        rect(0, 0, width, 16);
        fill(255);
        textSize(12);
        textAlign(RIGHT);
        if(minute() < 10){
            text(hour() + ":0" + minute(), width - 16, 12);
        } else {
            text(hour() + ":" + minute(), width - 16, 12);    
        }        
        textAlign(LEFT);
    }
}