ig.module(
	'game.TextBalloon'
).defines(function () {
	TextBalloon = ig.Class.extend({

		pos: { x: 0, y: 0 },
		size: { x: 510, y: 210 },
		lifeTime: 200,

		font: new ig.Font('media/font.png'),
		animSheet: new ig.AnimationSheet('media/text_balloon_bg.png', 510, 210),

		init: function (x, y, settings) {
			this.parent(x, y, settings);
			this.zIndex = 1000;
			this.addAnim('idle', 1, [0]);
			this.currentAnim = this.anims.idle;
			this.wrapper = this.wrapText(settings.text);
		},

		wrapText(text, maxWidth = 100, cut = false) {
			let regex = '.{1,' + maxWidth + '}(\\s|$)' + (cut ? '|.{' + maxWidth + '}|.+$' : '|\\S+?(\\s|$)');
			return text.match(RegExp(regex, 'g')).join('\n');
		},

		update: function () {
			this.lifeTime = this.lifeTime - 1;
			if (this.lifeTime < 0) {
				this.kill();
			}
		},

		draw: function () {
			this.parent();
			let x = this.pos.x - ig.game.screen.x + 5;
			let y = this.pos.y - ig.game.screen.y + 5;
			this.font.draw(this.wrapper, x, y, ig.Font.ALIGN.LEFT);
		}
	})
});