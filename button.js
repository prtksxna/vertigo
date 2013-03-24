var Button = function(game,y){

    this.placeRandomly = function(){
        this.x = Math.random(1) * this.game.w;
    }

    this.draw = function(){

        if(this.y > this.game.h){ // Out of the canvas out of the game
            this.destroy();
            return false;
        }
        this.game.canvas.fillStyle = "#0f0";
        this.game.canvas.fillRect(this.x,this.y,this.h,this.w);
        return this.x
    }

    this.taken = function(){
        this.game.speed = this.jump;
        this.game.points += 1;
        this.destroy();
    }

    this.destroy = function(){
        var index = this.game.buttons.indexOf(this);
        this.game.buttons.splice(index, 1);
        delete this;
    };

    this.game = game;
    this.y = y;
    this.w = 20;
    this.h = 20;
    this.jump = 0.5;
    this.placeRandomly();
    this.draw();
    return this;

}