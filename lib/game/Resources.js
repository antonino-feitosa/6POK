
ig.module('game.Resources')
.requires(
    'game.entities.Animal',
    'impact.loader',
    'impact.image'
).defines(function () {

    Resources = ig.Loader.extend({
        init: function( gameClass, resources ) {

            let imgTypes = Animal.Types.map(name => new ig.Image('./media/terrain/' + name + '.png'));
            let imgAnimals = Animal.Names.map(name => new ig.Image('./media/animals/' + name + '.png'));

            resources.push(...imgTypes);
            resources.push(...imgAnimals);

            this.parent(gameClass, resources);
        }
    });
});