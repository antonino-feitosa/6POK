ig.module('plugins.powers.actions.moveTo')
    .requires('plugins.powers.action')
    .defines(function () {

        MoveTo = Action.extend({

            name: 'moveTo',

            init: function (entity, dir) {
                this.parent(entity);
                if (this.entity.direction.equals(dir)) {
                    this.entity.changeDirection(dir);
                    if (this.entity.canMoveTo(dir)) {
                        console.log("Move Direction " + dir.name);
                        console.log("Move From Position " + this.entity.pos.x + " " + this.entity.pos.y);
                        this._nextPos = this.entity.direction.nextPosition(this.entity.pos);
                        console.log("Move to Position " + this._nextPos.x + " " + this._nextPos.y);
                        this._origin = {x: this.entity.pos.x, y: this.entity.pos.y};
                        let vel = this.entity.direction.nextVel(this.entity.pos);
                        console.log("Move With Velocity " + vel.x + " " + vel.y);
                        this.entity.vel.x = vel.x;
                        this.entity.vel.y = vel.y;
                    } else {
                        this.finish();
                    }
                } else {
                    this.entity.changeDirection(dir);
                    this.finish();
                }
            },

            update: function () {
                var dx = this.entity.pos.x - this._nextPos.x;
                var dy = this.entity.pos.y - this._nextPos.y;
                let dist = Math.sqrt(dx*dx + dy*dy);
                
                if (dist < 2) {
                    this.entity.pos.x = this._nextPos.x;
                    this.entity.pos.y = this._nextPos.y;
                    this.entity.vel.x = 0;
                    this.entity.vel.y = 0;
                    this.finish();
                }
            },

            eventEnd: function(){
                this.parent();
                this.entity.stopedMoving();
            }
        });
    });
