class Random {

	constructor(seed) {
		this.rand = Random.create(String(seed));
	}

	next() {
		return this.rand();
	}

	nextInt(n) {
		return this.next() % n;
	}

	nextRange(min, max) {
		return min + (this.next() % (max - min));
	}

	nextDouble() {
		// [0,1)
		return this.next() / 4294967296;
	}

	nextBoolean() {
		return this.nextDouble() >= 0.5;
	}

	//https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript
	static create(str = 'seed') {
		let seed = Random.cyrb128(str);
		let rand = Random.xoshiro128ss(seed[0], seed[1], seed[2], seed[3]);
		return rand;
	}

	static cyrb128(str) {
		let h1 = 1779033703, h2 = 3144134277, h3 = 1013904242, h4 = 2773480762;
		for (let i = 0, k; i < str.length; i++) {
			k = str.charCodeAt(i);
			h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
			h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
			h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
			h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
		}
		h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
		h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
		h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
		h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
		return [(h1 ^ h2 ^ h3 ^ h4) >>> 0, (h2 ^ h1) >>> 0, (h3 ^ h1) >>> 0, (h4 ^ h1) >>> 0];
	}

	static xoshiro128ss(a, b, c, d) {
		return function () {
			var t = b << 9, r = a * 5; r = (r << 7 | r >>> 25) * 9;
			c ^= a; d ^= b;
			b ^= c; a ^= d; c ^= t;
			d = d << 11 | d >>> 21;
			return (r >>> 0); // / 4294967296;
		};
	}
}

exports.Random = Random;
