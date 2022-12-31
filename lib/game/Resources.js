
ig.module('game.Resources')
    .requires(
        'impact.loader',
        'impact.image',
        'game.AnimalStats'
    ).defines(function () {

        Resources = ig.Loader.extend({
            init: function (gameClass, resources) {

                let imgTypes = TYPE.map(name => new ig.Image('./media/terrain/' + name + '.png'));
                let imgAnimals = ANIMAL.map(name => new ig.Image('./media/animals/' + name + '.png'));

                resources.push(...imgTypes);
                resources.push(...imgAnimals);

                this.parent(gameClass, resources);
            }
        });
    });