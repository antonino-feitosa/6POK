const { Camera } = require("./Camera");
const { Dimension } = require("./Dimension");
const { CircularLinkedList } = require("./CircularLinkedList");
const { Player } = require("./Player");
const { Position } = require("./Position");
const { Random } = require("./Random");
const { World } = require("./World");
const { HomeTown } = require("./HomeTown");

class Game {

	constructor() {
		this.level = 0;
		this.num_rooms = 5;
		this.pressed = new Map();
		this.camera = new Camera(new Dimension(25, 20));
		this.current_map = null;
		this.player = new Player(this);
		this.rand = new Random('seed');
		this.pressed = null;
		this.entities = new CircularLinkedList();
		this.home_town = new HomeTown();
	}

	start(){
		this.nextMap();
		this.listenInput();
		this.show();
	}

	putPlayer(start = true){
		let index = start ? 0 : this.current_map.rooms.length - 1;
		let region = this.current_map.rooms[index].region;
		let x = this.rand.nextRange(region.x1 + 2, region.x2 - 3);
		let y = this.rand.nextRange(region.y1 + 2, region.y2 - 3);
		let position = new Position(x, y);
		let cell = this.current_map.getCell(position.y, position.x);
		while(cell.trigger !== null){
			x = this.rand.nextRange(region.x1 + 2, region.x2 - 3);
			y = this.rand.nextRange(region.y1 + 2, region.y2 - 3);
			position = new Position(x, y);
			cell = this.current_map.getCell(position.y, position.x);
		}
		this.player.position = position;
		cell.entity = this.player;
		this.entities.add(this.player);
	}

	setHomeTown(){
		this.entities.clear();
		this.current_map = this.home_town;
		let position = new Position(3, 4);
		let cell = this.current_map.getCell(position.y, position.x);
		this.player.position = position;
		cell.entity = this.player;
		this.entities.add(this.player);
	}

	setDungeon(){
		this.entities.clear();
		this.current_map = new World(this.rand, true);
		this.current_map.generate(this.num_rooms, 20, 4);
		this.putPlayer(true);
	}

	nextMap() {
		if(this.current_map === this.home_town){
			this.level += 1;
			this.setDungeon();
		} else {
			this.setHomeTown();
		}
	}

	previousMap(){
		if(this.current_map === this.home_town){
			this.level -= 1;
			this.setDungeon();
		} else {
			this.setHomeTown();
		}
	}

	updateEntities(){
		this.running = true;
		while(this.running){
			this.entities.next();
			this.entities.current.process();
		}
	}

	update(ch = null, key = null) {
		process.stdin.pause();
		this.processCommand(ch, key);
		this.updateEntities();
		console.clear();
		this.show();
		this.cmd = null;
		process.stdin.resume();
	}

	processCommand(ch = null, key = null){
		// process menus
		this.pressed = {char: ch, key: key};
	}

	show() {
		let world_dim = this.current_map.region;
		let anchor_pos = this.player.position;
		let region = this.camera.getRegion(world_dim, anchor_pos);

		this.current_map.show(region);
	}

	waitInput(){
		this.running = false;
	}

	move(entity, nextPosition){
		let cell = this.current_map.getCell(nextPosition.y, nextPosition.x);
		if(cell && cell.canMove){
			let pos = entity.position;
			let old_cell = this.current_map.getCell(pos.y, pos.x);
			if(old_cell){
				old_cell.entity = null;
				if(old_cell.trigger){
					old_cell.trigger.event_out(entity);
				}
			}
			cell.entity = entity;
			entity.position = nextPosition;
			if(cell.trigger){
				cell.trigger.event_over(entity);
			}
		} else {
			if(cell && cell.isWall){
				entity.handle_wall_collision(nextPosition);
			} else if(cell && cell.entity){
				entity.handle_collision(cell.entity);
			} else {
				entity.handle_collision(null);
			}
		}
	}

	fire_trigger(entity, nextPosition){
		let cell = this.current_map.getCell(nextPosition.y, nextPosition.x);
		if(cell && cell.trigger){
			cell.trigger.event_activate(entity);
		}
	}

	listenInput() {
		var keypress = require('keypress');
		keypress(process.stdin);
		let current = this;
		process.stdin.on('keypress', function(ch, key) {
			if (key && key.ctrl && key.name == 'c') {
				process.stdin.pause();
			} else {
				current.update(ch, key);
			}
		});
		process.stdin.setRawMode(true);
		process.stdin.resume();
	}
}

let game = new Game();
game.start();
