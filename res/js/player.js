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

	// Wrap Around
	if(this.x > this.game.w){
	    this.x = 0;
	}else if((this.x+this.w) < 0){
	    this.x = this.game.w;
	}

        this.draw();
        this.updateMomentum();
    }

    this.updateMomentum = function(){
        var m = this.momentum; // momentum
        var d = this.friction * this.game.delta; // delta

        var s = m ? m < 0 ? -1 : 1 : 0; // sign of momentum
        var am = Math.abs(m) - d; // absolute momentum minus delta
        this.momentum = am < d ? 0 : s === -1 ? -am : am;

	// Caps
	this.momentum = (this.momentum > 4) ? 4 : this.momentum;
	this.momentum = (this.momentum < -4) ? -4 : this.momentum;
    }

    this.draw = function(){
        this.game.canvas.fillStyle = "#000";
//        this.game.canvas.fillRect(this.x,this.y,this.w, this.h);
	var img = "c_";

	if(this.game.speed > 0){
	    img += "up_";
	}else{
	    img += "down_";
	}

	if(this.momentum > 0){
	    img += "right";
	}else{
	    img += "left";
	}


	this.game.canvas.drawImage(this.game.images[img], this.x, this.y);
	this.game.canvas.fillStyle = this.game.combo_color;
        this.game.canvas.font = "bold 13px sans-serif";
	this.game.canvas.fillText(this.game.combo_hits + "x COMBO", this.x + this.w, this.y + this.h)
    }

    this.x = x;
    this.y = y;
    this.w = 20;
    this.h = 30;
    this.momentum = 0;
    this.speed = 0.012; // Only X Speed
    this.friction = 0.006;
    this.game = game;
    this.draw();
    return this;


}
