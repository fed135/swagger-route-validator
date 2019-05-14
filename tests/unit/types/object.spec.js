const {type} = require('../../../src/valueValidator');

const testType = 'object';
const setDefault = () => {};


test(`Can detect valid ${testType} typing with no params`, () => {
    const spec = { properties: { foo: { type: 'integer' } } };
    expect(type('', { foo: 123 }, testType, spec, setDefault, []).length).toBe(0);
});

test(`Can detect invalid ${testType} typing with no params`, () => {
    const spec = { properties: { foo: { type: 'integer' } } };
    expect(type('', { foo: 'abc' }, testType, spec, setDefault, []).length).toBe(1);
});

test(`Can detect valid nested ${testType} typing with no params`, () => {
    const spec = { properties: { foo: { type: 'object', properties: { bar: { type: 'integer' } } } } };
    expect(type('', { foo: { bar: 123} }, testType, spec, setDefault, []).length).toBe(0);
});

test(`Can detect invalid nested ${testType} typing with no params`, () => {
    const spec = { properties: { foo: { type: 'object', properties: { bar: { type: 'integer' } } } } };
    expect(type('', { foo: { bar: 'abc'} }, testType, spec, setDefault, []).length).toBe(1);
});

test(`Can detect valid ${testType} typing with required properties`, () => {
    const spec = { properties: { foo: { type: 'integer' } }, required: ['foo'] };
    expect(type('', { foo: 123 }, testType, spec, setDefault, []).length).toBe(0);
});

test(`Can detect invalid ${testType} typing with required properties`, () => {
    const spec = { properties: { foo: { type: 'integer' } }, required: ['foo'] };
    expect(type('', { bar: 123 }, testType, spec, setDefault, []).length).toBe(1);
});

test(`Can detect invalid ${testType} typing with extra properties`, () => {
    const spec = { properties: { foo: { type: 'integer' } }, additionalProperties: false };
    expect(type('', { bar: 123, foo: 456 }, testType, spec, setDefault, []).length).toBe(1);
});

test(`Can detect invalid ${testType} typings`, () => {
    const spec = { properties: { foo: { type: 'integer' } } };
    expect(type('', -1, testType, spec, setDefault, []).length).toBe(1);
    expect(type('', 0.5, testType, spec, setDefault, []).length).toBe(1);
    expect(type('', true, testType, spec, setDefault, []).length).toBe(1);
    expect(type('', 'a', testType, spec, setDefault, []).length).toBe(1);
    expect(type('', [1,2,3], testType, spec, setDefault, []).length).toBe(1);
});