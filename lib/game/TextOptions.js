ig.module(
	'game.TextOptions'
).requires(
    'impact.entity'
).defines(function () {
	TextOptions = ig.Entity.extend({

        selected: 0,

        pos: { x: 0, y: 0 },
		size: { x: 550, y: 200 },
		textOffset: {x: 20, y: 20},

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

		init: function (x, y, settings) {
            this.parent(x, y, settings);
            this.response = settings.response;
            this.println(settings.text);
            settings.options.forEach(text => this.println(text));
            this._text[this.selected].color = this.font.blue;
		},

        selectIndex(index){
            this._text[this.selected].color = this.font.black;
            this.selected = Math.max(0, Math.min(index, this._text.length));
            this._text[this.selected].color = this.font.blue;
        },

        update(){
            if (ig.input.pressed('up')) {
                this.selectIndex(this.selected - 1);
            } else if (ig.input.pressed('down')) {
                this.selectIndex(this.selected + 1);
            } else if (ig.input.pressed('confirm')) {
                this.response.onDialogResponse(this.selected, this.options[this.selected]);
                ig.game.closeDialog();
            } else if(ig.input.pressed('cancel')){
                ig.game.closeDialog();
            }
        },

		println: function(text, color = 'black'){
			let x = this.pos.x - ig.game.screen.x + this.textOffset.x;
			let y = this.pos.y - ig.game.screen.y + this.textOffset.y;
			if(this._text.length > 0){
				let last = this._text[this._text.length-1];
				y = last.y + last.color.heightForString(last.text);
			}
			let wrapper = this.wrapText(text + '\r\n', 270);
			this._text.push({text: wrapper, color: this.font[color], x: x, y: y});
		},

		draw: function () {
			this.parent();
			this._text.forEach(t => t.color.draw(t.text, t.x, t.y, ig.Font.ALIGN.LEFT));
		}
	})
});
