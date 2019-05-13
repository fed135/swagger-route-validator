const {type} = require('../../../src/valueValidator');

const testType = 'object';
const setDefault = () => {};


test(`Can detect valid ${testType} typing`, () => {
    expect(type('', { foo: 'bar' }, testType, []).length).toBe(0);
});

test(`Can detect invalid ${testType} typings`, () => {
    expect(type('', -1, testType, []).length).toBe(1);
    expect(type('', 0.5, testType, []).length).toBe(1);
    expect(type('', true, testType, []).length).toBe(1);
    expect(type('', 'a', testType, []).length).toBe(1);
    expect(type('', [1,2,3], testType, []).length).toBe(1);
});