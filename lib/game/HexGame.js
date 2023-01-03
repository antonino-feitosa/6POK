
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

        Heap = ig.Class.extend({

            init: function (values = [], compare = (x, y) => x - y) {
                this.compare = compare;
                this.heapfy(values);
            },

            heapfy: function (values) {
                this.values = [...values];
                if (this.values.length > 1) {
                    for (let i = Math.floor(this.values.length / 2); i >= 0; i--) {
                        this._down(i);
                    }
                }
            },

            length: function () {
                return this.values.length;
            },

            isEmpty: function () {
                return this.values.length === 0;
            },

            clear: function () {
                this.values = [];
            },

            has: function (equals) {
                return this.values.find(e => equals(e));
            },

            del: function (equals) {
                let index = this.values.findIndex(e => equals(e));
                if (index > 0) {
                    let e = this.values[index];
                    this.values[index] = this.values[this.values.length - 1];
                    this.values.length -= 1;
                    if (this.values.length > index) {
                        this._down(index);
                    }
                    return e;
                }
                return null;
            },

            push: function (element) {
                this.values.push(element);
                this._up(this.values.length - 1);
                return this;
            },

            pop: function () {
                if (this.isEmpty()) {
                    throw new Error('The heap is empty!');
                }
                let e = this.values[0];
                this.values[0] = this.values[this.values.length - 1];
                this.values.length -= 1;
                if (this.values.length > 0) {
                    this._down(0);
                }
                return e;
            },

            peek: function () {
                if (this.isEmpty()) {
                    throw new Error('The heap is empty!');
                }
                return this.values[0];
            },

            clone: function () {
                let ch = new Heap();
                ch.values = [... (this.values)];
                ch.compare = this.compare;
                return ch;
            },

            toArray: function (call) {
                let copy = this.clone();
                let array = [];
                while (!copy.isEmpty()) {
                    let e = copy.pop();
                    array.push(e);
                }
                return array;
            },

            _up: function (index) {
                if (index > 0) {
                    let upindex = Math.floor((index - 1) / 2);
                    if (this.compare(this.values[index], this.values[upindex]) < 0) {
                        this._swap(index, upindex);
                        this._up(upindex);
                    }
                }
            },

            _swap: function (a, b) {
                [this.values[a], this.values[b]] = [this.values[b], this.values[a]];
            },

            _down: function (index) {
                let left = index * 2 + 1;
                let right = index * 2 + 2;
                if (right < this.values.length) {
                    if (this.compare(this.values[right], this.values[left]) < 0) {
                        left = right;
                    }
                }
                if (left < this.values.length && this.compare(this.values[index], this.values[left]) > 0) {
                    this._swap(index, left);
                    this._down(left);
                }
            }
        });

        SchedulingHeap = ig.Class.extend({

            init: function () {
                this.minPriority = null;
                this.compare = (x, y) => x.priority - y.priority;
                this.heap = new Heap([], this.compare);
            },

            isEmpty: function () {
                return this.heap.isEmpty();
            },

            reset: function () {
                let elapsed = this.heap.peek().priority;
                this.heap.forEach(x => x.priority -= elapsed);
            },

            next: function () {
                let e = this.heap.pop();
                let agging = this.minPriority / e.value.priority;
                e.priority += agging;
                this.heap.push(e);
            },

            push: function (value) {
                if (!this.minPriority) {
                    this.minPriority = value.priority;
                } else if (value.priority < this.minPriority) {
                    this.minPriority = value.priority;
                    this.heap.forEach(x => x.priority = this.minPriority / x.value.priority);
                    this.heap.heapfy(this.heap.values);
                }
                return this.heap.push({ value: value, priority: this.minPriority / value.priority });
            },

            peek: function () {
                return this.heap.peek().value;
            },

            del: function (value) {
                this.heap.del(index, x => x.value.id === value.id);
            },

            clear: function () {
                this.minPriority = null;
                this.heap.clear();
            },

            toArray() {
                return this.heap.toArray().map(x => x.value);
            },

            clone: function () {
                let sh = new SchedulingHeap();
                sh.compare = this.compare;
                sh.minPriority = this.minPriority;
                sh.heap = this.heap.clone();
                return sh;
            },
        });

        HexGrid = ig.Class.extend({

            init: function (width = 16, height = 13, cellSize = 64) {
                this._matrix = new MatrixSparse();
                this._obstacle = { id: -1 };
                this.obstacleCount = 0;
                this.width = width;
                this.height = height;
                this.cellSize = cellSize;
            },

            createObstacle: function () {
                return { id: - (++this.obstacleCount), isObstacle: true };
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
                let e = this._matrix.get(position.y, position.x)
                return e && e.id >= 0 ? e : null;
            },

            isGridFree: function (position) {
                let isfree = !this._matrix.get(position.y, position.x);
                return isfree;
            },

            isValidGrid: function (pos) {
                if (pos.x >= 0 && pos.y >= 0 && pos.x < this.width && pos.y < this.height) {
                    return true;
                }
                return false;
            },

            isGridWall: function (position) {
                if (!this.isValidGrid(position)) {
                    return true;
                }
                let cell = this._matrix.get(position.y, position.x);
                if (cell && cell.id < 0) {
                    return true;
                }
                return false;
            },

            putWalls: function (collisionMap) {
                for (let y = 0; y < this.height; y++) {
                    for (let x = 0; x < this.width; x++) {
                        if (collisionMap.data[y][x] == 1) {
                            this._matrix.put(y, x, this.createObstacle());
                        }
                    }
                }
            },
        });

        HexGame = ig.Game.extend({

            cellSize: 64,
            grid: null,
            turnList: new SchedulingHeap(),
            triggerList: new SchedulingHeap(),
            firingTriggers: new SchedulingHeap(),

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
                if (ent.isCollisionMode) {
                    this.grid.set(ent);
                }
                if(ent.isTurnMode){
                    this.turnList.push(ent);
                }
                if (ent.isTriggerMode) {
                    this.triggerList.push(ent);
                }
                return ent;
            },

            removeEntity: function (ent) {
                this.parent(ent);
                if (ent.isCollisionMode) {
                    this.grid.del(ent);
                }
                if (ent.isTurnMode) {
                    this.turnList.del(ent);
                }
                if (ent.isTriggerMode) {
                    this.triggerList.del(ent);
                }
            },

            updateEntities: function () {
                if (!this.firingTriggers.isEmpty()) {
                    let triggers = this.firingTriggers.toArray();
                    triggers.forEach(t => t.doTriggerLeave());
                    triggers.forEach(t => t.doTriggerStay());
                    triggers.forEach(t => t.doTriggerEnter());
                    triggers.forEach(t => t.doTriggerInteract());

                    let running = new SchedulingHeap();
                    triggers.forEach(t => t.doTrigger() ? running.push(t) : null);
                    this.firingTriggers = running;
                } else if (!this.turnList.isEmpty()) {
                    let ent = this.turnList.peek();
                    if (!ent.doUpdate()) {
                        console.log(this.turnList.toArray());
                        this.turnList.next();
                        console.log(this.turnList.toArray());
                        this.firingTriggers = this.triggerList.clone();
                    }
                }

                this.parent();
            },

            _nextGrid: function (entity, direction) {
                let pos = new Position(entity.pos.x, entity.pos.y);
                let gridpos = this.grid.coords2Grid(pos);
                let nextgrid = direction.nextPosition(gridpos);
                return nextgrid;
            },

            nextPosition: function (entity, direction) {
                let nextgrid = this._nextGrid(entity, direction);
                let nextpos = this.grid.grid2Coords(nextgrid);
                return nextpos;
            },

            _isPositionFree(position) {
                let gridpos = this.grid.coords2Grid(position);
                let isFree = this.grid.isValidGrid(gridpos);
                isFree = isFree && this.grid.isGridFree(gridpos);
                isFree = isFree && !this.grid.isGridWall(gridpos);
                return isFree;
            },

            canMove: function (entity, direction = null) {
                if (direction === null) {
                    direction = entity.direction;
                }
                let nextgrid = this._nextGrid(entity, direction);
                return this.grid.isValidGrid(nextgrid) && !this.grid.isGridWall(nextgrid) && this.grid.isGridFree(nextgrid);
            },

            startMove: function (entity) {
                let nextgrid = this._nextGrid(entity, entity.direction);
                if (this.grid.isValidGrid(nextgrid)) {
                    if (this.grid.isGridWall(nextgrid)) {
                        entity.handle_map_colision();
                    } else if (!this.grid.isGridFree(nextgrid)) {
                        let other = this.grid.getGridEntity(nextgrid);
                        entity.handle_colision(other);
                    } else {
                        return true;
                    }
                } else {
                    entity.handle_map_colision();
                }
                return false;
            },

            endMove(entity, lastPosition, newPosition) {
                if (this._isPositionFree(newPosition)) {
                    this.grid.delPosition(lastPosition);
                    entity.pos.x = newPosition.x;
                    entity.pos.y = newPosition.y;
                    this.grid.set(entity);
                    return true;
                }
                return false;
            },

            _lookAtGridPosition: function (gridpos, distance) {
                let ents = this.triggerList.toArray().filter(t => {
                    gpos = this.grid.coords2Grid(t.pos);
                    return gpos.x === gridpos.x && gpos.y === gridpos.y;
                });
                ents = ents.map(e => new { isTrigger: true, ent: e, dist: distance });
                let e = this.grid.getGridEntity(gridpos);
                e && ents.unshift({ isEntity: true, ent: e, dist: distance });
                return ents;
            },

            lookAtPosition: function (startPos) {
                let gridpos = this.grid.coords2Grid(startPos);
                return this._lookAtGridPosition(gridpos);
            },

            lookAtLine: function (startPos, units, direction) {
                let gridpos = this.grid.coords2Grid(startPos);
                let ents = this._lookAtGridPosition(gridpos, 0);
                for (let i = 1; i <= units; i++) {
                    gridpos = direction.nextPosition(gridpos);
                    ents.concat(this._lookAtGridPosition(gridpos, i));
                }
                return ents;
            },

            _lookAtGridCone: function (gridpos, units, direction, distance, checked) {
                if (units > 0 && !checked.has(gridpos.x * 10000 + gridpos.y)) { // TODO HACK expect map width < 10000
                    let ents = this._lookAtGridPosition(gridpos, distance);
                    checked.add(gridpos.x * 10000 + gridpos.y);
                    for (let dir of direction.cone) {
                        ents.concat(_lookAtGridCone(dir.nextPosition(gridpos), units - 1, dir, distance + 1, checked));
                    }
                    return ents;
                }
                return [];
            },

            lookAtCone: function (startPos, units, direction) {
                let gridpos = this.grid.coords2Grid(startPos);
                return this._lookAtGridCone(gridpos, units, direction, 0, new Set());
            },

            _lookAtGridRadius: function (gridpos, units, distance, checked) {
                if (units > 0 && !checked.has(gridpos.x * 10000 + gridpos.y)) { // TODO HACK expect map width < 10000
                    let ents = this._lookAtGridPosition(gridpos, distance);
                    checked.add(gridpos.x * 10000 + gridpos.y);
                    for (let dir of Direction.values) {
                        ents.concat(_lookAtGridCone(d.nextPosition(gridpos), units - 1, dir, distance + 1, checked));
                    }
                    return ents;
                }
                return [];
            },

            lookAtRadius: function (startPos, units) {
                let gridpos = this.grid.coords2Grid(startPos);
                return this._lookAtGridRadius(gridpos, units, 0, new Set());
            }
        });
    });
