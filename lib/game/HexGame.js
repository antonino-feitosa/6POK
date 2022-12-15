
ig.module(
	'game.HexGame'
)
	.requires(
		'impact.game',
		'impact.entity'
	)
	.defines(function () {

		Direction = ig.Class.extend({

			_isFront: false,

			init: function (name, isfront, opposite) {
				this.name = name;
				this._isFront = isfront;
				this.opposite = opposite;
			},

			isFront: function () {
				return this._isFront;
			},

			isBack: function () {
				return !this._isFront;
			},

			nextPosition: function (position) {
				return position.clone();
			}
		});

		Direction.FRONT = new Direction('front', true);
		Direction.FRONT_UP = new Direction('front_up', true);
		Direction.FRONT_DOWN = new Direction('front_down', true);
		Direction.BACK = new Direction('back', false, Direction.FRONT);
		Direction.BACK_UP = new Direction('back_up', false, Direction.FRONT_DOWN);
		Direction.BACK_DOWN = new Direction('back_down', false, Direction.FRONT_UP);

		Direction.FRONT.opposite = Direction.BACK;
		Direction.FRONT_UP.opposite = Direction.BACK_DOWN;
		Direction.FRONT_DOWN.opposite = Direction.BACK_UP;

		Direction.FRONT.nextPosition = function (position) {
			let pos = {x: position.x, y: position.y};
			pos.x += 1;
			return pos;
		};

		Direction.FRONT_UP.nextPosition = function (position) {
			let pos = {x: position.x, y: position.y};
			pos.x += position.y % 2 == 0 ? 1 : 0;
			pos.y -= 1;
			return pos;
		};

		Direction.FRONT_DOWN.nextPosition = function (position) {
			let pos = {x: position.x, y: position.y};
			pos.x += position.y % 2 == 0 ? 1 : 0;
			pos.y += 1;
			return pos;
		};

		Direction.BACK.nextPosition = function (position) {
			let pos = {x: position.x, y: position.y};
			pos.x -= 1;
			return pos;
		};

		Direction.BACK_UP.nextPosition = function (position) {
			let pos = {x: position.x, y: position.y};
			pos.x -= position.y % 2 == 0 ? 0 : 1;
			pos.y -= 1;
			return pos;
		};

		Direction.BACK_DOWN.nextPosition = function (position) {
			let pos = {x: position.x, y: position.y};
			pos.x -= position.y % 2 == 0 ? 0 : 1;
			pos.y += 1;
			return pos;
		};

		ig.Entity.checkPair = function (a, b) {
			if (a.checkAgainst & b.type) {
				a.handle_colision(b);
			}
			if (b.checkAgainst & a.type) {
				b.handle_colision(a);
			}
		};

		MatrixSparse = ig.Class.extend({

			init: function () {
				this._rows = new Map();
			},

			get: function (row, col) {
				if (this._rows.has(row)) {
					return this._rows.get(row).get(col);
				}
				return null;
			},

			del: function (row, col) {
				if (this._rows.has(row)) {
					this._rows.get(row).delete(col);
				}
			},

			put: function (row, col, value) {
				if (!this._rows.has(row)) {
					this._rows.set(row, new Map());
				}
				this._rows.get(row).set(col, value);
			},

			has: function (row, col) {
				if (!this._rows.has(row)) {
					return this._rows.get(row).has(col);
				}
				return false;
			},

			entries: function* () {
				for (let [row, vet] of this._rows.entries()) {
					for (let [col, val] of vet.entries()) {
						yield [row, col, val];
					}
				}
			},

			keys: function* () {
				for (let [row, vet] of this._rows.entries()) {
					for (let col of vet.keys()) {
						yield [row, col];
					}
				}
			},

			values: function* () {
				for (let vet of this._rows.values()) {
					for (let value of vet.values()) {
						yield value;
					}
				}
			},

			clone: function () {
				let mat = new MatrixSparse();
				for (let [row, col, val] of this.entries()) {
					mat.put(row, col, val);
				}
				return mat;
			}
		});

		Position = ig.Class.extend({

			init: function (x = 0, y = 0) {
				this.x = x;
				this.y = y;
			},

			add: function (position) {
				this.x += position.x;
				this.y += position.y;
			},

			sub: function (position) {
				this.x -= position.x;
				this.y -= position.y;
			},

			clone: function () {
				return new Position(this.x, this.y);
			},

			equals: function (obj) {
				if (obj && obj.x && obj.y) {
					return obj.x === this.x && obj.y === this.y;
				}
				return false;
			}
		});

		CircularLinkedList = ig.Class.extend({

			_count: 0,
			_head: null,

			length: function () {
				return this._count;
			},

			current: function () {
				return this._head.element;
			},

			next: function () {
				var e = this._head.element;
				this._head = this._head.next;
				return e;
			},

			add: function (element) {
				if (!this._head) {
					this._head = { element: element };
					this._head.next = this._head;
				} else {
					var e = { element: element, next: this._head.next };
					this._head.next = e;
				}
				this._count += 1;
			},

			has: function (element) {
				if (this._count === 0) {
					throw ("The list is empty!");
				}

				let current = this._head;
				for (let c = 0; c < this._count; c++) {
					if (element.id === current.element.id) {
						return true;
					} else {
						current = current.next;
					}
				}
				return false;
			},

			del: function (element) {
				if (this._count === 0) {
					throw ("The list is empty!");
				}
				if (this._count === 1) {
					this._head = null;
					this._count = 0;
				} else {
					let previous = this._head;
					let current = this._head.next;
					let index = 0;
					while (index < this._count && element.id != current.element.id) {
						index += 1;
						previous = previous.next;
						current = current.next;
					}
					if (element.id === current.element.id) {
						previous.next = current.next;
						this._count -= 1;
						if (this._head.element.id == current.element.id) {
							this._head = current.next;
						}
					}
				}
				//this.print();
			},

			isEmpty: function () {
				return this._count == 0;
			},

			clear: function () {
				this._head = null;
				this._count = 0;
			},

			print: function () {
				var current = this._head;
				for (let c = 0; c < this._count; c++) {
					console.log("<" + current.element.id + ", " + current.element.name + ">");
					current = current.next;
				}
				console.log("");
			}
		});

		HexGrid = ig.Class.extend({

			init: function (width = 16, height = 13, cellSize = 64) {
				this._matrix = new MatrixSparse();
				this._obstacle = { id: -1 };
				this.width = width;
				this.height = height;
				this.cellSize = cellSize;
			},

			coords2Grid: function (position) {
				let x = Math.max(position.x, 0);
				let y = Math.max(position.y / (3 / 4), 0);
				if (Math.floor(y / this.cellSize) % 2 == 0) {
					x -= this.cellSize / 2;
				}
				let p = { x: Math.floor(x / this.cellSize), y: Math.floor(y / this.cellSize) };
				return p;
			},

			grid2Coords: function (position) {
				let dx = 0;
				if (position.y % 2 == 0) {
					dx = this.cellSize / 2;
				}
				return { x: Math.floor(position.x * this.cellSize + dx), y: Math.floor(position.y * this.cellSize * 3 / 4) };
			},

			set: function (entity) {
				let p = this.coords2Grid(entity.pos);
				if (this.isGridFree(p)) {
					this._matrix.put(p.y, p.x, entity);
					return true;
				}
				return false;
			},

			del: function (entity) {
				let p = this.coords2Grid(entity.pos);
				let e = this._matrix.get(p.y, p.x);
				if (e && e.id === entity.id) {
					this._matrix.del(p.y, p.x);
					return true;
				}
				return false;
			},

			delPosition: function (position) {
				let p = this.coords2Grid(position);
				this._matrix.del(p.y, p.x);
			},

			remove: function (entity) {
				for (let [row, col, e] in this._matrix.entries()) {
					if (entity.id === e.id) {
						this._matrix.del(row, col);
						return true;
					}
				}
				return false;
			},

			has: function (entity) {
				for (let [row, col, e] in this._matrix.entries()) {
					if (entity.id === e.id) {
						return [true, row, col];
					}
				}
				return [false, -1, -1];
			},

			getGridEntity: function (position) {
				return this._matrix.get(position.y, position.x);
			},

			isGridFree: function (position) {
				return this._matrix.get(position) === null && this.isValidGrid(position);
			},

			isValidGrid: function (pos) {
				if (pos.x >= 0 && pos.y >= 0 && pos.x < this.width && pos.y < this.height) {
					return true;
				}
				return false;
			},

			isGridWall: function (position) {
				let cell = this._matrix.get(position.y, position.x);
				if (cell && cell.id === this._obstacle.id) {
					return true;
				}
				return false;
			},

			putWalls: function (collisionMap) {
				for (let y = 0; y < this.height; y++) {
					for (let x = 0; x < this.width; x++) {
						if (collisionMap.data[y][x] == 1) {
							this._matrix.put(y, x, this._obstacle);
						}
					}
				}
			},
		});

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
				this._current = null;
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
				if (this.turnList.isEmpty()) {
					return;
				}

				let ent = this.turnList.current();
				if (!ent.update()) {
					this.turnList.next();
					console.log("Entity Current " + this.turnList.current().name);
					//this.turnList.print();
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

			_nextGrid: function(entity){
				let pos = new Position(entity.pos.x, entity.pos.y);
				let gridpos = this.grid.coords2Grid(pos);
				let nextgrid = entity.direction.nextPosition(gridpos);
				return nextgrid;
			},

			nextPosition: function(entity){
				let nextgrid = this._nextGrid(entity);
				let nextpos = this.grid.grid2Coords(nextgrid);
				return nextpos;
			},

			_isPositionFree(position){
				let gridpos = this.grid.coords2Grid(position);
				let isFree = this.grid.isValidGrid(gridpos);
				isFree = isFree && this.grid.isGridFree(gridpos);
				isFree = isFree && !this.grid.isGridWall(gridpos);
				return isFree;
			},
			
			isMoveFree: function(entity){
				let nextgrid = this._nextGrid(entity);
				if(this.grid.isValidGrid(nextgrid)){
					if(!this.grid.isGridFree(nextgrid)){
						let other = this.grid.getGridEntity(nextgrid);
						entity.handle_colision(other);
					} else if(this.grid.isGridWall(nextgrid)){
						entity.handle_map_colision();
					} else {
						return true;
					}
				} else {
					entity.handle_map_colision();
				}
				return false;
			},

			move(entity, lastPosition, newPosition) {
				if (this._isPositionFree(newPosition)) {
					this.grid.delPosition(lastPosition);
					entity.pos.x = newPosition.x;
					entity.pos.y = newPosition.y;
					this.grid.set(entity);
					return true;
				}
				return false;
			}
		});
	});