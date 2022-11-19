
ig.module('plugins.powers.unit')
    .requires(
        'impact.entity'
    )
    .defines(function () {
        EntityUnit = ig.Entity.extend({
            size: { x: 64, y: 64 },
            flip: false,

            type: ig.Entity.TYPE.BOTH,
            checkAgainst: ig.Entity.TYPE.BOTH,
            collides: ig.Entity.COLLIDES.STATIC,

            init: function(x, y, settings){
                this.parent(x, y, settings);
                this._animating = -1;
                this._processed = 0;
            },

            handle_colision: function (other) {
            },

            handle_map_colision: function () {
            },

            numOfMoviments: function(){
                return 1;
            },

            nextMove: function(){
                this._processed += 1;
            },

            nextTurn: function(){
                this._processed = this.numOfMoviments();
            },

            process: function () {
                this.nextTurn();
            },

            attack: function(entity, x, y, settings){
                ig.game.spawnEntity(entity, x, y, settings);
                this.nextTurn();
            },

            kill: function() {
                this.parent();
                // TODO disable attack collision
                // FIX Attacks still colliding with attacks after death
            },

            waitForAnimation: function(call, parans){
                this._call = call;
                this._parans = parans;
                this._animating = this.currentAnim.loopCount;
            },

            waitForAction: function(action){
                this._action = action;
                this.nextMove();
            },

            // return num of processed turns
            update: function () {
                if(this._animating != -1){
                    if(this._animating != this.currentAnim.loopCount){
                        this._animating = -1;
                        if(this._call){
                            console.log("End Waiting!");
                            this._call.apply(this, this._parans);
                            this._call = null;
                            this._parans = null;
                        }
                    } else {
                        return false;
                    }
                }
                this.update_moviment();
                if(this._action){
                    if(this._action.finished()){
                        this._action.eventEnd();
                        this._action = null;
                    } else {
                        this._action.update();
                        return false;
                    }
                }
                this.process()
                console.log(this._processed);
                if(this._processed >= this.numOfMoviments()){
                    this._processed = 0;
                    return true;
                } else {
                    return false;
                }
            },

            update_moviment(){
                this.vel.x = this.vel.x.limit(-this.maxVel.x, this.maxVel.x);
                this.vel.y = this.vel.y.limit(-this.maxVel.y, this.maxVel.y);
                this.pos.x += this.vel.x * ig.system.tick;
                this.pos.y += this.vel.y * ig.system.tick;
            },

            update_animation() {
                if(this.currentAnim) {
                    this.currentAnim.update();
                }
            }
        });

        ig.Entity.TYPE = {
            NONE: 0,
            PLAYER: 1,
            ENEMY: 2,
            BOTH: 8
        };

        ig.Entity.COLLIDES = {
            NEVER: 0,
            OVERLAP: 1,
            STATIC: 2
        };

        ig.Entity.checkPair = function (a, b) {
            if (a.checkAgainst & b.type) {
                a.handle_colision(b);
            }
            if (b.checkAgainst & a.type) {
                b.handle_colision(a);
            }
        };
    });
