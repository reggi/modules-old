import * as assert from 'assert'
import { Hierarchy } from './hierarchy'
const deepEqual = assert.deepStrictEqual.bind(assert);
const equal = assert.strictEqual.bind(assert);

console.log('relative');

[
  './foo/bar/baz',
  './/foo/bar/baz',
  './foo/////bar/baz',
  './foo/////bar/baz//',
  'foo/bar/baz',
  'foo/bar/baz',
  'foo/////bar/baz',
  'foo/////bar/baz//',
].map(p => deepEqual(Hierarchy.split(p), ['.', 'foo', 'bar', 'baz']));

console.log('upper');

[
  '../foo/bar/baz',
  '..//foo/bar/baz',
  '../foo/////bar/baz',
  '../foo/////bar/baz//',
].map(p => deepEqual(Hierarchy.split(p), ['..', 'foo', 'bar', 'baz']));

console.log('absolute');

[
  '/foo/bar/baz',
  '//foo/bar/baz',
  '/foo/////bar/baz',
  '/foo/////bar/baz//',
].map(p => deepEqual(Hierarchy.split(p), ['', 'foo', 'bar', 'baz']))

console.log('resolve')

equal(Hierarchy.resolve("../url-import/../url-import/../url-import/../url-import/"), "../url-import")
equal(Hierarchy.resolve("../../foo/../bar/../baz"), "../../baz")
equal(Hierarchy.resolve("./foo/a/../a/"), "./foo/a")
equal(Hierarchy.resolve("/foo/a/../a/"), "/foo/a")
equal(Hierarchy.resolve("/foo/a"), "/foo/a")
