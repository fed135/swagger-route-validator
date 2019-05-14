const values = require('../../../src/valueValidator').validateValue;
const set = require('lodash.set');

const testValue = 'default';

test(`Can apply ${testValue} values`, () => {
    const obj = {};
    const setDefault = (cursor, value) => { set(obj, cursor, value); };
    expect(values('foo', obj.foo, { [testValue]: 'a', type: 'string' }, setDefault, []).length).toBe(0);
    expect(obj.foo).toBe('a');
});

test(`Can apply nested ${testValue} values`, () => {
    const obj = { bar: {} };
    const setDefault = (cursor, value) => { set(obj, cursor, value); };
    expect(values('bar.foo', obj.bar.foo, { [testValue]: 'a', type: 'string' }, setDefault, []).length).toBe(0);
    expect(obj.bar.foo).toBe('a');
});

test('Can passively apply typed values for integers', () => {
    const obj = { bar: '1' };
    const setDefault = (cursor, value) => { set(obj, cursor, value); };
    expect(values('bar', obj.bar, { [testValue]: 2, type: 'integer' }, setDefault, []).length).toBe(0);
    expect(obj.bar).toBe(1);
});

test('Can passively apply typed values for numbers', () => {
    const obj = { bar: '.5' };
    const setDefault = (cursor, value) => { set(obj, cursor, value); };
    expect(values('bar', obj.bar, { [testValue]: 1, type: 'number' }, setDefault, []).length).toBe(0);
    expect(obj.bar).toBe(0.5);
});

test('Can passively apply typed values for booleans', () => {
    const obj = { bar: 'false' };
    const setDefault = (cursor, value) => { set(obj, cursor, value); };
    expect(values('bar', obj.bar, { [testValue]: true, type: 'boolean' }, setDefault, []).length).toBe(0);
    expect(obj.bar).toBe(false);
});