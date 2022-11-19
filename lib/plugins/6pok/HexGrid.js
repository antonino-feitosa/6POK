
import { MatrixSparse } from "./algorithm/MatrixSparse";

export class Position {

    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    add(position) {
        this.x += position.x;
        this.y += position.y;
    }

    sub(position) {
        this.x -= position.x;
        this.y -= position.y;
    }

    clone() {
        return new Position(this.x, this.y);
    }

    equals(obj) {
        if (obj && obj.x && obj.y) {
            return obj.x === this.x && obj.y === this.y;
        }
        return false;
    }
}

export class HexGrid {

    #matrix = new MatrixSparse();

    static #obstacle = { id: -1 };

    constructor(width = 16, height = 13, cellSize = 64) {
        this.width = width;
        this.height = height;
        this.cellSize = cellSize;
    }

    coords2Grid(position) {
        position.y = position.y / (3 / 4);
        position.x = Math.max(position.x, 0);
        position.y = Math.max(position.y, 0);
        if (Math.floor(position.y / this.cellSize) % 2 == 0) {
            position.x -= this.cellSize / 2;
        }
        let p = { x: Math.floor(position.x / this.cellSize), y: Math.floor(position.y / this.cellSize) };
        return p;
    }

    grid2Coords(position) {
        let dx = 0;
        if (position.y % 2 == 0) {
            dx = this.cellSize / 2;
        }
        return { x: Math.floor(position.x * this.cellSize + dx), y: Math.floor(position.y * this.cellSize * 3 / 4) };
    }

    set(entity) {
        let p = this.coords2Grid(entity.position);
        if (this.isGridFree(p)) {
            this.#matrix.put(p.y, p.x, entity);
            return true;
        }
        return false;
    }

    del(entity){
        let p = this.coords2Grid(entity.position);
        let e = this.#matrix.get(p.y, p.x);
        if (e && e.id === entity.id) {
            this.#matrix.del(p.y, p.x);
            return true;
        }
        return false;
    }

    remove(entity) {
        for (let [row, col, e] in this.#matrix.entries()) {
            if (entity.id === e.id) {
                this.#matrix.del(row, col);
                return true;
            }
        }
        return false;
    }

    has(entity) {
        for (let [row, col, e] in this.#matrix.entries()) {
            if (entity.id === e.id) {
                return [true, row, col];
            }
        }
        return [false, -1, -1];
    }

    getGridEntity(position) {
        return this.#matrix.get(position.y, position.x);
    }

    isGridFree(position) {
        return this.#matrix.get(position) === null && this.isValidGrid(position);
    }

    isValidGrid(pos) {
        if (pos.x >= 0 && pos.y >= 0 && pos.x < this.width && pos.y < this.height) {
            let half = Math.floor(this.height / 2);
            let rowdiff = Math.abs(half - row) / 2;
            if (col < rowdiff || this.width - col <= rowdiff) {
                return false;
            }
            return true;
        }
    }

    isGridWall(position){
        let cell = this.#matrix.get(position.y, position.x);
        if(cell && cell == HexGrid.#obstacle){
            return true;
        }
        return false;
    }

    putWalls(collisionMap) {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (collisionMap.data[y][x] == 1) {
                    this.#matrix.put(y, x, HexGrid.#obstacle);
                }
            }
        }
    }
}
