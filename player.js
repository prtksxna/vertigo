var Player = function(game,x,y){

    this.react = function(){
        switch(this.game.event){
        case "left":
            this.momentum -= this.speed * this.game.delta;
            break;
        case "right":
            this.momentum += this.speed * this.game.delta;
            break;
        };
        this.x += this.momentum;
        this.draw();
        this.updateMomentum();
    }

    this.updateMomentum = function(){
        var m = this.momentum; // momentum
        var d = this.friction * this.game.delta; // delta

        var s = m ? m < 0 ? -1 : 1 : 0; // sign of momentum
        var am = Math.abs(m) - d; // absolute momentum minus delta
        this.momentum = am < d ? 0 : s === -1 ? -am : am;
    }

    this.draw = function(){
        this.game.canvas.fillStyle = "#000";
        this.game.canvas.fillRect(this.x,this.y,this.h,this.w);
    }

    this.x = x;
    this.y = y;
    this.w = 10;
    this.h = 10;
    this.momentum = 0;
    this.speed = 0.006; // Only X Speed
    this.friction = 0.003;
    this.game = game;
    this.draw();
    return this;


}