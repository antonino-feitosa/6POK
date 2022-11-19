
Array.prototype.shuffle = function (rand) {
	for (let i = 0; i < this.length - 1; i++) {
		let index = (i + 1) + rand.nextInt(this.length - i - 1);
		let aux = this[i];
		this[i] = this[index];
		this[index] = aux;
	}
}

Array.prototype.removeId = function (id) {
	let index = 0;
	let searching = true;
	while (index < this.length && searching) {
		if (this[index] && this[index].id && this[index].id === id) {
			searching = false;
		} else {
			index++;
		}
	}
	if (!searching) {
		while (index + 1 < this.length) {
			this[index] = this[index + 1];
			index++;
		}
		this.pop();
		return true;
	}
	return false;
}

exports.Array = Array;
