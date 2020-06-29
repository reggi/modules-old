import * as path from 'path'
import * as download from 'download'
import { Url } from './Url'

class PackageCache {
  store: any = { }

  add(url: string, pkg: any) { 
    this.store[url] = pkg
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

async function attemptDownload(url: Url, dir: string = __dirname): Promise<string | undefined> {
  try {
    const buf = await download(
      url.toString(),
      path.join(dir, url.localizeDir),
      { filename: url.basename }
    )
    return buf.toString('utf-8')
  } catch (e) { 
    return
  }
}

async function downloadUrl(url: Url, dir: string = __dirname) { 
  let found = false
  const urls = url.discoverFile()
  const results = await Promise.all(urls.map(async url => {
    if (found) return;
    const file = await attemptDownload(url, dir)
    if (file) { 
      found = true
      return { file, url }
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
  return await downloadUrl(url, path.join(__dirname, '../downloads'))
}

crawl('https://raw.githubusercontent.com/reggi/modules/master/import-examples/js-pkg').then(console.log)
