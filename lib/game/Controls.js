
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

        processMenuInput: function(){
            if(ig.input.pressed('menu_statistics')){
                if(this.ent_statistics){
                    this.ent_statistics.kill();
                    this.ent_statistics = null;
                    this.hasActiveMenu = false;
                } else {
                    this.ent_statistics = ig.game.spawnEntity(TextStatistics, 10, 10);
                    this.hasActiveMenu = true;
                }
            }
            return this.hasActiveMenu;
        },

        processUserAction: function (entity) {
            if(this.processMenuInput()){
                return true;
            }

            if (ig.input.pressed('right')) {
                let toMove = entity.direction.isFront();
				entity.direction = Direction.FRONT;
				entity.currentAnim.flip.x = false;
				return toMove ? entity.move() : false;
			} else if (ig.input.pressed('left')) {
                let toMove = entity.direction.isBack();
				entity.direction = Direction.BACK;
				entity.currentAnim.flip.x = true;
				return toMove ? entity.move() : false;
			} else if (ig.input.pressed('up')) {
				if(entity.direction.isFront()){
					entity.direction = Direction.FRONT_UP;
					return entity.move();
				} else {
					entity.direction = Direction.BACK_UP;
					return entity.move();
				}
			} else if (ig.input.pressed('down')) {
				if(entity.direction.isFront()){
					entity.direction = Direction.FRONT_DOWN;
					return entity.move();
				} else {
					entity.direction = Direction.BACK_DOWN;
					return entity.move();
				}
			} else if(ig.input.pressed('interact')){
                ig.game.spawnEntity(TextBalloon, entity.pos.x, entity.pos.y, {text:'test'});
            }
			return true;
        }
    });
});
