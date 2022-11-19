
ig.module('game.entities.player')
    .requires('plugins.6pok.HexEntity')
    .defines(function () {
        EntityPlayer = EntityUnitStub.extend({
            name: 'player',

            type: ig.Entity.TYPE.A,
            checkAgainst: ig.Entity.TYPE.BOTH,
            collides: ig.Entity.COLLIDES.ACTIVE,

            animSheet: new ig.AnimationSheet('media/Unit - Circle.png', 64, 64),

            init: function (x, y, settings) {
                this.parent(x, y, settings);
                var vel = 0.1;
                this.addAnim('stub', vel, [0]).alpha = 0.5;
            },

            numOfMoviments: function(){
                return 3;
            },

            process: function () {
                if (ig.input.pressed('right')) {
                    this.moveFront();
                } else if (ig.input.pressed('left')) {
                    this.moveBack();
                } else if (ig.input.pressed('up')) {
                    if(this.direction.side == Orientation.Front){
                        this.moveFrontUp();
                    } else {
                        this.moveBackUp();
                    }
                } else if (ig.input.pressed('down')) {
                    if(this.direction.side == Orientation.Front){
                        this.moveFrontDown();
                    } else {
                        this.moveBackDown();
                    }
                }
                return 0;
            },

            handle_colision: function (other) {
                console.log("Player collision with " + other.name);
            }
        });
    });
