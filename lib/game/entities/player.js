
ig.module('game.entities.player')
    .requires('plugins.powers.side', 'plugins.powers.unitstub')
    .defines(function () {
        EntityPlayer = EntityUnitStub.extend({
            name: 'player',

            type: ig.Entity.TYPE.PLAYER,
            checkAgainst: ig.Entity.TYPE.BOTH,
            collides: ig.Entity.COLLIDES.STATIC,

            animSheet: new ig.AnimationSheet('media/Unit - Player - Stub.png', 64, 64),

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
                } else if (ig.input.pressed('action1')) {
                    let settings = {
                        direction: this.direction,
                        type: ig.Entity.TYPE.PLAYER,
                        checkAgainst: ig.Entity.TYPE.ENEMY
                    };
                    let posAtt = this.direction.nextPosition(this.pos);
                    console.log("Attack");
                    this.attack('EntityBullet', posAtt.x, posAtt.y, settings);
                } else if (ig.input.pressed('action2')) {
                    let settings = { type: ig.Entity.TYPE.PLAYER, checkAgainst: ig.Entity.TYPE.ENEMY };
                    let posAtt = this.direction.nextPosition(this.pos);
                    this.attack('EntityMelee', posAtt.x, posAtt.y, settings);
                }
                return 0;
            },

            handle_colision: function (other) {
                console.log("Player collision with " + other.name);
            }
        });
    });
