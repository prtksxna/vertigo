var Button = function(game,y){

    this.placeRandomly = function(){
        this.x = Math.random(1) * (this.game.w - 35);
        for(var i = 0; i < this.game.buttons.length; i++){
            var p = this.game.buttons[i];
            if(this.collidesWith(p)){
                this.placeRandomly();
            };
        }
    }

    this.init = function(){
        // Color
        var color = Math.random() * 30;
        if(color < 14){
            this.color = "#3AB82F";
            this.img = "green_";
        }else if(color < 28){
            this.color = "#2F7EBB";
            this.img = "blue_";
        }else{
            this.color = "#BA2F2F";
            this.h = 15;
            this.w = 30;
            this.jump = -0.2;
            this.img = "red";
            return;
        }

        // Jump speed
        var jump = Math.random() * 3;
        if (jump < 1){
            this.jump = 0.3;
            this.h = 15;
            this.img += "one";
        }else if(jump < 2){
            this.jump = 0.5;
            this.h = 30;
            this.img += "two";
        }else{
            this.jump = 0.7;
            this.h = 45;
            this.img += "three";
        }

        this.checkTop();
    }

    this.checkTop = function(){
        if(this.game.top_button !== undefined){
            if(this.game.top_button.y > this.y){
                this.game.top_button = this;
            }
        }else{
            this.game.top_button = this;
        }
    };

    this.draw = function(){
        if(this.y > this.game.h * 1.5){ // Out of the canvas out of the game
            this.destroy();
            return false;
        }

//        this.game.canvas.fillStyle = this.color;
//        this.game.canvas.fillRect(this.x,this.y,this.w,this.h);

        this.game.canvas.drawImage(this.game.images[this.img], this.x, this.y);

        return this.x
    }

    this.taken = function(){
        var boost = this.jump + (this.jump * ((this.game.combo_hits * 0.1)));
        if(this.jump < 0){
            this.game.speed = this.jump;
        }else{
            if(this.game.speed < boost){
                this.game.speed = boost;
            }
        }

        if(this.game.combo_color == this.color){
            this.game.combo_hits += 1;
            $("#jump_sound")[0].play();
        }else{
            if(this.color !== "#BA2F2F"){
                this.game.combo_hits = 1;
                this.game.combo_color = this.color;
                $("#jump_sound")[0].play();
            }else{
                this.game.combo_hits = 1;
                this.game.combo_color = "";
                $("#red_sound")[0].play();
            }
        }

        this.game.points += (this.h * 10) + ((this.combo_hits ^ 2) * 10);
        this.destroy();

        // Achievements
        if(this.game.combo_hits == 5){
            a = new Clay.Achievement({id:"combo5", noUI: false});
            a.award(function(response){
                console.log(response);
            });
        }

        if(this.game.combo_hits == 10){
            a = new Clay.Achievement({id:"combo10", noUI: false});
            a.award(function(response){
                console.log(response);
            });
        }

        if(this.game.points > 50000){
            a = new Clay.Achievement({id:"points50k", noUI: false});
            a.award(function(response){
                console.log(response);
            });
        }

        if(this.game.points > 100000){
            a = new Clay.Achievement({id:"points100k", noUI: false});
            a.award(function(response){
                console.log(response);
            });
        }
    }

    this.destroy = function(){
        var index = this.game.buttons.indexOf(this);
        this.game.buttons.splice(index, 1);
        delete this;
    };

    this.collidesWith = function(p){
        var b = this;
        if((p.y >= b.y && p.y <= (b.y + b.h)) || (b.y >= p.y && b.y <= (p.y + p.h ))){
            if((p.x >= b.x && p.x <= (b.x + b.w)) || (b.x >= p.x && b.x <= (p.x + p.w ))){
                return true;
            }
        }
        return false;
    };

    this.update = function(speedDelta){
        // Move the button
        this.y += speedDelta;
        this.draw();

        // Check for collisions
        var p = this.game.player;
        if(this.collidesWith(p)){
            this.taken();
        }
    }


    this.game = game;
    this.y = y;
    this.w = 24;
    this.h = 30;
    this.jump = 0.5;

    this.placeRandomly();
    this.init();
    this.draw();

    return this;

}
