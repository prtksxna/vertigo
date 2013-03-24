var setupControls = function(game){
    var lr = $(window).width() / 2;

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
};