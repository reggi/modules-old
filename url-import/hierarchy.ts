
/** 
 * Resolves & simplifies unix / node module paths
 * without touching the file system not meant for
 * use with windows machines. Creates a virtual
 * file system tree using directory `..` and `.`
 * notation. For use with node and deno.
 * 
 * @example `./foo/a/../a/` -> `./foo/a`
*/
export class Hierarchy { 

  static find(tree, child) {
    if (tree.index === child.index) return true
    if (!tree?.children) return false
    return tree.children.find(branch => {
      return Hierarchy.find(branch, child)
    })
  }

  static liniage(tree: any) { 
    const liniage = []
    const recursive = (current) => { 
      liniage.push(current.name)
      const parent = current?.parent ? current?.parent() : null
      if (parent) { 
        recursive(parent)
      }
      return liniage
    }
    return recursive(tree)
  }

  static findIndex(tree: any, index: number) { 
    if (tree.index === index) {
      return null
    }
    const recursive = (parent) => { 
      if (!parent.children) return null
      const match = parent.children.find(branch => branch.index === index)
      if (match) return match
      return parent.children.reduce((acq, branch) => { 
        if (acq) return acq
        return recursive(branch)
      })
    }
    return recursive(tree)
  }

  static attributes(name: string) { 
    const empty = ''
    const dot = '.'
    const isRoot = name === empty
    const isDot = name === dot
    const isDoubleDot = name === dot + dot
    const isNamed = !isRoot && !isDot && !isDoubleDot
    return { empty, dot, isRoot, isDot, isDoubleDot, isNamed }
  }

  static split(path: string) {
    const sep = '/' // using backslash because node modules use unix-style
    const split = path.split(sep)
    const first = split[0]
    const { empty, dot, isRoot, isNamed } = Hierarchy.attributes(first);
    const withoutEmpties = split.filter(i => i !== empty)
    if (isRoot) withoutEmpties.unshift(empty)
    if (isNamed) withoutEmpties.unshift(dot)
    return withoutEmpties
  }
  
  static increment(name: string, index: number, tree: any, current: any ) {
    const isFirst = index === 0
    const { isDoubleDot, isDot } = Hierarchy.attributes(name);
    if (isFirst) {
      const branch = { name, index }
      return [branch, branch]
    } else if (!isFirst && isDoubleDot) {
      if (current?.parent) return [tree, current.parent()]
      const branch: any = { name, index }
      tree.parent = () => branch
      branch.children = [tree]
      return [branch, branch]
    } else if (!isFirst && isDot) {
      return [tree, current]
    }
    const branch = { name, index, parent: () => current }
    const children = current?.children
    current.children = children ? [...children, branch] : [ branch ]
    return [tree, branch]
  }

  static parse(path: string) { 
    const splitPath = Hierarchy.split(path)
    let tree
    let current
    let first
    splitPath.forEach((name, index) => {
      [tree, current] = Hierarchy.increment(name, index, tree, current)
      if (!first) first = tree
    })
    return { tree, first, last: current }
  }

  static resolveRaw(path: string) {
    const { first, last } = Hierarchy.parse(path)
    let traversal: string[] = []
    if (first.name === '..') {
      const searchUp = (branch) => {
        if (!Boolean(branch?.parent)) return null;
        const parent = branch.parent()
        traversal = [...traversal, parent.name]
        const inLiniage = Hierarchy.find(parent, last)
        if (inLiniage) {
          const zip = Hierarchy.liniage(last).reverse()
          traversal = [...traversal, ...zip]
          return traversal
        }
        return searchUp(parent)
      }
      const value = searchUp(first)
      if (value) return value
    }
    return Hierarchy.liniage(last).reverse()
  }

  static resolve(path: string): string { 
    return this.resolveRaw(path).join('/')
  }

}
