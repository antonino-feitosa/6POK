
ig.module('plugins.powers.hexEntity')
    .requires(
        'impact.entity'
    )
    .defines(function () {
        HexEntity = ig.Entity.extend({
            size: { x: 64, y: 64 },
            flip: false,

            type: ig.Entity.TYPE.NONE,
            checkAgainst: ig.Entity.TYPE.NONE,
            collides: ig.Entity.COLLIDES.NEVER,
            
            update: function () {
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
            },

            handle_colision: function (other) {
            },
    
            handle_map_colision: function () {
            },
        });

        ig.Entity.TYPE = {
            NONE: 0,
            PLAYER: 1,
            ENEMY: 2,
            WORLD: 4,
            ALL: 8
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
