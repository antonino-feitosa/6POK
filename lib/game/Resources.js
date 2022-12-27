
ig.module('game.Resources')
.requires(
    'game.entities.Animal',
    'impact.loader',
    'impact.image'
).defines(function () {

    Resources = ig.Loader.extend({
        init: function( gameClass, resources ) {

            let imgTypes = TYPE_NAMES.map(name => new ig.Image('./media/terrain/' + name + '.png'));
            let imgAnimals = ANIMAL_NAMES.map(name => new ig.Image('./media/animals/' + name + '.png'));

            resources.push(...imgTypes);
            resources.push(...imgAnimals);

            this.parent(gameClass, resources);
        }
    });
});