$(document).ready(function(e){
    var h = $(window).height() - 2;
    var w = $(window).width() - 40;
    var k = Game.init("bu", w, h);
    setupControls(k);
});

var Game = {
    init: function(id,w,h){
        this.id = id;
        this.w = w;
        this.h = h;
        this.event = "";
        this.speed = 0; // Only Y speed
        this.gravity = 0.0006;
        this.points = 0;

        this.height = 300;
        this.max_height = 300;

        this.combo_color = "";
        this.combo_hits = 1;

        this.setupCanvas();
        this.player = new Player(this,100,200)
        this.buttons = [];

        this.generateButtons(100,this.h);
        this.generateButtons(100,-this.h);

        this.now = new Date().getTime();
        this.timer = window.setTimeout(function(){this.stepper()}.bind(this), 1);

        return this;
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

        this.update();

        window.setTimeout(function(){this.stepper()}.bind(this), 1);
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

            var p = this.player;
            var b = this.buttons[i];

            // Move the buttons
            this.buttons[i].y += speedDelta;
            this.buttons[i].draw();

            // check for collisions
            if((p.y >= b.y && p.y <= (b.y + b.h)) || (b.y >= p.y && b.y <= (p.y + p.w ))){
                if((p.x >= b.x && p.x <= (b.x + b.w)) || (b.x >= p.x && b.x <= (p.x + p.h ))){
                    b.taken();
                }
            }
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