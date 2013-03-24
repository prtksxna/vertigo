var Button = function(game,y){

    this.placeRandomly = function(){
        this.x = Math.random(1) * this.game.w;
    }

    this.init = function(){
        // Color
        var color = Math.random() * 20;
        if(color < 9){
            this.color = "#3AB82F";
        }else if(color < 18){
            this.color = "#2F7EBB";
        }else{
            this.color = "#BA2F2F";
            this.h = 20;
            this.jump = -0.2;
            return;
        }

        // Jump speed
        var jump = Math.random() * 3;
        if (jump < 1){
            this.jump = 0.3;
            this.h = 10;
        }else if(jump < 2){
            this.jump = 0.5;
            this.h = 20;
        }else{
            this.jump = 0.7;
            this.h = 30;
        }
    }

    this.draw = function(){

        if(this.y > this.game.h){ // Out of the canvas out of the game
            this.destroy();
            return false;
        }
        this.game.canvas.fillStyle = this.color;
        this.game.canvas.fillRect(this.x,this.y,this.w,this.h);
        return this.x
    }

    this.taken = function(){
        if(this.game.speed < this.jump){
            var boost = this.jump + (this.jump * ((this.game.combo_hits * 0.1)));
            this.game.speed = boost;
        }

        if(this.game.combo_color == this.color){
            this.game.combo_hits += 1;
        }else{
            this.game.combo_hits = 1;
            this.game.combo_color = this.color;
        }

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
    this.init();
    this.draw();

    return this;

}