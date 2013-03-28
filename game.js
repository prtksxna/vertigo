$(document).ready(function(e){
    var k = Game.init();
});

var Game = {
    init: function(id,w,h){
        this.id = "vertigo";
        this.w = $(window).width() - 40;
        this.h = $(window).height() - 2;

        this.event = "";

        this.speed = 0; // Only Y speed
        this.gravity = 0.0006;
        this.points = 0;

	this.pause = false;

        this.height = 300;
        this.max_height = 300;

        this.combo_color = "";
        this.combo_hits = 1;

        this.setupCanvas();
        this.player = new Player(this,100,200)
        this.buttons = [];

        this.generateButtons(100,this.h);
        this.generateButtons(100,-this.h);
	this.initControls();

        this.now = new Date().getTime();
        this.timer = window.setTimeout(function(){this.stepper()}.bind(this), 1);

        return this;
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
            default:
		// Do nothing
            };
	});

	$(document).bind("keyup",function(e){
            game.event = "";
	});

	$(document).bind("mousedown touchstart",function(e){
            e.preventDefault();
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
	if(this.pause){
	    this.pause = false;
	    this.now = new Date().getTime();
            window.setTimeout(function(){this.stepper()}.bind(this), 1);
	}else{
	    this.pause = true;
	}
    },

    generateButtons: function(n,l){
        for(var i = 0; i < n; i++){
            this.buttons.push(new Button(this, Math.random(1)*(l)));
        }
    },

    stepper: function(){
        var then = this.now;
        this.now = new Date().getTime();
        this.delta = this.now - then;

        this.points += this.delta;

        this.update();

	if(this.pause === false){
            window.setTimeout(function(){this.stepper()}.bind(this), 1);
	}
    },

    update: function(){
        this.canvas.clearRect(0, 0, this.w, this.h); // Clear Canvas

        this.updateSpeed();
        this.updateButtons();
        this.player.react(); // Make player react to event

       // FPS Logging & Points
        var fps = Math.round(1000/this.delta);
        this.canvas.font = "bold 12px sans-serif";
        this.canvas.fillText("FPS: " + fps, 10, 20);
        this.canvas.fillText("Points: " + this.points, 10, 30);
        this.canvas.fillText("Combo: " + this.combo_color, 10, 40);
        this.canvas.fillText("Combo hit: " + this.combo_hits, 10, 50);


    },

    updateSpeed: function(){
        this.speed -= this.gravity * this.delta;
        this.height += this.speed;

        if (this.height > this.max_height){
            this.max_height = this.height - (this.height%100) + 100;
            this.generateButtons(50,-500);
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
