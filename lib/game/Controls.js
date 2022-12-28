
ig.module('game.Controls')
    .requires(
        'game.TextStatistics'
    ).defines(function () {

        Controls = ig.Class.extend({

            player: null,
            hasActiveMenu: false,

            init: function () {
                // Initialize your game here; bind keys etc.
                ig.input.bind(ig.KEY._1, 'action1');
                ig.input.bind(ig.KEY._2, 'action2');
                ig.input.bind(ig.KEY.UP_ARROW, 'up');
                ig.input.bind(ig.KEY.DOWN_ARROW, 'down');
                ig.input.bind(ig.KEY.LEFT_ARROW, 'left');
                ig.input.bind(ig.KEY.RIGHT_ARROW, 'right');
                ig.input.bind(ig.KEY.SPACE, 'interact');
                ig.input.bind(ig.KEY.S, 'menu_statistics');
            },

            processMenuInput: function () {
                if (ig.input.pressed('menu_statistics')) {
                    if (this.ent_statistics) {
                        this.ent_statistics.kill();
                        this.ent_statistics = null;
                        this.hasActiveMenu = false;
                    } else {
                        this.ent_statistics = ig.game.spawnEntity(TextStatistics, 0, 0, { animal: ig.global.playerAnimal });
                        this.hasActiveMenu = true;
                    }
                }
                return this.hasActiveMenu;
            },

            processUserAction: function (entity) {
                if (this.processMenuInput()) {
                    return true;
                }

                if (ig.input.pressed('right')) {
                    return entity.move(Direction.FRONT);
                } else if (ig.input.pressed('left')) {
                    return entity.move(Direction.BACK);
                } else if (ig.input.pressed('up')) {
                    if (entity.direction.isFront()) {
                        return entity.move(Direction.FRONT_UP);
                    } else {
                        return entity.move(Direction.BACK_UP);
                    }
                } else if (ig.input.pressed('down')) {
                    if (entity.direction.isFront()) {
                        return entity.move(Direction.FRONT_DOWN);
                    } else {
                        return entity.move(Direction.BACK_DOWN);
                    }
                } else if (ig.input.pressed('interact')) {
                    ig.game.spawnEntity(TextBalloon, entity.pos.x, entity.pos.y, { text: 'test' });
                }
                return true;
            }
        });
    });
