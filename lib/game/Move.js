

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

        Move = ig.Class.extend({

            effect: null,
            type: null,
            category: 'phisical'


            //efeito, tipo, categoria, potência, acurácia, carga, tempo de recarga, alvo, tipo de alcance e alcance.
        });

        MoveList = ig.Class.extend({

        });
    });
