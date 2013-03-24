var setupControls = function(game){
    $(document).keydown(function(e){
        switch(e.keyCode){
        case 37:
            e.preventDefault;
            game.event = "left";
            break;
        case 39:
            e.preventDefault;
            game.event = "right";
            break;
        default:
            // Do nothing
        };
    });
    $(document).keyup(function(e){
        game.event = "";
    });
};