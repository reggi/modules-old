import { Hierarchy } from './hierarchy'
import { ExtendUrl } from './extend_url'
import { System } from './system'

export class Url extends ExtendUrl { 
  parent?: Url
  constructor(url: string) { 
    super(url)
  }

  static parse(url: string) { 
    return new Url(url)
  }

  get pathnameSplit() { 
    return this.pathname.split('/').filter(i => i !== '')
  }

  get basename() { 
    if (this.pathnameSplit.length) return this.pathnameSplit[this.pathnameSplit.length - 1]
    return ''
  }

  set basename(value: string) { 
    const p = [...this.pathnameSplit]
    p.push(value)
    this.pathname = p.join('/')
  }

  get ext() {
    const s = this.basename.split('.')
    if (s.length > 1) return `.${s[s.length - 1]}`
    return ''
  }

  get hasExt() { 
    return Boolean(this.ext !== '')
  }

  get dirname() {
    const p = [...this.pathnameSplit]
    if (this.ext) {
      p.pop()
      return p.join('/')
    }
    return this.pathnameSplit.join('/')
  }

  get localize() {
    const protocol = this.protocol.replace(/:/i, '')
    const host = this.port ? `${this.host}_PORT${this.port}` : this.host
    const parts = [protocol, host, ...this.pathnameSplit]
    return parts.join(System.sep)
  }

  get localizeDir() {
    const directory = this.localize.split('/')
    directory.pop()
    return directory.join('/')
  }

  resolve(path: string) {
    const u = new Url(this.toString())
    u.pathname = Hierarchy.resolve('/' + this.dirname + '/' + path)
    u.parent = this
    return u
  }

  discoverFile() {
    if (this.hasExt) return [this]
    const parentExt = this.parent?.hasExt
    const findExt = ['.js', '.json']
    const top = parentExt ? [this.parent.ext] : []
    const priorityExt = [...top, ...findExt]
    const uniq = priorityExt.filter((item, pos) => priorityExt.indexOf(item) == pos)
    const up = Hierarchy.resolve(this.dirname + '/..')
    const rootCheck = uniq.map(i => `${this.basename}${i}`).map(i => {
      const u = new Url(this.toString())
      u.pathname = up
      u.basename = i
      return u
    })
    const file = ['package.json', ...uniq.map(i => `index${i}`)].map(file => { 
      const u = new Url(this.toString())
      u.basename = file
      return u
    })
    return [...rootCheck, ...file]
  }

}