ig.module(
	'game.TextStatistics'
).requires(
    'game.TextBalloon'
).defines(function () {
	TextStatistics = TextBalloon.extend({

		pos: { x: 0, y: 0 },
		size: { x: 510, y: 210 },
		lifeTime: 100,

		font: new ig.Font('media/font.png'),
		animSheet: new ig.AnimationSheet('media/text_balloon_bg.png', 510, 210),

		init: function (x, y, settings) {
            settings.text = "Statistics";
			this.parent(x, y, settings);
		},

        update: function () {
		},
	})
});
