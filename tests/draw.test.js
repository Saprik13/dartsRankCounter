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

// Club match orders: every pair exactly once.
for(const size of [2,3,4,5,6,7,8]){
    const games = draw.groupSchedule(size);
    assert.strictEqual(games.length, size * (size - 1) / 2, `games for ${size}`);
    const pairs = new Set(games.map(([a, b]) => `${a}-${b}`));
    assert.strictEqual(pairs.size, games.length, `unique pairs for ${size}`);
    games.forEach(([a, b]) => assert.ok(a >= 1 && b <= size && a < b));
}
assert.deepStrictEqual(draw.groupSchedule(3).map(([a,b]) => `${a}-${b}`), ['1-3','2-3','1-2']);

// Tournament JSON shaped like n01's export (05.11: groups of 4, 3, 4).
const eleven = draw.seedPlayersSerpentine(ranks(11), 3);
const shortNames = new Map(eleven.flat().map(p => [p.name, p.name]));
const json = draw.buildN01Tournament(eleven, shortNames, { date:'2026-11-12' });
assert.strictEqual(json.title, 'Lutsk Pub Darts 12.11.2026');
assert.strictEqual(json.entry_list.length, 11);
assert.deepStrictEqual(json.rr_table.map(r => r.filter(Boolean).length), [4,3,4]);
assert.strictEqual(json.rr_table[1][3], '', 'short group padded like n01 does');
assert.strictEqual(json.rr_setting.robin_count, 3);
assert.strictEqual(json.rr_setting.robin_player_count, 4);
assert.deepStrictEqual(json.rr_seq.map(s => s.length), [6,3,6]);
assert.deepStrictEqual(json.rr_order['4'], [[0,2],[1,3],[0,3],[1,2],[2,3],[0,1]]);
assert.deepStrictEqual(json.t_table.map(r => r.length), [8,4,2,1]);
assert.ok(json.t_table.flat().every(x => x === ''), 'playoff is filled manually later');
assert.strictEqual(json.t_setting.t_player_count, 8);
assert.strictEqual(json.rr_setting.rounds, 15);
assert.strictEqual(json.t_setting.rounds, 15);
const tp = new Set(json.entry_list.map(e => e.tpid));
assert.strictEqual(tp.size, 11);
json.rr_seq.flat(2).forEach(id => assert.ok(tp.has(id)));
console.log('n01 export tests passed');

// Pot draw: each group gets exactly one player from every full pot, sizes differ by ≤1,
// players inside a group stay ordered by rating, and the draw is random.
let seed = 7;
const rng = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
for(const [n, g] of [[12,3],[11,3],[8,2],[19,4],[5,1]]){
    for(let run = 0; run < 20; run++){
        const groups = draw.drawByPots(ranks(n).reverse(), g, rng);
        const sizes = groups.map(x => x.length);
        assert.ok(Math.max(...sizes) - Math.min(...sizes) <= 1, `sizes ${sizes}`);
        assert.strictEqual(sizes.reduce((a, b) => a + b), n);
        groups.forEach(members => {
            members.forEach((p, i) => {
                assert.strictEqual(p.pot, Math.floor((Number(p.name.slice(1)) - 1) / g) + 1, 'pot = block of g by rating');
                if(i) assert.ok(members[i - 1].rating >= p.rating, 'ordered by rating');
            });
            assert.strictEqual(new Set(members.map(p => p.pot)).size, members.length, 'one per pot');
        });
    }
}
const firstGroups = new Set();
for(let run = 0; run < 50; run++) firstGroups.add(draw.drawByPots(ranks(12), 3, rng).findIndex(m => m.some(p => p.name === 'P1')));
assert.strictEqual(firstGroups.size, 3, 'top seed lands in any group');
console.log('pot draw tests passed');
