const format = require('../../../src/format');

const testFormat = 'int16';

test(`Can detect valid ${testFormat} format number`, () => {
    expect(format('', 1, testFormat, []).length).toBe(0);
    expect(format('', 0, testFormat, []).length).toBe(0);
    expect(format('', -1, testFormat, []).length).toBe(0);
    expect(format('', -32768, testFormat, []).length).toBe(0);
    expect(format('', 32767, testFormat, []).length).toBe(0);
});

test(`Can detect invalid ${testFormat} formats`, () => {
    expect(format('', '1', testFormat, []).length).toBe(1);
    expect(format('', 'a', testFormat, []).length).toBe(1);
    expect(format('', 0.5, testFormat, []).length).toBe(1);
    expect(format('', -32769, testFormat, []).length).toBe(1);
    expect(format('', 32768, testFormat, []).length).toBe(1);
});