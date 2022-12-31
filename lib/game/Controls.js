
ig.module('game.Controls')
    .requires(
        'game.TextStatistics',
        'game.TextFeedback',
        'game.TextBalloon'
    ).defines(function () {

        Controls = ig.Class.extend({

            player: null,
            hasActiveMenu: false,
            hasActiveFeedback: false,

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
                ig.input.bind(ig.KEY.T, 'test');
                this.state = 'free';
            },

            processMenuInput: function () {
                if ((this.state === 'free' || this.state === 'menu') && ig.input.pressed('menu_statistics')) {
                    if (this.ent_statistics) {
                        this.ent_statistics.kill();
                        this.ent_statistics = null;
                        this.state = 'free';
                    } else {
                        this.ent_statistics = ig.game.spawnEntity(TextStatistics, 0, 0, { animal: ig.global.playerAnimal });
                        this.state = 'menu';
                    }
                } else if(this.state === 'feedback' && ig.input.pressed('interact')){
                    this.ent_feedback.kill();
                    this.ent_feedback = null;
                    this.state = 'processed';
                }
            },

            processUserAction: function (entity) {
                this.processMenuInput();

                if(this.state === 'free'){
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
                        entity.lookAtLine().filter(e => !e.isTrigger).forEach(e.interact(this));
                        // TODO send message to other players throw entity dialog

                        //ig.game.spawnEntity(TextBalloon, entity.pos.x, entity.pos.y, { text: 'test' });
                        //ig.game.sendFeedback('Feedback process!');
                    } else if (ig.input.pressed('test')) {
                        //ig.game.spawnEntity(TextBalloon, entity.pos.x, entity.pos.y, { text: 'test' });
                        ig.game.sendFeedback('Feedback process!');
                    }
                }

                if(this.state === 'processed'){
                    this.state = 'free';
                }

                return true;
            },

            sendFeedback: function(text, color = 'black'){
                if(!this.hasActiveFeedback){
                    let settings = {color: color, text: text};
                    this.ent_feedback = ig.game.spawnEntity(TextFeedback, 0, 0, settings);
                    this.state = 'feedback';
                }
            }
        });
    });
