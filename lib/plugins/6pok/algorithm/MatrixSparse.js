export class MatrixSparse {

	#rows = new Map();

	get(row, col) {
		if (this.#rows.has(row)) {
			return this.#rows.get(row).get(col);
		}
		return null;
	}

	del(row, col) {
		if (this.#rows.has(row)) {
			this.#rows.get(row).delete(col);
		}
	}

	put(row, col, value) {
		if (!this.#rows.has(row)) {
			this.#rows.set(row, new Map());
		}
		this.#rows.get(row).set(col, value);
	}

	has(row, col) {
		if (!this.#rows.has(row)) {
			return this.#rows.get(row).has(col);
		}
		return false;
	}

	*entries() {
		for (let [row, vet] of this.#rows.entries()) {
			for (let [col, val] of vet.entries()) {
				yield [row, col, val];
			}
		}
	}

	*keys() {
		for (let [row, vet] of this.#rows.entries()) {
			for (let col of vet.keys()) {
				yield [row, col];
			}
		}
	}

	*values() {
		for (let vet of this.#rows.values()) {
			for (let value of vet.values()) {
				yield value;
			}
		}
	}

	clone() {
		let mat = new MatrixSparse();
		for (let [row, col, val] of this.entries()) {
			mat.put(row, col, val);
		}
		return mat;
	}
}
