
ig.module('game.entities.Animal')
    .requires(
        'game.HexEntity',
        'game.Random',
        'game.Direction',
        'game.AnimalStats'
    ).defines(function () {

        EntityAnimal = HexEntity.extend({
            name: 'Animal',

            type: ig.Entity.TYPE.B,
            checkAgainst: ig.Entity.TYPE.BOTH,
            collides: ig.Entity.COLLIDES.ACTIVE,

            init: function (x, y, settings) {
                this.parent(x, y, settings);

                if (!settings.animal) {
                    //ig.game.rand: hack weltmeister mode
                    if (this.isPlayer) {
                        this.animal = ig.game.rand ? ig.global.playerAnimal : { name: 'Adax' };
                    } else {
                        this.animal = ig.game.rand ? new Animal(settings) : { name: 'Alce' };
                    }
                }
                if (this.isPlayer) {
                    this.type = ig.Entity.TYPE.A;
                    this.process = () => ig.game.processUserAction(this);
                    this.name = 'Animal Player (' + this.animal.name + "-" + this.id + ')';
                }

                this.name = 'Animal ' + this.animal.name + '(' + this.id + ')';
                this.animSheet = new ig.AnimationSheet('media/animals/' + this.animal.name + '.png', 64, 64),
                    this.addAnim('stub', 0.1, [0]);
            },

            process: function () {
                return this.actionExplore();
            },

            openDialog(text, options){
                ig.game.openDialog(this, text, options);
            },

            onDialogResponse(responseIndex, responseText){

            },

            handle_colision: function (other) {
                console.log("Collision with " + other.name);
            },

            actionExplore: function () {
                let options = Direction.values.filter(x => x !== this.direction.opposite && ig.game.canMove(this, x));
                let newDirection = this.direction;
                if (options) {
                    newDirection = options.length > 0 && ig.game.rand.pick(options);
                }
                return this.move(newDirection);
            },

            actionGraze: function () {
                if (!this.grazeCount || this.grazeCount === 0) {
                    this.grazeCount = ig.game.rand.nextInt(10);
                    return this.actionExplore();
                }
            }
        });
    });
