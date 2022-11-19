
ig.module('game.attacks.bullet')
    .requires('impact.entity', 'plugins.powers.side', 'plugins.powers.moveable')
    .defines(function () {

        State = { Shoot: 0, Travel: 1, Hit: 2, End: 3 };

        EntityBullet = EntityMoveable.extend({

            name: 'bullet',
            collides: ig.Entity.COLLIDES.OVERLAP,

            size: {x: 16, y: 16},
            offset: {x: -24, y: -24},
            damage: 4,
            range: 5,
            direction: Side.Front,
            state: State.Shoot,

            animSheet: new ig.AnimationSheet('media/Effect - Bullet.png', 16, 16),

            init: function (x, y, settings) {
                this.parent(x, y, settings);
                //console.log("Start at " + x + " " + y);

                var vel = 0.1;
                this.addAnim('shoot', vel, [0, 1], true);
                this.addAnim('travel', vel, [2, 3]);
                this.addAnim('hit', vel, [4, 5, 6, 7], true);
            },

            numOfMoviments: function(){
                return 5;
            },

            process: function () {

                switch (this.state) {
                    case State.Shoot:
                        if (!this.canMoveTo(this.direction)) {
                            this.handle_map_colision();
                        } else if (this.currentAnim.loopCount >= 1) {
                            this.currentAnim = this.anims.travel.rewind();
                            this.state = State.Travel;
                        }
                        break;
                    case State.Travel:
                        if (!this.canMoveTo(this.direction) || this._moves >= this.range) {
                            this.handle_map_colision();
                        } else {
                            this.waitForAction(new MoveTo(this, this.direction));
                        }
                        break;
                }
            },

            handle_colision: function (other) {
                if (this.state == State.Travel || this.state == State.Shoot) {
                    this.currentAnim = this.anims.hit.rewind();
                    this.state = State.Hit;
                    this.vel.x = 0;
                    this.vel.y = 0;
                    if (other && 'receiveDamage' in other) {
                        other.receiveDamage(this.damage, this);
                    }
                    this.waitForAnimation(this.kill);
                }
            },

            handle_map_colision: function () {
                this.handle_colision();
            }
        });
    });
