
ig.module('game.Constants')
    .requires(
).defines(function () {

    let populate = function (array) {
        array.forEach(e => array[e] = e);
        array.index = {};
        array.forEach((e, i) => array.index[e] = i);
    };

    ANIMAL = ['Adax', 'Alce', 'Almiqui', 'Anta', 'Arganaz', 'Asellia', 'Asno'];
    populate(ANIMAL);

    STAT = ['hp', 'atk', 'def', 'spatk', 'spdef', 'speed'];
    populate(STAT);

    TYPE = ['Air', 'Dark', 'Eletric', 'Fire', 'Ghost', 'Grass', 'Ground', 'Holy', 'Ice', 'Magic', 'Metal', 'Profane', 'Psychic', 'Rock', 'Sand', 'Toxic', 'Water'];
    populate(TYPE);

    NATURE = ["Hardy", "Lonely", "Brave", "Adamant", "Naughty", "Bold", "Docile", "Relaxed", "Impish", "Lax", "Timid", "Hasty", "Serious", "Jolly", "Naive", "Modest", "Mild", "Quiet", "Bashful", "Rash", "Calm", "Gentle", "Sassy", "Careful", "Quirky"];
    populate(NATURE);
});