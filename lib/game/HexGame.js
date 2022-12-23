
ig.module(
	'game.HexGame'
)
	.requires(
		'impact.game',
		'impact.entity',
        'game.Random',
        'game.Direction'
	)
	.defines(function () {

		MatrixSparse = ig.Class.extend({

			init: function () {
				this._rows = new Map();
			},

			get: function (row, col) {
				if (this._rows.has(row)) {
					let e = this._rows.get(row).get(col);
                    return e ? e : null;
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
					while (index < this._count && element.id !== current.element.id) {
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

            pop: function(){
                if (this._count === 0) {
					throw ("The list is empty!");
				}
                let element = this._head.element;
				if (this._count === 1) {
					this._head = null;
					this._count = 0;
				} else {
					let previous = this._head;
					let current = this._head.next;
					while (current !== this._head) {
						previous = previous.next;
						current = current.next;
					}
					previous.next = current.next;
					this._count -= 1;
					this._head = current.next;
				}
                return element;
            },

            clone: function(){
                let list = new CircularLinkedList();
				let current = this._head;
				let index = 0;
				while (index < this._count) {
					index += 1;
					current = current.next;
                    list.add(current.element);
				}
                return list;
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
                let isfree = this._matrix.get(position.y, position.x) === null;
				return isfree;
			},

			isValidGrid: function (pos) {
				if (pos.x >= 0 && pos.y >= 0 && pos.x < this.width && pos.y < this.height) {
					return true;
				}
				return false;
			},

			isGridWall: function (position) {
                if(!this.isValidGrid(position)){
                    return true;
                }
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
            triggerList: new CircularLinkedList(),
            firingTriggers: new CircularLinkedList(),

			loadLevel: function (data) {
				var height = 0;
				var width = 0;
                for (let layer of data.layer) {
					height = Math.max(height, layer.height);
					width = Math.max(width, layer.width);
				}
				this.turnList.clear();
                this.triggerList.clear();
                this.firingTriggers.clear();
				this.grid = new HexGrid(width, height);

				this.parent(data);
				this.grid.putWalls(this.collisionMap);
			},

			spawnEntity: function (type, x, y, settings) {
				let ent = this.parent(type, x, y, settings);
                if(ent.doUpdate){
				    this.grid.set(ent);
				    this.turnList.add(ent);
                }
                if(ent.doTrigger){
                    this.triggerList.add(ent);
                }
				return ent;
			},

			removeEntity: function (ent) {
				this.parent(ent);
                if(ent.doUpdate){
    				this.grid.del(ent);
    				this.turnList.del(ent);
                }
                if(ent.doTrigger){
                    this.triggerList.del(ent);
                }
			},

			updateEntities: function () {
                if(!this.firingTriggers.isEmpty()){
                    let trigger = this.firingTriggers.current();
                    if (!trigger.doTrigger()) {
                        this.firingTriggers.pop();
    				}
                } else if (!this.turnList.isEmpty()) {
					let ent = this.turnList.current();
    				if (!ent.doUpdate()) {
    					this.turnList.next();
    					console.log("Entity Current " + this.turnList.current().name);
    					//this.turnList.print();
                        this.firingTriggers = this.triggerList.clone();
    				}
				}

				this.parent();
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
                        other.handle_colision(entity);
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
