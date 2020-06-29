import * as module from 'module'
import babelTraverse from '@babel/traverse'
import * as babelParser from '@babel/parser'
import { File } from '@babel/types'

const nativeList = module.builtinModules

class Depend { 
  nodes: File
  
  constructor(nodes) { 
    this.nodes = nodes
  }

  static load(code: string) { 
    const parsed = babelParser.parse(code)
    return new Depend(parsed)
  }

  static REQUIRE = 'require'
  static URL_IMPORT = 'url-import'
  // static URL_IMPORT = './mod.js'


  traverse() {
    const requiredAs = []
  
    const modules = []

    babelTraverse(this.nodes, {
      ImportDeclaration: (path) => { 
        modules.push(path.node.source.value)
      },
      CallExpression: (path) => {
        // @ts-ignore
        const isRequire = path.node?.callee?.name === Depend.REQUIRE
        // @ts-ignore
        if (isRequire) modules.push(path.node?.arguments[0]?.value)
        // @ts-ignore
        const isUrlImportModule = path.node?.arguments[0]?.extra?.rawValue === Depend.URL_IMPORT
        // @ts-ignore
        const isVariableDeclarator = path.container.type === 'VariableDeclarator'
        // @ts-ignore
        const isDefined = path?.container?.id?.name
        if (
          isRequire &&
          isUrlImportModule &&
          isVariableDeclarator && 
          isDefined
        ) { 
          requiredAs.push(isDefined)
        }
      }
    })

    if (requiredAs.length > 1) { 
      throw Error ('please only define "url-import" once')
    }

    const mainRequiredAs = requiredAs[0]

    const definitions = []

    babelTraverse(this.nodes, {
      VariableDeclarator: (path) => {
        // @ts-ignore
        if (mainRequiredAs === path?.node?.id?.name) { 
          // @ts-ignore
          definitions.push(path?.node?.id?.name)
        }
      }
    })

    if (definitions.length > 1) { 
      throw Error (`please do not redefine the variable '${mainRequiredAs}'`)
    }

    let variableDecCount = 0
    const urls = []

    babelTraverse(this.nodes, {
      Identifier: (path) => {
        if (mainRequiredAs === path?.node?.name) {
          // @ts-ignore
          const isCallExpression = path.container.type === 'CallExpression';
          // @ts-ignore
          const isVariableDeclaration = path.container.type === 'VariableDeclarator';
          if (isVariableDeclaration) {
            if (variableDecCount >= 1) {
              throw new Error(`the variable ${mainRequiredAs} should only be used to call urls`)
            }
            variableDecCount = variableDecCount + 1
            return;
          } else if (!isCallExpression) {
            throw new Error(`the variable ${mainRequiredAs} should only be used to call urls`)
          }
          // @ts-ignore
          const url = path.container?.arguments[0]?.extra?.rawValue
          urls.push(url)
        }
      }
    })
    return {urls, modules}
  }
}



export function dependencies(code: string) { 
  const d = Depend.load(code)
  const { urls, modules } = d.traverse()
  const IS_LOCAL = /^\.\.\/|^\.\/|^\//
  const isLocal = (string) => string.match(IS_LOCAL)
  const isNotLocal = (string) => !string.match(IS_LOCAL)
  const local = modules.filter(isLocal)
  const nonLocal = modules.filter(isNotLocal)
  const isNative = (string) => nativeList.includes(string)
  const isNotNative = (string) => !nativeList.includes(string)
  const native = nonLocal.filter(isNative)
  const nonNative = nonLocal.filter(isNotNative)
  return { urls, local, native, nonNative }
}