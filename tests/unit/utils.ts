import assert from 'node:assert/strict';

export function expect(expectation: boolean) {
  return function failIf(value: boolean, message: string) {
    if (expectation === value) assert.fail(message);
    else assert.ok(true);

    return value;
  };
}

export function generateRequest(attributes?: any) {
  const base = Object.assign({
    url: '/',
    params: {},
    method: 'get',
    headers: {},
    header: undefined,
    query: {},
    body: null
  }, attributes ?? {});

  const header = { get: (name: string) => base.headers[name.toLowerCase()] ?? null };

  return Object.assign(base, { header });
}
