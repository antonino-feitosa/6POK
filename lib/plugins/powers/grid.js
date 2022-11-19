ig.module(
    'plugins.powers.grid'
)
    .defines(function () {

        Cell = ig.Class.extend({

            init: function () {
                this.entity = null;
                this.triggers = new Array();
                this.wall = false;
            },

            isFree: function () {
                return this.entity == null && !this.wall;
            },

            isWall: function () {
                return this.wall;
            },

            hasEntity: function () {
                return this.entity != null;
            },

            hasTrigger: function () {
                return this.triggers.length > 0;
            }
        });

        Grid = ig.Class.extend({

            width: 0,
            height: 0,
            cellSize: 32,
            grid: [[]],

            init: function (width, height, cellSize) {
                this.width = width;
                this.height = height;
                this.cellSize = cellSize;
                this.grid = new Array();
                for (let i = 0; i < height; i++) {
                    let arr = new Array();
                    for (let j = 0; j < width; j++) {
                        arr.push(new Cell());
                    }
                    this.grid.push(arr);
                }
            },

            coordsToGrid: function (wx, wy) {
                wy = wy / (3/4);
                wx = Math.max(wx, 0);
                wy = Math.max(wy, 0);
                if(Math.floor(wy / this.cellSize) % 2 == 0){
                    wx -= this.cellSize/2;
                }
                let p = { x: Math.floor(wx / this.cellSize), y: Math.floor(wy / this.cellSize) };
                return p;
            },

            gridToCoords: function(gx, gy){
                let dx = 0;
                if(gy % 2 == 0){
                    dx = this.cellSize/2;
                }
                return {x: Math.floor(gx * this.cellSize + dx), y: Math.floor(gy * this.cellSize * 3/4)};
            },

            add: function (element) {
                if (element.collides == ig.Entity.COLLIDES.STATIC) {
                    var pos = this.coordsToGrid(element.pos.x, element.pos.y);
                    element.grid = pos;
                    this.grid[pos.y][pos.x].entity = element;

                    console.log("Start Position: " + element.pos.x + " " + element.pos.y);
                    console.log("Grid " + element.grid.x + " " + element.grid.y);

                } else {
                    this.attach(element);
                }
            },

            del: function (element) {
                if (element.collides == ig.Entity.COLLIDES.STATIC) {
                    var pos = element.grid;
                    this.grid[pos.y][pos.x].entity = null;
                } else {
                    this.dettach(element);
                }
            },

            attach: function (trigger) {
                trigger.grid = this.coordsToGrid(trigger.pos.x, trigger.pos.y);
                let cell = this.grid[trigger.grid.y][trigger.grid.x];
                cell.triggers.push(trigger);
            },

            dettach: function (trigger) {
                let cell = this.grid[trigger.grid.y][trigger.grid.x];
                let index = 0;
                while(index < cell.triggers.length && cell.triggers[index].id != trigger.id){
                    index += 1;
                }
                if (index < cell.triggers.length && cell.triggers[index].id == trigger.id) {
                    cell.triggers.splice(index, 1);
                }
            },

            reattach: function (trigger) {
                let cell = this.grid[trigger.grid.y][trigger.grid.x];
                let index = 0;
                while(index < cell.triggers.length && cell.triggers[index].id != trigger.id){
                    index += 1;
                }
                if (index < cell.triggers.length && cell.triggers[index].id == trigger.id) {
                    cell.triggers.splice(index, 1);
                    let pos = this.coordsToGrid(trigger.pos.x, trigger.pos.y);
                    let newCell = this.grid[pos.y][pos.x];
                    newCell.triggers.push(trigger);
                    trigger.grid = pos;
                } else {
                    throw("Error! Position out of sync!");
                }
            },

            update: function (element) {
                let pos = this.coordsToGrid(element.pos.x, element.pos.y);
                var dx = Math.abs(pos.x - element.grid.x);
                var dy = Math.abs(pos.y - element.grid.y);
                if (dx >= 1 || dy >= 1) {
                    let newPos = this.grid[pos.y][pos.x];
                    let oldPos = this.grid[element.grid.y][element.grid.x];
                    if (element.collides == ig.Entity.COLLIDES.STATIC) {
                        if (oldPos.entity != element) {
                            throw ('Error! Position out of sync!');
                        }
                        if (newPos.isFree()) {
                            newPos.entity = oldPos.entity;
                            oldPos.entity = null;
                            element.grid = pos;
                        } else {
                            throw ('Error! Position is not free!');
                        }
                    } else {
                        this.reattach(element);
                    }
                }
            },

            canMoveTo(element, direction){
                if (element.collides == ig.Entity.COLLIDES.STATIC) {
                    let pos = direction.nextGrid(element.grid);
				    return this.grid[pos.y][pos.x].isFree();
                } else {
                    let pos = direction.nextGrid(element.grid);
				    return !this.grid[pos.y][pos.x].isWall();
                }
            },

            check: function (element) {
                if (
                    element.type == ig.Entity.TYPE.NONE ||
                    element.checkAgainst == ig.Entity.TYPE.NONE ||
                    element.collides == ig.Entity.COLLIDES.NEVER) {
                    return;
                }

                let pos = this.coordsToGrid(element.pos.x, element.pos.y);
                let cell = this.grid[pos.y][pos.x];
                if (cell.isWall()) {
                    element.handle_map_colision();
                } else {
                    if (cell.hasEntity() && cell.entity.id != element.id) {
                        if (element.collides == ig.Entity.COLLIDES.STATIC) {
                            let cor = this.gridToCoords(pos.x, pos.y);
                            element.pos.x = cor.x;
                            element.pos.y = cor.y;
                        }
                        ig.Entity.checkPair(element, cell.entity);
                    }
                }
                this.update(element);
                //this.print();
            },

            putWalls: function (collisionMap) {
                for (let y = 0; y < this.height; y++) {
                    for (let x = 0; x < this.width; x++) {
                        if (collisionMap.data[y][x] == 1) {
                            this.grid[y][x].wall = true;
                        }
                    }
                }
            },

            print: function(){
                console.log("Matrix");
                let str = "";
                for(let y=0;y<this.height;y++){
                    for(let x=0;x<this.width;x++){
                        let cell = this.grid[y][x];
                        if(cell.hasEntity()){
                            str += "ID-" + cell.entity.id + " ";
                        }
                        for(let e of cell.triggers){
                            str += e.id + " ";
                        }
                        str += ", "
                    }
                    str += "\n";
                }
                console.log(str);
            }
        });
    });
