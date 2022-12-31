

ig.module(
    'game.Move'
)
    .requires(
        'game.Constants',
    )
    .defines(function () {

        Effect = ig.Class.extend({

            init: function (entity) {

            },

            process: function (modifier, entities) {

            },

            randomize: function (move) {

            }
        });

        CATEGORY = {
            PHYSICAL: 0,
            SPECIAL: 1
        };

        TARGET = {
            SELF: 0b001,
            ALLY: 0b010,
            ENEMY: 0b100
        };

        SINGLE_TARGET = {
            NONE: 0,
            NEAR: 0b001,
            FAR: 0b010,
            RANDOM: 0b100
        };

        MULTIPLE_TARGET = {
            NONE: 0,
            INCREASE: 0b001,
            DECREASE: 0b010,
            ALL: 0b100
        };

        // multiple target
        // single, near, far, random
        
        // type damage
        //all, crescente, descrescente


        Move = ig.Class.extend({

            effect: null,
            type: TYPE.Ground,
            category: CATEGORY.PHYSICAL,
            accuracy: 1.0,
            charge: 10,
            cooldown: 10,
            target: TARGET.ENEMY,
            single_target: SINGLE_TARGET.NEAR,
            multiple_target: MULTIPLE_TARGET.NONE,
            range: 0,



        });

        MoveList = ig.Class.extend({

        });
    });
