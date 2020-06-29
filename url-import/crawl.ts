import * as path from 'path'
import * as download from 'download'
import { Url } from './Url'
import { dependencies } from './depend'

class PackageCache {
  store: any = { }

  add(item: { url: Url, pkg: any }) { 
    this.store[item.url.toString()] = item.pkg
  }

  find(url: string) {
    try {
      return this.store[url]
    } catch { 
     return false 
    }
  }
}

function pkgHandler(url: Url, cache: PackageCache, pkgdir: string) { 
  if (url.basename === 'package.json') { 
    const u = url.toString()
    const match = cache.find(u)
    if (match) return match
    const dir = pkgdir + url.localize

    // download(u, )
  }
  return false
}

async function attemptDownload(url: Url, dir: string = __dirname) {
  try {
    const buf = await download(
      url.toString(),
      path.join(dir, url.localizeDir),
      { filename: url.basename }
    )
    const file = buf.toString('utf-8')
    if (url.basename === 'package.json') { 
      const parsed = JSON.parse(file)
      if (parsed.main) { 
        const newTip = url.resolve(parsed.main)
        const results = await attemptDownload(newTip, dir)
        if (results) { 
          return { ...results, pkg: { parsed, url} }
        }
        return { pkg: { parsed, url } }
      }
    }
    return { file, url }
  } catch (e) { 
    return { url }
  }
}

async function downloadUrl(url: Url, dir: string = __dirname) { 
  let found = false
  const urls = url.discoverFile()
  const results = await Promise.all(urls.map(async url => {
    if (found) return;
    const result = await attemptDownload(url, dir)
    if (result?.file) {
      found = true
      return result
    }
    return;
  }))
  const valid = results.filter(r => r)
  if (!valid.length) throw new Error(`file not found for ${url.toString()}`)
  return valid[0]
}

/** 
 * Represents the tip of the iceburg, a url
 * that is downloaded, ast parsed, then more
 * urls resolved from that file, ideally there's
 * some way to cache package.json files along the
 * way so we can refer back to them
 * 
 * At the end of this we should have alot so
 * it's best to outline what the results are
 * this class.
 * 
 * 1) Download and name files
 * 2) Cache lock file
 * 3) Pick relevent npm modules and create package.json
 * 4) Resolve relative package "file:"
 * 5) Optionally install npm modules
 */
async function crawl(tip: string) {
  const cache = new PackageCache()
  const url = Url.parse(tip)
  const results = await downloadUrl(url, path.join(__dirname, '../downloads'))
  if (results?.pkg) cache.add(results.pkg)
  if (results?.file) {
    const { urls, local, native, nonNative } = dependencies(results.file)
    console.log({ urls, local, native, nonNative })
  }
}

crawl('https://raw.githubusercontent.com/reggi/modules/master/import-examples/js-pkg-tilde/index.js').then(console.log)
