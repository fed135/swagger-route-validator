const {type} = require('../../../src/valueValidator');

const testType = 'array';
const setDefault = () => {};

test(`Can detect valid ${testType} typing with no params`, () => {
    const spec = { items: { type: 'integer' } };
    expect(type('', [1,2,3], testType, spec, setDefault, []).length).toBe(0);
});

test(`Can detect valid ${testType} typing with minItems`, () => {
    const spec = { items: { type: 'integer' }, minItems: 4 };
    expect(type('', [1,2,3,4,5], testType, spec, setDefault, []).length).toBe(0);
});

test(`Can detect valid ${testType} typing with maxItems`, () => {
    const spec = { items: { type: 'integer' }, maxItems: 2 };
    expect(type('', [1,2], testType, spec, setDefault, []).length).toBe(0);
});

test(`Can detect valid ${testType} typing with minItems & maxItems`, () => {
    const spec = { items: { type: 'integer' }, minItems: 4, maxItems: 5 };
    expect(type('', [1,2,3,4], testType, spec, setDefault, []).length).toBe(0);
});

test(`Can detect valid ${testType} typing with nested objects`, () => {
    const spec = { items: { type: 'object', properties: { foo: { type: 'integer' } } } };
    expect(type('', [{ foo: 123 }, { foo: 456 }], testType, spec, setDefault, []).length).toBe(0);
});

test(`Can detect invalid ${testType} typings`, () => {
    const spec = { items: { type: 'integer' } };
    expect(type('', true, testType, spec, setDefault, []).length).toBe(1);
    expect(type('', 1, testType, spec, setDefault, []).length).toBe(1);
    expect(type('', 'a', testType, spec, setDefault, []).length).toBe(1);
    expect(type('', 0.5, testType, spec, setDefault, []).length).toBe(1);
    expect(type('', { foo: 'bar' }, testType, spec, setDefault, []).length).toBe(1);
});

test(`Can detect invalid ${testType} item type validation`, () => {
    const spec = { items: { type: 'integer' } };
    expect(type('', ['a'], testType, spec, setDefault, []).length).toBe(1);
});

test(`Can detect invalid ${testType} validation of minItems`, () => {
    const spec = { items: { type: 'integer' }, minItems: 4 };
    expect(type('', [1,2], testType, spec, setDefault, []).length).toBe(1);
});

test(`Can detect invalid ${testType} validation of maxItems`, () => {
    const spec = { items: { type: 'integer' }, maxItems: 3 };
    expect(type('', [1,2,3,4], testType, spec, setDefault, []).length).toBe(1);
});