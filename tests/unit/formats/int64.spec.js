const format = require('../../../src/format');

const testFormat = 'int64';

test(`Can detect valid ${testFormat} format number`, () => {
    expect(format('', 1, testFormat, []).length).toBe(0);
    expect(format('', 0, testFormat, []).length).toBe(0);
    expect(format('', -1, testFormat, []).length).toBe(0);
    expect(format('', -9223372036854776001, testFormat, []).length).toBe(0);
    expect(format('', 9223372036854776000, testFormat, []).length).toBe(0);
    expect(format('', -9223372036854776002, testFormat, []).length).toBe(0); // Gets rounded to MAX_SAFE_INTEGER
    expect(format('', 9223372036854776001, testFormat, []).length).toBe(0); // Gets rounded to MAX_SAFE_INTEGER
});

test(`Can detect invalid ${testFormat} formats`, () => {
    expect(format('', '1', testFormat, []).length).toBe(1);
    expect(format('', 'a', testFormat, []).length).toBe(1);
    expect(format('', 0.5, testFormat, []).length).toBe(1);
});