import { test } from 'node:test';
import { formatString as format } from '../../../src/format.ts';
import { expect } from '../utils.ts';

const testFormat = 'uri-template';

test(`Can detect valid ${testFormat} formats`, () => {
  format('/users/{id}', testFormat, expect(true));
  format('/users/{id}{?page,size}', testFormat, expect(true));
  format('{+path}/here', testFormat, expect(true));
  format('/a/{var:3}', testFormat, expect(true));
  format('/a/{list*}', testFormat, expect(true));
  format('http://example.com/~{user}/', testFormat, expect(true));
  format('plain', testFormat, expect(true));
});

test(`Can detect invalid ${testFormat} formats`, () => {
  format('/users/{id', testFormat, expect(false));
  format('/users/id}', testFormat, expect(false));
  format('/a/{}', testFormat, expect(false));
  format('/a/{var:0}', testFormat, expect(false));
  format('/a/{var:10000}', testFormat, expect(false));
  format('/a/{ id }', testFormat, expect(false));
  format('/a b', testFormat, expect(false));
});
