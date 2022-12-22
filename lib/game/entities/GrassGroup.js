
ig.module('game.entities.GrassGroup')
.requires(
    'game.entities.Grass'
).defines(function () {

    EntityGrassGroup = EntityGrass.extend({
        name: 'Grass-Group',
        size: { x: 128, y: 128 },

        animSheetFG: new ig.AnimationSheet('media/effects/Grass-group-fg.png', 320, 256),
        animSheetBG: new ig.AnimationSheet('media/effects/Grass-group-bg.png', 320, 256),

    });
});
