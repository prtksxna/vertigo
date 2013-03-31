$(window).bind("load",function(e){
    var k = Game.init();
});

var Game = {
    init: function(id,w,h){
        this.id = "vertigo";
        this.w = $(window).width();
        this.h = $(window).height();

	this.game_started = false;
	this.pause = false;

	this.setupCanvas();
	this.initImages();
	this.initControls();
	this.initMainMenu();

        return this;
    },

    initImages: function(){

	// Background
	var bg = new Image();
	bg.src = "res/img/bg.png";


	// Character
	var c_down_right = new Image();
	c_down_right.src = "res/img/c_down_right.png";

	var c_down_left = new Image();
	c_down_left.src = "res/img/c_down_left.png";

	var c_up_right = new Image();
	c_up_right.src = "res/img/c_up_right.png";

	var c_up_left = new Image();
	c_up_left.src = "res/img/c_up_left.png";

	// Arrows
	var blue_one = new Image();
	blue_one.src = "res/img/blue_one.png"

	var blue_two = new Image();
	blue_two.src = "res/img/blue_two.png"

	var blue_three = new Image();
	blue_three.src = "res/img/blue_three.png"

	var green_one = new Image();
	green_one.src = "res/img/green_one.png"

	var green_two = new Image();
	green_two.src = "res/img/green_two.png"

	var green_three = new Image();
	green_three.src = "res/img/green_three.png"

	var red = new Image();
	red.src = "res/img/red.png"

	this.images = {
	    "bg": bg,
	    "c_down_right": c_down_right,
	    "c_down_left": c_down_left,
	    "c_up_right": c_up_right,
	    "c_up_left": c_up_left,
	    "blue_one": blue_one,
	    "blue_two": blue_two,
	    "blue_three": blue_three,
	    "green_one": green_one,
	    "green_two": green_two,
	    "green_three": green_three,
	    "red": red
	};

	console.log(this.images);
    },

    initEnvironment: function(){
        this.event = "";

        this.speed = 1; // Only Y speed
        this.gravity = 0.0006;
        this.points = 0;

	this.bgTop = 0;
	this.top_button = undefined;

        this.height = 300;
        this.max_height = 300;

        this.combo_color = "";
        this.combo_hits = 1;
    },

    initMainMenu: function(){
        this.canvas.clearRect(0, 0, this.w, this.h); // Clear Canvas
	this.canvas.font = "bold 30px sans-serif";
	this.canvas.fillText("Vertigo", 100,100);
	this.canvas.font = "bold 15px sans-serif"; // TODO Check for touch devices and print correct controls

	if(!!(this.points)){
	    this.canvas.fillText("You scored "+ this.points + " points.", 100,130);
	    this.canvas.fillText("Hit Spacebar to play again", 100,150);
	}else{
	    this.canvas.fillText("Hit Spacebar to Start Game", 100,130);
	    this.canvas.fillText("Use Arrow Keys to move around", 100,150);
	    this.canvas.font = "italic 10px sans-serif";
	    this.canvas.fillText("by Path Seventeen", 100,180);
	}
    },

    initGame: function(){
	this.destroyGame();

	this.initEnvironment();
	this.game_started = true;
	this.pause = false;

        this.player = new Player(this,this.w/2, this.h/3)
        this.buttons = [];

        this.generateButtons(this.h);
        this.generateButtons(-this.h);

        this.now = new Date().getTime();
        this.timer = window.setTimeout(function(){this.stepper()}.bind(this), 1);
    },

    destroyGame: function(){

	this.game_started = false;

	delete this.player
	delete this.buttons
	delete this.now
	delete this.timer

	this.initMainMenu();
    },

    initPauseMenu: function(){
	this.canvas.fillStyle = "#DDDDDD";
	this.canvas.fillRect(0,0,300,300);

	this.canvas.fillStyle = "#000000";
	this.canvas.font = "bold 30px sans-serif";
	this.canvas.fillText("Game Paused", 50,100);
	this.canvas.font = "bold 15px sans-serif"; // TODO Check for touch devices and print correct controls
	this.canvas.fillText("Hit Spacebar to Resume", 50,130);
	this.canvas.fillText("Esc to go back to menu", 50,150);
    },

    backToMenu: function(){
	if(this.pause && this.game_started){
	    this.destroyGame();
	}
    },

    initControls: function(){
	var lr = $(window).width() / 2;
	var game = this;

	$(document).bind("keydown",function(e){
            switch(e.keyCode){
            case 37:
		e.preventDefault();
		game.event = "left";
		break;
            case 39:
		e.preventDefault();
		game.event = "right";
		break;
	    case 32:
		e.preventDefault();
		game.playPause();
		break;
	    case 27:
		game.backToMenu();
		break;
            default:
		// Do nothing
            };
	});

	$(document).bind("keyup",function(e){
            game.event = "";
	});


	// For touch devices
	$(document).bind("mousedown touchstart",function(e){
            e.preventDefault();
	    if(!game.game_started){;
		game.initGame();
		return false;
	    }

            var x = 0;

            if (e.originalEvent.touches){
		x = e.originalEvent.touches[0].pageX;
            }else{
		x = e.pageX;
            }

            if (x > lr){
		game.event = "right";
            }else{
		game.event = "left";
            }
	});

	$(document).bind("mouseup touchend",function(e){
            game.event = "";
	});
    },

    playPause: function(){
	if(this.game_started){
	    if(this.pause){
		this.pause = false;
		this.now = new Date().getTime();
		window.setTimeout(function(){this.stepper()}.bind(this), 1);
	    }else{
		this.pause = true;
	    }
	}else{
	    this.initGame();
	}
    },

    generateButtons: function(pos){
	var n = this.w / 40;
        for(var i = 0; i < n; i++){
            this.buttons.push(new Button(this, Math.random(1)*(pos)));
        }
    },

    stepper: function(){
        var then = this.now;
        this.now = new Date().getTime();
        this.delta = this.now - then;

        this.update();

	if(this.pause === false){
            window.setTimeout(function(){this.stepper()}.bind(this), 1);
	}else{
	    this.initPauseMenu();
	}
    },

    update: function(){
        this.canvas.clearRect(0, 0, this.w, this.h); // Clear Canvas

        this.updateSpeed();
	this.updateBg();
        this.updateButtons();
        this.player.react(); // Make player react to event

       // FPS Logging & Points
        var fps = Math.round(1000/this.delta);
        this.canvas.font = "bold 12px sans-serif";
	this.canvas.fillStyle = "#000";
        this.canvas.fillText("FPS: " + fps, 10, 60);
        this.canvas.fillText("Height: " + this.height, 10, 70);
        this.canvas.fillText("Max Height: " + this.max_height, 10, 80);
        this.canvas.fillText("Speed: " + this.speed, 10, 90);
        this.canvas.fillText("Momentum: " + this.player.momentum, 10, 100);
        this.canvas.fillText("Top Button: " + this.top_button.y, 10, 110);

	// Game interface
	this.updateInterface();
    },

    updateInterface: function(){
	this.canvas.fillStyle = "#000";
	this.canvas.fillRect(0,0,this.w/2, 50);
	this.canvas.fillStyle = "#ffffff";
        this.canvas.font = "bold 18px sans-serif";
        this.canvas.fillText("Points: " + this.points, 10, 30);

	this.canvas.fillStyle = this.combo_color;
	this.canvas.fillRect(this.w/2, 0, this.w, 50);
	this.canvas.fillStyle = "#ffffff";
        this.canvas.fillText(this.combo_hits + "x Combo", ((this.w/2) + 10), 30 );
    },

    updateBg: function(){
	if(this.bgTop > this.h){
	    this.bgTop = 0;
	}
	this.canvas.drawImage(this.images["bg"], 0, this.bgTop);
	this.canvas.drawImage(this.images["bg"], 0, this.bgTop - 800);
	this.bgTop += this.speed / 2;
    },

    updateSpeed: function(){
        this.speed -= this.gravity * this.delta;
        this.height += this.speed;

        if (this.height > this.max_height){
            this.max_height = this.height;
        }


	if(this.top_button.y > 0){
	    this.generateButtons(-this.h);
	}

	// TODO Fix game over check
	if((this.height + this.h) < this.max_height){
	    this.destroyGame();
	}
    },

    updateButtons: function(){
        var speedDelta = this.speed * this.delta;
        for(var i = 0; i < this.buttons.length; i++){
	    this.buttons[i].update(speedDelta); // Update speed and check collisions
        };
    },

    setupCanvas: function(){
        this.canvasElement = $("<canvas width='" + this.w +
                               "' id='" + this.id +
                               "' height='" + this.h + "'></canvas>");
        this.canvas = this.canvasElement.get(0).getContext("2d");
        this.canvasElement.appendTo('body');
    }
};
