ig.module('plugins.powers.side')
    .defines(function () {

        Orientation = { Front: 0, Back: 1 };
        Direction = { Up: 0, Down: 1, Center: 2 };

        Side = ig.Class.extend({
            init: function (dir, side, vel = 100) {
                this.dir = dir;
                this.side = side;
                this.vel = vel;
            },

            equals: function (side) {
                return this.side == side.side && this.dir == side.dir;
            },

            nextGrid: function (grid = { x: 0, y: 0 }) {
                return null;
            },

            nextPosition: function (pos = { x: 0, y: 0 }) {
                let g = ig.game.grid.coordsToGrid(pos.x, pos.y);
                g = this.nextGrid(g);
                return ig.game.grid.gridToCoords(g.x, g.y);
            },

            nextVel: function(pos = { x: 0, y: 0 }){
                let vel = this.nextPosition(pos);
                vel.x = vel.x - pos.x;
                vel.y = vel.y - pos.y;
                let mag = Math.sqrt(vel.x*vel.x + vel.y*vel.y);
                vel.x = this.vel * (vel.x / mag);
                vel.y = this.vel * (vel.y / mag);
                return vel;
            },

            opposite: function () {
                return null;
            },

            isFront: function () {
                return this.equals(Side.Front);
            },

            isFrontUp: function () {
                return this.equals(Side.FrontUp);
            },

            isFrontDown: function () {
                return this.equals(Side.FrontDown);
            },

            isBack: function () {
                return this.equals(Side.Back);
            },

            isBackUp: function () {
                return this.equals(Side.BackUp);
            },

            isBackDown: function () {
                return this.equals(Side.BackDown);
            }
        });

        Side.VELOCITY = 100;

        Side.Front = new Side(Direction.Center, Orientation.Front, Side.VELOCITY);
        Side.FrontUp = new Side(Direction.Up, Orientation.Front, Side.VELOCITY);
        Side.FrontDown = new Side(Direction.Down, Orientation.Front, Side.VELOCITY);
        Side.Back = new Side(Direction.Center, Orientation.Back, Side.VELOCITY);
        Side.BackUp = new Side(Direction.Up, Orientation.Back, Side.VELOCITY);
        Side.BackDown = new Side(Direction.Down, Orientation.Back, Side.VELOCITY);

        Side.Front.name = "front";
        Side.Front.nextGrid = function (grid = { x: 0, y: 0 }) {
            return { x: grid.x + 1, y: grid.y };
        };
        Side.Front.opposite = function () {
            return Side.Back;
        };

        Side.FrontUp.name = "frontup"; 
        Side.FrontUp.nextGrid = function (grid = { x: 0, y: 0 }) {
            let dx = 0;
            if (grid.y % 2 == 0) {
                dx = 1;
            }
            return { x: grid.x + dx, y: grid.y - 1 };
        };
        Side.FrontUp.opposite = function () {
            return Side.BackDown;
        };

        Side.FrontDown.name = "frontdown";
        Side.FrontDown.nextGrid = function (grid = { x: 0, y: 0 }) {
            let dx = 0;
            if (grid.y % 2 == 0) {
                dx = 1;
            }
            return { x: grid.x + dx, y: grid.y + 1 };
        };
        Side.FrontDown.opposite = function () {
            return Side.BackUp;
        };

        Side.Back.name = "back";
        Side.Back.nextGrid = function (grid = { x: 0, y: 0 }) {
            return { x: grid.x - 1, y: grid.y };
        };
        Side.Back.opposite = function () {
            return Side.Front;
        };

        Side.BackUp.name = "backup";
        Side.BackUp.nextGrid = function (grid = { x: 0, y: 0 }) {
            let dx = 0;
            if (grid.y % 2 != 0) {
                dx = -1;
            }
            return { x: grid.x + dx, y: grid.y - 1 };
        };
        Side.BackUp.opposite = function () {
            return Side.FrontDown;
        };

        Side.BackDown.name = "backdown";
        Side.BackDown.nextGrid = function (grid = { x: 0, y: 0 }) {
            let dx = 0;
            if (grid.y % 2 != 0) {
                dx = -1;
            }
            return { x: grid.x + dx, y: grid.y + 1 };
        };
        Side.BackDown.opposite = function () {
            return Side.FrontUp;
        };
    });
