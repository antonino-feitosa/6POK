
ig.module(
    'game.HexEntity'
)
    .requires(
        'game.HexGame',
        'impact.entity'
    )
    .defines(function () {

        ActionMove = ig.Class.extend({

            init: function (entity, direction, moves = 10.0) {
                this.moves = moves;
                this.entity = entity;
                this.running = true;

                if(direction.isFront() !== this.entity.direction.isFront()){
                    this.entity.currentAnim.flip.x = direction.isBack();
                    this.running = false;
                }
                this.entity.direction = direction;
                
                if (ig.game.startMove(entity)) {
                    this.lastPosition = { x: this.entity.pos.x, y: this.entity.pos.y };
                    this.destination = this.entity.nextPosition();
                    this.destination.x += entity.offset.x;
                    this.destination.y += entity.offset.y;
                    this.inc = { x: 0, y: 0 };
                    this.inc.x = (this.destination.x - this.entity.pos.x) / this.moves;
                    this.inc.y = (this.destination.y - this.entity.pos.y) / this.moves;
                } else {
                    this.running = false;
                }
            },

            update: function () {
                if (this.running) {
                    if (this.moves > 0) {
                        this.entity.pos.x += this.inc.x;
                        this.entity.pos.y += this.inc.y;
                        this.moves -= 1;
                        return true;
                    } else {
                        ig.game.endMove(this.entity, this.lastPosition, this.destination);
                        this.running = false;
                    }
                }
                return false;
            }
        });


        // remove colission moviment feedback
        ig.Entity.seperateOnXAxis = () => null;
        ig.Entity.seperateOnYAxis = () => null;

        HexEntity = ig.Entity.extend({
            size: { x: 16, y: 16 },
            offset: { x: (64 - 16) / 2, y: (64 - 16) / 2 },
            hidden: false,
            direction: Direction.FRONT,

            type: ig.Entity.TYPE.NONE,
            checkAgainst: ig.Entity.TYPE.NONE,
            collides: ig.Entity.COLLIDES.NEVER,

            process: function () {
                return false;
            },

            doUpdate: function () {
                if (this.action != null) {
                    if (this.action.update()) {
                        return true;
                    } else {
                        this.action = null;
                    }
                } else {
                    return this.process();
                }
                return false;
            },

            update() {
                this.vel.x = this.vel.x.limit(-this.maxVel.x, this.maxVel.x);
                this.vel.y = this.vel.y.limit(-this.maxVel.y, this.maxVel.y);
                this.pos.x += this.vel.x * ig.system.tick;
                this.pos.y += this.vel.y * ig.system.tick;
                if (this.currentAnim) {
                    this.currentAnim.update();
                }
            },

            draw: function () {
                if (!this.hidden)
                    this.parent();
            },

            handle_colision: function (other) {
            },

            handle_map_colision: function () {
            },

            nextPosition(direction) {
                return ig.game.nextPosition(this, direction);
            },

            move(direction) {
                this.action = new ActionMove(this, direction);
                return true;
            }
        });
    });
