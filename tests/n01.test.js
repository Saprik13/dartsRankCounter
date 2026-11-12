// Run: node tests/n01.test.js
const assert = require('assert');
const n01 = require('../js/n01.js');

function places(file){
    const result = n01.computePlaces(require('./fixtures/' + file));
    return { result, byName: Object.fromEntries(result.players.map(p => [p.name, p.place])) };
}

// 22.10.2026: 2 groups of 4, top 3 into the bracket, group winners get a bye.
const oct22 = places('2026-10-22.json');
assert.strictEqual(oct22.result.type, 'se');
assert.strictEqual(oct22.result.groupCount, 2);
assert.deepStrictEqual(oct22.byName, {
    'Форманюк':'winner', 'Чубатий':'finalist', 'Лажневський':'semi', 'Шевчук':'semi',
    'Юля':'quarter', 'Грицюк':'quarter', 'Іра':'group4', 'Богдана':'group4'
});

// 15.10.2026: 6 players, 2 groups of 3 — matches the 15.10 column in the rating sheet.
const oct15 = places('2026-10-15.json');
assert.deepStrictEqual(oct15.byName, {
    'Форманюк':'winner', 'Чубатий':'finalist', 'Лажневський':'semi', 'Шевчук':'semi',
    'Юля':'quarter', 'Грицюк':'quarter'
});

const sheet = ['Матвійчук Олександр','Форманюк Андрій','Лажнєвський Андрій','Софлюк Юлія','Іра','Корпусов Андрій'];
assert.deepStrictEqual(n01.matchName('Форманюк', sheet, {}), { status:'token', name:'Форманюк Андрій' });
assert.deepStrictEqual(n01.matchName('Лажневський', sheet, {}), { status:'token', name:'Лажнєвський Андрій' }, 'є/е spelling');
assert.deepStrictEqual(n01.matchName('Іра', sheet, {}), { status:'exact', name:'Іра' });
assert.deepStrictEqual(n01.matchName('Чубатий', sheet, {}), { status:'none' });
assert.deepStrictEqual(n01.matchName('Чубатий', sheet, { 'чубатий':'Матвійчук Олександр' }), { status:'alias', name:'Матвійчук Олександр' });
assert.strictEqual(n01.matchName('Андрій', sheet, {}).status, 'ambiguous');
assert.strictEqual(n01.parseTournamentDate({ title:'Lutsk Pub Darts 8.11.2025' }), '2025-11-08');

console.log('n01 tests passed');
