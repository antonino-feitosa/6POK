
ig.module('game.Controls')
.requires(
).defines(function () {

    Controls = ig.Class.extend({

        player: null,

        init: function () {
            // Initialize your game here; bind keys etc.
            ig.input.bind(ig.KEY._1, 'action1');
            ig.input.bind(ig.KEY._2, 'action2');
            ig.input.bind(ig.KEY.UP_ARROW, 'up');
            ig.input.bind(ig.KEY.DOWN_ARROW, 'down');
            ig.input.bind(ig.KEY.LEFT_ARROW, 'left');
            ig.input.bind(ig.KEY.RIGHT_ARROW, 'right');
            ig.input.bind(ig.KEY.SPACE, 'interact');
        },

        processUserAction: function (entity) {
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
