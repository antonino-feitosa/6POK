ig.module(
    'game.UserInterface'
).requires(
    'impact.entity'
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
            ig.input.bind(ig.KEY.ENTER, 'confirm');
            ig.input.bind(ig.KEY.ESC, 'cancel');
            this.state = 'free';
        },

        processMenuInput: function (entity) {
            // TODO remove menu_statitics and move access through main menu
            /*if ((this.state === 'free' || this.state === 'menu') && ig.input.pressed('menu_statistics')) {
                if (this.ent_statistics) {
                    this.ent_statistics.kill();
                    this.ent_statistics = null;
                    this.state = 'free';
                } else {
                    this.ent_statistics = ig.game.spawnEntity(TextStatistics, 0, 0, { animal: ig.global.playerAnimal });
                    this.state = 'menu';
                }
            }*/

            if (this.state === 'free' && ig.input.pressed('cancel')) {
                let settings = { animal: entity.animal };
                console.log('Escape');
                this.ent_feedback = ig.game.spawnEntity(TextStatistics, 0, 0, settings);
                //this.ent_feedback = ig.game.spawnEntity(TextFeedback, 0, 0, {text: title});
                this.state = 'dialog';
            }

            if (this.state === 'free' && ig.input.pressed('confirm')) {
                this.openDialog(entity, 'Main Title', ['opt 1', 'opt 2', 'opt 3', 'opt 4', 'opt 5', 'opt 6', 'opt 7', 'opt 8', 'opt 9', 'opt 10', 'opt 11', 'opt 12']);
            }
        },

        processUserAction: function (entity) {
            this.processMenuInput(entity);

            if (this.state === 'free') {
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
                } else if (ig.input.pressed('menu')) {
                    // menu
                } else if (ig.input.pressed('interact')) {
                    let ent = entity.lookAtLine();
                    ent = ent.filter(e => e.isTrigger);
                    ent.forEach(e => e.interact(this));

                    //TODO entity change messages
                }
            }

            if (this.state === 'processed') {
                this.state = 'free';
            }

            return true;
        },

        openDialog: function (entity, title, options, color = 'black') {
            if (this.state === 'free') {
                let settings = { color: color, title: title, options: options, response: entity };
                this.ent_feedback = ig.game.spawnEntity(TextOptions, 0, 0, settings);
                //this.ent_feedback = ig.game.spawnEntity(TextFeedback, 0, 0, {text: title});
                this.state = 'dialog';
            }
        },

        closeDialog() {
            if (this.state === 'dialog') {
                this.ent_feedback.kill();
                this.ent_feedback = null;
                this.state = 'processed';
            }
        }
    });

    let FONT = {
        black: new ig.Font('media/font-black.png'),
        white: new ig.Font('media/font-white.png'),
        blue: new ig.Font('media/font-blue.png'),
        red: new ig.Font('media/font-red.png'),
        green: new ig.Font('media/font-green.png'),
        yellow: new ig.Font('media/font-yellow.png'),
        cyan: new ig.Font('media/font-cyan.png'),
        magenta: new ig.Font('media/font-magenta.png')
    };

    TextFeedback = ig.Entity.extend({
        size: { x: 550, y: 200 },
        animSheet: new ig.AnimationSheet('media/Feedback-BG.png', 550, 200),
        _state: 'open',

        init: function (x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('idle', 1, [0]);
            this.zIndex = 1000;
            this.text = settings.text;
            this.color = settings.color || 'black';
            this.pos.x = ig.game.screen.x + (ig.system.width - this.size.x) / 2;
            this.pos.y = ig.game.screen.y + ig.system.height - this.size.y;
            let px = (ig.system.width - this.size.x) / 2 + 30;
            let py = ig.system.height - this.size.y + 20;
            this.textAnchor = { x: px, y: py };
        },

        onClose() {

        },

        update() {
            if (ig.input.pressed('confirm')) {
                if (this._state === 'show') {
                    this.onClose();
                    ig.game.closeDialog();
                }
            } else if (ig.input.pressed('cancel')) {
                if(this._state === 'show'){
                    ig.game.closeDialog();
                }
            }

            if (this._state === 'open' && !ig.input.pressed('confirm')) {
                this._state = 'show';
            }
        },

        drawText() {
            FONT[this.color].draw(this.text, this.textAnchor.x, this.textAnchor.y, ig.Font.ALIGN.LEFT);
        },

        draw: function () {
            this.parent();
            this.drawText();
        }
    });

    TextOptions = TextFeedback.extend({

        response: null, // entity callback
        selected: 0,
        title: '',
        options: [],

        init: function (x, y, settings) {
            this.parent(x, y, settings);
            this.px = (ig.system.width - this.size.x) / 2 + 30;
            this.py = ig.system.height - this.size.y + 20;
            this.setSelected(0);
        },

        setSelected(index) {
            this.selected = Math.max(0, Math.min(index, this.options.length - 1));
            this.count = 0;
            this.glow = true;
        },

        onClose() {
            this.response.onDialogResponse(this.selected, this.options[this.selected]);
        },

        update() {
            if (ig.input.pressed('up')) {
                this.setSelected(this.selected - 1);
            } else if (ig.input.pressed('down')) {
                this.setSelected(this.selected + 1);
            } else {
                this.parent();
            }
        },

        drawText: function () {
            FONT.black.draw(this.title, this.px, this.py, ig.Font.ALIGN.LEFT);
            let height = this.py + FONT.black.heightForString(this.title) + 15;
            let min = Math.max(0, this.selected - 2);
            min = this.options.length - this.selected < 5 ? this.options.length - 5 : min;
            let max = Math.min(this.options.length, min + 5);
            
            for (let i = min; i < max; i++) {
                if (this.selected === i) {
                    if (this.glow) {
                        FONT.blue.draw('>', this.px, height, ig.Font.ALIGN.LEFT);
                    }
                    if(this.count++ >= 30){
                        this.count = 0;
                        this.glow = !this.glow;
                    }
                }

                FONT.black.draw(this.options[i], this.px + 15, height, ig.Font.ALIGN.LEFT);
                height += FONT.black.heightForString(this.options[i]);
            }
        }
    });

    TextStatistics = TextFeedback.extend({

		size: { x: 350, y: 550 },
		textOffset: {x: 20, y: 20},

		animSheet: new ig.AnimationSheet('media/Menu-BG.png', 350, 550),
		_text: [],

		init: function (x, y, settings) {
            this.parent(x, y, settings);
			this.pos.x = ig.game.cameraPosition.x - ig.system.width / 2;
			this.pos.y = ig.game.cameraPosition.y - ig.system.height / 2;
            this.height = 30;
			
			let a = settings.animal;
			this.println(a.name);
			this.println(' ');
			this.println('Health: ' + a.health + ' / ' + a.hp());
			this.println('Level: ' + a.level);
			this.println('Experience: ' + 0);
			this.println('Nature: ' + a.nature.name);
			this.println('Type: ' + a.type1 + ' / ' + a.type2);
			this.println('------------------------');
			this.println('Health Points:    ' + a.hp());
			this.println('Physical Attack:  ' + a.atk());
			this.println('Physical Defense: ' + a.def());
			this.println('Special Attack:   ' + a.spatk());
			this.println('Special Defense:  ' + a.spdef());
			this.println('Speed:            ' + a.speed());
		},
		
		println: function(text, color = 'black'){
			if(this._text.length > 0){
				let last = this._text[this._text.length-1];
				this.height += last.color.heightForString(last.text);
			}
			this._text.push({text: text, color: FONT[color], x: 20, y: this.height});
		},

		drawText: function () {
			this._text.forEach(t => t.color.draw(t.text, t.x, t.y, ig.Font.ALIGN.LEFT));
		}
	});
});
