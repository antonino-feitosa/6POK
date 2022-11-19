import { CircularLinkedList } from "./algorithm/CircularLinkedList";
import { HexGrid, Position } from "./HexGrid";

ig.module(
	'plugins.6pok.HexGame'
)
	.requires(
		'impact.game',
		'impact.entity'
	)
	.defines(function () {

		HexGame = ig.Game.extend({

			cellSize: 64,
			grid: null,
			turnList: new CircularLinkedList(),

			loadLevel: function (data) {
				var height = 0;
				var width = 0;
				for (var i = 0; i < data.layer.length; i++) {
					var ld = data.layer[i];
					height = Math.max(height, ld.height);
					width = Math.max(width, ld.width);
				}
				this.turnList.clear();
				this.grid = new HexGrid(width, height);
				this.parent(data);
				this.grid.putWalls(this.collisionMap);
			},

			spawnEntity: function (type, x, y, settings) {
				var ent = this.parent(type, x, y, settings);
                ent.game = this;
				this.grid.set(ent);
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

				for (let i = 0; i < this.entities.length; i++) {
					var e = this.entities[i];
					if (!e._killed) {
						e.update_animation();
					}
				}
			},

			checkEntities: function () {
			},

            move(entity){
                let pos = new Position(entity.pos.x, entity.pos.y);
                let gridpos = this.grid.coords2Grid(pos);
                let nextGrid = entity.direction.nextPosition(gridpos);
                if(this.grid.isGridFree(nextGrid)){
                    this.grid.del(entity);
                    let nextPos = this.grid.grid2Coords(nextGrid);
                    entity.pos.x = nextPos.x;
                    entity.pos.y = nextPos.y;
                    this.grid.set(entity);
                    return true;
                } else {
					if(!this.grid.isValidGrid(nextGrid) || this.grid.isGridWall(nextGrid)){
						entity.handle_map_colision();
					} else {
						let other = this.grid.getGridEntity(nextGrid);
						entity.handle_colision(other);
					}
				}
                return false;
            }
		});
	});
