class CircularLinkedList {

	#count = 0;
	#head = null;

	get length() {
		return this.#count;
	}

	get current() {
		return this.#head.element;
	}

	next() {
		var e = this.#head.element;
		this.#head = this.#head.next;
		return e;
	}

	add(element) {
		if (!this.#head) {
			this.#head = { element: element };
			this.#head.next = this.#head;
		} else {
			var e = { element: element, next: this.#head.next };
			this.#head.next = e;
		}
		this.#count += 1;
	}

	has(element) {
		if (this.#count == 0) {
			throw ("The list is empty!");
		}

		var current = this.#head;
		for (let c = 0; c < this.#count; c++) {
			if (element.id == current.element.id) {
				return true;
			} else {
				current = current.next;
			}
		}
		return false;
	}

	del(element) {
		if (this.#count == 0) {
			throw ("The list is empty!");
		}
		if (this.#count == 1) {
			this.#head = null;
			this.#count = 0;
		} else {
			let previous = this.#head;
			let current = this.#head.next;
			let index = 0;
			while (index < this.#count && element.id != current.element.id) {
				index += 1;
				previous = previous.next;
				current = current.next;
			}
			if (element.id == current.element.id) {
				previous.next = current.next;
				this.#count -= 1;
				if (this.#head.element.id == current.element.id) {
					this.#head = current.next;
				}
			}
		}
		//this.print();
	}

	isEmpty() {
		return this.#count == 0;
	}

	clear() {
		this.#head = null;
		this.#count = 0;
	}

	print() {
		var current = this.#head;
		for (let c = 0; c < this.#count; c++) {
			console.log("<" + current.element.id + ", " + current.element.name + ">");
			current = current.next;
		}
		console.log("");
	}
}
exports.CircularLinkedList = CircularLinkedList;
