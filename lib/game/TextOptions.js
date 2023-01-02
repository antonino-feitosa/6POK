ig.module(
    'game.TextOptions'
).requires(
    'impact.entity'
).defines(function () {

    TextRepresentation = ig.Class.extend({

        textMaxWidth: 200,

        init(text, font, x, y) {
            this.font = font;
            this.x = x;
            this.y = y;
            this.selected = false;
            this.glow = false;
            this.count = 0;
            this.text = this.wrapText(text + '\r\n', this.textMaxWidth);
        },

        setSelected(enable){
            this.selected = enable;
            this.glow = enable;
            this.count = 0;
        },

        draw() {
            if(this.selected && this.count++ >= 30){
                this.count = 0;
                this.glow = ! this.glow;
            }
            if(this.glow){
                this.font.draw('>', this.x - 15, this.y, ig.Font.ALIGN.LEFT);
            }
            this.font.draw(this.text, this.x, this.y, ig.Font.ALIGN.LEFT);
        },

        height() {
            return this.font.heightForString(this.text);
        },

        wrapText(text, maxWidth = 100, cut = false) {
            let regex = '.{1,' + maxWidth + '}(\\s|$)' + (cut ? '|.{' + maxWidth + '}|.+$' : '|\\S+?(\\s|$)');
            return text.match(RegExp(regex, 'g')).join('\n');
        }
    });

    TextOptions = ig.Entity.extend({

        response: null, // entity callback
        selected: 0,
        title: '',
        options: [],

        pos: { x: 0, y: 0 },
        size: { x: 550, y: 200 },

        font: {
            black: new ig.Font('media/font-black.png'),
            white: new ig.Font('media/font-white.png'),
            blue: new ig.Font('media/font-blue.png'),
            red: new ig.Font('media/font-red.png'),
            green: new ig.Font('media/font-green.png'),
            yellow: new ig.Font('media/font-yellow.png'),
            cyan: new ig.Font('media/font-cyan.png'),
            magenta: new ig.Font('media/font-magenta.png'),
        },
        animSheet: new ig.AnimationSheet('media/Feedback-BG.png', 550, 200),
        _state: 'open',

        init: function (x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('idle', 1, [0]);
            this.zIndex = 1000;
            this.pos.x = ig.game.screen.x + (ig.system.width - this.size.x)/2;
			this.pos.y = ig.game.screen.y + ig.system.height - this.size.y;

            let px = (ig.system.width - this.size.x) / 2 + 30;
            let py = ig.system.height - this.size.y + 20;
            this._title = new TextRepresentation(this.title, this.font['black'], px, py );
            this.setOptions(this.options);
            this.setSelected(0);
        },

        setOptions(options) {
            this._options = [];
            let y = this._title.y + this._title.height() + 10;

            this._options = options.map(text => {
                let rep = new TextRepresentation(text, this.font['black'], 20 + this._title.x, y );
                this._options.push(rep);
                y += rep.height();
                return rep;
            });
            this.selected = 0;
            this.setSelected(0);
        },

        setSelected(index) {
            this._options[this.selected].font = this.font.black;
            this._options[this.selected].setSelected(false);
            this.selected = Math.max(0, Math.min(index, this._options.length - 1));
            this._options[this.selected].font = this.font.blue;
            this._options[this.selected].setSelected(true);
        },

        update() {
            if (ig.input.pressed('up')) {
                this.setSelected(this.selected - 1);
            } else if (ig.input.pressed('down')) {
                this.setSelected(this.selected + 1);
            } else if (ig.input.pressed('confirm')) {
                if (this._state === 'show') {
                    this.response.onDialogResponse(this.selected, this.options[this.selected]);
                    ig.game.closeDialog();
                }
            } else if (ig.input.pressed('cancel')) {
                ig.game.closeDialog();
            }

            if (this._state === 'open' && !ig.input.pressed('confirm')) {
                this._state = 'show';
            }
        },

        draw: function () {
            this.parent();
            this._title.draw();
            this._options.forEach(t => t.draw());
        }
    });
});
