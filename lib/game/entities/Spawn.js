
ig.module('game.entities.Spawn')
.requires(
    'impact.entity',
    'game.entities.Animal'
).defines(function () {

    EntitySpawn = ig.Entity.extend({
        name: 'Spawn Point',

        size: { x: 16, y: 16 },
        offset: { x: (64 - 16) / 2, y: (64 - 16) / 2 },
        
        _wmDrawBox: true,
        _wmBoxColor: '#00FF00',

        init(x, y, settings){
            this.parent(x, y, settings);
            this.settins = settings;
        },

        update: function () {
            ig.game.spawnEntity(EntityAnimal, this.pos.x, this.pos.y, this.settings);
            this.kill();
        },
    });
});
