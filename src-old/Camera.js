const { Position } = require("./Position");
const { Dimension } = require("./Dimension");

class Camera {

	constructor(visible = new Dimension(20, 10)) {
		this.visible = visible;
	}

	getMetrics(world_region){
		let region = world_region.clone();

		let half = new Position();
		half.x = Math.floor(this.visible.width / 2);
		half.y = Math.floor(this.visible.height / 2);

		let min = new Position(world_region.x1, world_region.y1);
		min.add(half);

		let max = new Position(world_region.x2, world_region.y2);
		max.sub(half);

		let world_dim = world_region.dimension;

		return [region, half, min, max, world_dim];
	}

	getRegion(world_region, anchor_pos) {
		let [region, half, min, max, world_dim] = this.getMetrics(world_region);

		if (world_dim.width > this.visible.width) {
			if (anchor_pos.x >= min.x && anchor_pos.x < max.x) {
				region.x1 = anchor_pos.x - half.x;
				region.x2 = anchor_pos.x + half.x;
			} else if (anchor_pos.x >= max.x) {
				region.x1 = world_region.x2 - this.visible.width;
				region.x2 = world_region.x2;
			} else { // anchor_pos.x < min.x
				region.x1 = world_region.x1;
				region.x2 = world_region.x1 + this.visible.width;
			}
		}
		if (world_dim.height > this.visible.height) {
			if (anchor_pos.y >= min.y && anchor_pos.y < max.y) {
				region.y1 = anchor_pos.y - half.y;
				region.y2 = anchor_pos.y + half.y;
			} else if (anchor_pos.y >= max.y) {
				region.y1 = world_region.y2 - this.visible.height;
				region.y2 = world_region.y2;
			} else {
				region.y1 = world_region.y1;
				region.y2 = world_region.y1 + this.visible.height;
			}
		}
		return region;
	}
}

exports.Camera = Camera;
