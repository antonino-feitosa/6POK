ig.module(
    'game.TextOptions'
).requires(
    'impact.entity'
).defines(function () {

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
                ig.game.closeDialog();
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
});
