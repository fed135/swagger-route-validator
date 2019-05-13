const types = require('../../../src/type');

const testType = 'boolean';
const setDefault = () => {};
const specs = {};

test(`Can detect valid ${testType} typing`, () => {
    expect(types('', true, testType, specs, setDefault, []).length).toBe(0);
    expect(types('', false, testType, specs, setDefault, []).length).toBe(0);
    expect(types('', 'true', testType, specs, setDefault, []).length).toBe(0);
    expect(types('', 'false', testType, specs, setDefault, []).length).toBe(0);
});

test(`Can detect invalid ${testType} typings`, () => {
    expect(types('', 1, testType, specs, setDefault, []).length).toBe(1);
    expect(types('', 'a', testType, specs, setDefault, []).length).toBe(1);
    expect(types('', 0.5, testType, specs, setDefault, []).length).toBe(1);
    expect(types('', { foo: 'bar' }, testType, specs, setDefault, []).length).toBe(1);
    expect(types('', [1,2,3], testType, specs, setDefault, []).length).toBe(1);
});