
ig.module('plugins.powers.unit')
.requires(
    'impact.entity'
)
.defines(function () {
    EntityUnit = ig.Entity.extend({
        size: { x: 64, y: 64 },
        flip: false,

        type: ig.Entity.TYPE.BOTH,
        collides: ig.Entity.COLLIDES.STATIC,

        setOpen: function(){
            //OVERLAP
        },
    })
});
