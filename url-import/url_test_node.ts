import * as assert from 'assert'
import { Url } from './Url'

const eq = assert.deepStrictEqual.bind(assert)

namespace parent_is_js { 
  const x = new Url('https://mod.reggi.com/import-examples/js-no-pkg/index.js')
  const u = x.resolve('../js-pkg-tilde-nested/mod')
  
  eq(u.discoverFile().map(i => i.toString()), [
    'https://mod.reggi.com/import-examples/js-pkg-tilde-nested/mod.js',
    'https://mod.reggi.com/import-examples/js-pkg-tilde-nested/mod.json',
    'https://mod.reggi.com/import-examples/js-pkg-tilde-nested/mod/package.json',
    'https://mod.reggi.com/import-examples/js-pkg-tilde-nested/mod/index.js',
    'https://mod.reggi.com/import-examples/js-pkg-tilde-nested/mod/index.json'
  ])
}

namespace parent_is_ts { 
  const x = new Url('https://mod.reggi.com/import-examples/js-no-pkg/index.ts')
  const u = x.resolve('../js-pkg-tilde-nested/mod')
  
  eq(u.discoverFile().map(i => i.toString()), [
    'https://mod.reggi.com/import-examples/js-pkg-tilde-nested/mod.ts',
    'https://mod.reggi.com/import-examples/js-pkg-tilde-nested/mod.js',
    'https://mod.reggi.com/import-examples/js-pkg-tilde-nested/mod.json',
    'https://mod.reggi.com/import-examples/js-pkg-tilde-nested/mod/package.json',
    'https://mod.reggi.com/import-examples/js-pkg-tilde-nested/mod/index.ts',
    'https://mod.reggi.com/import-examples/js-pkg-tilde-nested/mod/index.js',
    'https://mod.reggi.com/import-examples/js-pkg-tilde-nested/mod/index.json'
  ])
}

namespace child_has_ext { 
  const x = new Url('https://mod.reggi.com/import-examples/js-no-pkg/index.js')
  const u = x.resolve('../js-pkg-tilde-nested/mod.ts')
  
  eq(u.discoverFile().map(i => i.toString()), [
    'https://mod.reggi.com/import-examples/js-pkg-tilde-nested/mod.ts'
  ])
}

