import assert from 'node:assert/strict';

export function expect(expectation: boolean) {
  return function failIf(value: boolean, message: string) {
    if (expectation === value) assert.fail(message);
    else assert.ok(true);

    return value;
  };
}
