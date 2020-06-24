export class System {
  static WIN32 = 'win32'
  static WINDOWS = 'windows'

  static get isWindows() {
    const navigator = (globalThis as any).navigator;
    const Deno = (globalThis as any).Deno;
    const process = (globalThis as any).process;
    let isWindows = false;
    if (globalThis.Deno) {
      isWindows = Deno.build.os == System.WINDOWS;
    } else if (navigator?.appVersion) {
      isWindows = navigator.appVersion.includes("Win");
    } else if (process?.platform) { 
      isWindows = process.platform === System.WIN32
    }
    return isWindows
  }

  static env(key: string) {
    const Deno = (globalThis as any).Deno;
    const process = (globalThis as any).process;
    if (Deno) {
      return Deno.env.get(key)
    } else if (process) { 
      return process.env[key]
    }
    return undefined
  }

  static DENO = 'deno'
  static NODE = 'node'

  static get runtime() {
    const Deno = (globalThis as any).Deno;
    const process = (globalThis as any).process;
    if (Deno) return System.DENO;
    if (process) return System.NODE;
  }

  static get sep() {
    return this.isWindows ? "\\" : "/"
  }
}