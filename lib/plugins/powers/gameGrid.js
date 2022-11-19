ig.module(
	'plugins.powers.gameGrid'
)
	.requires(
		'impact.game',
		'impact.entity',
		'plugins.powers.grid',
		'plugins.powers.list'
	)
	.defines(function () {

		GameGrid = ig.Game.extend({

			cellSize: 64,
			grid: null,
			turnList: new CircularList(),

			loadLevel: function (data) {
				var height = 0;
				var width = 0;
				for (var i = 0; i < data.layer.length; i++) {
					var ld = data.layer[i];
					height = Math.max(height, ld.height);
					width = Math.max(width, ld.width);
				}
				this.turnList.clear();
				this.grid = new Grid(width, height, this.cellSize);
				this.parent(data);
				this.grid.putWalls(this.collisionMap);
			},

			spawnEntity: function (type, x, y, settings) {
				var ent = this.parent(type, x, y, settings);
				this.grid.add(ent);
				this.turnList.add(ent);
				return ent;
			},

			removeEntity: function (ent) {
				this.parent(ent);
				this.grid.del(ent);
				this.turnList.del(ent);
			},

			updateEntities: function () {
				if(this.turnList.isEmpty()){
					return;
				}

				let ent = this.turnList.current();
				if(ent.update()){
					this.turnList.next();
					console.log("Entity Current " + this.turnList.current().name);
					this.turnList.print();
				}
				if(!ent._killed){
					this.grid.check(ent);
				}

				for (let i = 0; i < this.entities.length; i++) {
					var e = this.entities[i];
					if (!e._killed) {
						e.update_animation();
					}
				}
			},

			canMoveTo: function(entity, direction){
				return this.grid.canMoveTo(entity, direction);
			},

			checkEntities: function () {
			}
		});
	});
