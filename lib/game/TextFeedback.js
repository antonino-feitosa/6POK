ig.module(
	'game.TextFeedback'
).requires(
    'impact.entity'
).defines(function () {
	TextFeedback = ig.Entity.extend({

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
			this.addAnim('idle', 1, [0]);
			x += ig.game.cameraPosition.x - this.size.x/2;
			y += ig.game.cameraPosition.y + this.size.y/2;
			this.parent(x, y, settings);
            this.color = this.font[settings.color];
            this.text = this.wrapText(settings.text);
		},

		wrapText(text, maxWidth = 100, cut = false) {
			let regex = '.{1,' + maxWidth + '}(\\s|$)' + (cut ? '|.{' + maxWidth + '}|.+$' : '|\\S+?(\\s|$)');
			return text.match(RegExp(regex, 'g')).join('\n');
		},

		draw: function () {
			this.parent();
			this.color.draw(this.text, this.x, this.y, ig.Font.ALIGN.LEFT);
		}
	})
});
