// Run: node tests/draw.test.js
const assert = require('assert');
const draw = require('../js/draw.js');

const ranks = n => Array.from({ length:n }, (_, i) => ({ name:'P' + (i + 1), rating:100 - i }));
const rankNumbers = groups => groups.map(g => g.map(p => Number(p.name.slice(1))));

// README example: 7 players, 2 groups → [1,4,5,7] and [2,3,6].
assert.deepStrictEqual(rankNumbers(draw.seedPlayersSerpentine(ranks(7), 2)), [[1,4,5,7],[2,3,6]]);

// Capacities: group 1 takes the first extra, the rest go to groups 3, 4, ...
assert.deepStrictEqual(draw.groupCapacities(10, 3), [4,3,3]);
assert.deepStrictEqual(draw.groupCapacities(11, 3), [4,3,4]);
assert.deepStrictEqual(draw.groupCapacities(8, 2), [4,4]);

// Every variant keeps sizes, keeps the top seed in group 1, and cycles back to the reference.
for(const [n, g] of [[7,2],[9,2],[12,3],[13,3],[5,1]]){
    const players = ranks(n).reverse(); // input order must not matter
    const total = draw.variantCount(n, g);
    const reference = JSON.stringify(rankNumbers(draw.seedPlayersSerpentine(players, g, 0)));
    const seen = new Set();
    for(let v = 0; v < total; v++){
        const groups = draw.seedPlayersSerpentine(players, g, v);
        assert.deepStrictEqual(groups.map(x => x.length), draw.groupCapacities(n, g));
        assert.ok(groups[0].some(p => p.name === 'P1'), 'top seed in group 1');
        seen.add(JSON.stringify(rankNumbers(groups)));
    }
    assert.strictEqual(seen.size, total, `all ${total} variants differ for ${n}/${g}`);
    assert.strictEqual(JSON.stringify(rankNumbers(draw.seedPlayersSerpentine(players, g, total))), reference);
}

assert.strictEqual(draw.suggestedGroupCount(5), 1);
assert.strictEqual(draw.suggestedGroupCount(6), 2);
assert.strictEqual(draw.suggestedGroupCount(11), 3);

// n01 names: nickname if known, else surname, full name when surnames clash.
const names = draw.n01Names(
    [{ name:'Матвійчук Олександр' }, { name:'Форманюк Андрій' }, { name:'Корпусов Андрій' }, { name:'Корпусов Іван' }, { name:'Іра' }],
    [{ alias:'Чубатий', name:'Матвійчук Олександр' }]
);
assert.deepStrictEqual([...names.values()], ['Чубатий', 'Форманюк', 'Корпусов Андрій', 'Корпусов Іван', 'Іра']);
assert.strictEqual(
    draw.formatGroups([[{ name:'Іра' }], [{ name:'Форманюк Андрій' }]], names, 'Група'),
    'Група 1\nІра\n\nГрупа 2\nФорманюк'
);
console.log('draw tests passed');
