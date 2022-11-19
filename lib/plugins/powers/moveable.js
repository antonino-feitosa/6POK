ig.module('plugins.powers.moveable')
    .requires(
        'impact.entity',
        'plugins.powers.unit',
        'plugins.powers.side',
        'plugins.powers.actions.moveTo'
    ).defines(function () {

        EntityMoveable = EntityUnit.extend({

            direction: Side.Front,

            canMoveTo: function(dir){
                if(this.direction.equals(dir)){
                    return ig.game.canMoveTo(this, dir);
                } else {
                    return true;
                }
            },

            moveFront: function(){
                this.waitForAction(new MoveTo(this, Side.Front));
            },

            moveFrontUp: function(){
                this.waitForAction(new MoveTo(this, Side.FrontUp));
            },

            moveFrontDown: function(){
                this.waitForAction(new MoveTo(this, Side.FrontDown));
            },

            moveBack: function(){
                this.waitForAction(new MoveTo(this, Side.Back));
            },

            moveBackUp: function(){
                this.waitForAction(new MoveTo(this, Side.BackUp));
            },

            moveBackDown: function(){
                this.waitForAction(new MoveTo(this, Side.BackDown));
            },

            stopedMoving: function(){
            },

            changeDirection: function(side){
                this.direction = side;
            }
        });
    });
