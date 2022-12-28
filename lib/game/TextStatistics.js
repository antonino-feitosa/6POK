ig.module(
	'game.TextStatistics'
).requires(
    'impact.entity'
).defines(function () {
	TextStatistics = ig.Entity.extend({

		pos: { x: 0, y: 0 },
		size: { x: 350, y: 550 },
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
		animSheet: new ig.AnimationSheet('media/Menu-BG.png', 350, 550),
		_text: [],

		init: function (x, y, settings) {
			this.addAnim('idle', 1, [0]);
			x += ig.game.cameraPosition.x - ig.system.width / 2;
			y += ig.game.cameraPosition.y - ig.system.height / 2;
			this.parent(x, y, settings);

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

		wrapText(text, maxWidth = 100, cut = false) {
			let regex = '.{1,' + maxWidth + '}(\\s|$)' + (cut ? '|.{' + maxWidth + '}|.+$' : '|\\S+?(\\s|$)');
			return text.match(RegExp(regex, 'g')).join('\n');
		},

		// 
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
