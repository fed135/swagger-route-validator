const types = require('../../../src/type');

const testType = 'array';
const setDefault = () => {};

test(`Can detect valid ${testType} typing with no params`, () => {
    const spec = { items: { type: 'integer' } };
    expect(types('', [1,2,3], testType, spec, setDefault, []).length).toBe(0);
});

test(`Can detect valid ${testType} typing with minItems`, () => {
    const spec = { items: { type: 'integer' }, minItems: 4 };
    expect(types('', [1,2,3,4,5], testType, spec, setDefault, []).length).toBe(0);
});

test(`Can detect valid ${testType} typing with maxItems`, () => {
    const spec = { items: { type: 'integer' }, maxItems: 2 };
    expect(types('', [1,2], testType, spec, setDefault, []).length).toBe(0);
});

test(`Can detect valid ${testType} typing with minItems & maxItems`, () => {
    const spec = { items: { type: 'integer' }, minItems: 4, maxItems: 5 };
    expect(types('', [1,2,3,4], testType, spec, setDefault, []).length).toBe(0);
});

test(`Can detect invalid ${testType} typings`, () => {
    const spec = { items: { type: 'integer' } };
    expect(types('', true, testType, spec, setDefault, []).length).toBe(1);
    expect(types('', 1, testType, spec, setDefault, []).length).toBe(1);
    expect(types('', 'a', testType, spec, setDefault, []).length).toBe(1);
    expect(types('', 0.5, testType, spec, setDefault, []).length).toBe(1);
    expect(types('', { foo: 'bar' }, testType, spec, setDefault, []).length).toBe(1);
});

test(`Can detect invalid ${testType} item type validation`, () => {
    const spec = { items: { type: 'integer' } };
    expect(types('', ['a'], testType, spec, setDefault, []).length).toBe(0);
});

test(`Can detect invalid ${testType} validation of minItems`, () => {
    const spec = { items: { type: 'integer' }, minItems: 4 };
    expect(types('', [1,2], testType, spec, setDefault, []).length).toBe(0);
});

test(`Can detect invalid ${testType} validation of maxItems`, () => {
    const spec = { items: { type: 'integer' }, maxItems: 3 };
    expect(types('', [1,2,3,4], testType, spec, setDefault, []).length).toBe(0);
});