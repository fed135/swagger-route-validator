const types = require('../../../src/type');

const testType = 'object';
const setDefault = () => {};


test(`Can detect valid ${testType} typing`, () => {
    expect(types('', { foo: 'bar' }, testType, []).length).toBe(0);
});

test(`Can detect invalid ${testType} typings`, () => {
    expect(types('', -1, testType, []).length).toBe(1);
    expect(types('', 0.5, testType, []).length).toBe(1);
    expect(types('', true, testType, []).length).toBe(1);
    expect(types('', 'a', testType, []).length).toBe(1);
    expect(types('', [1,2,3], testType, []).length).toBe(1);
});