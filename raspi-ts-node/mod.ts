const readline = require('readline');
const path = require('path')
const fs = require('fs')
const util = require('util');
const execCb = require('child_process').exec
const exec = util.promisify(execCb);

export class RaspberryPi {
  static async stdout(command) {
    const { stdout } = await exec(command)
    return stdout.trim()
  }

  static async splitStdout(command) {
    const { stdout } = await exec(command)
    return stdout.split('\n').filter(i => i !== '')
  }

  static async currentWifiNetwork() {
    // https://gist.github.com/codycodes/517955946fea3925bde6c5c9a2b63f88
    // http://bit.ly/2zWtUhQ
    const command = `/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport -I | awk '/ SSID/ {print substr($0, index($0, $2))}'`
    const { stdout } = await exec(command)
    return stdout.trim()
  }

  static async currentWifi() {
    const name = await this.currentWifiNetwork()
    const command = `security find-generic-password -w -a ${name} -g`
    const pass = await this.stdout(command)
    return { name, pass }
  }

  static async commandExists(command) {
    try {
      await exec(`command -v ${command} >/dev/null 2>&1`)
      return true
    } catch (e) {
      return false
    }
  }

  static async requireCommand(command) {
    const exists = await this.commandExists(command)
    if (!exists) throw new Error(`the command "${command}" does not exist, please install it and try again`)
    return
  }

  static async requireCommands(...commands) {
    const status = await Promise.all(commands.map(async command => {
      return {
        command,
        exists: await this.commandExists(command)
      }
    }))
    const missing = status.filter(c => !c.exists)
    if (!missing.length) return;
    const cmds = missing.map(c => `"${c.command}"`).join(', ')
    throw new Error(`the following commands commands ${cmds} do not exist, please install them and try again`)
  }

  static async hostIp() {
    const { stdout } = await exec('ipconfig getifaddr en0')
    return stdout.trim()
  }

  static async networkIps() {
    const hostIp = await this.hostIp()
    const { stdout } = await exec(`nmap -n -sP ${hostIp}/24`)
    const begining = 'Nmap scan report for '
    const viable = stdout.split('\n')
      .filter(i => i.match(begining))
      .map(i => i.replace(begining, ''))
    return viable
  }

  static async findRaspberryPiIp() {
    const ips = await this.networkIps()
    const results: {ip: string, allowsPassword: boolean}[] = await Promise.all(ips.map(async (ip) => {
      return {
        ip,
        allowsPassword: await this.sshAllowsPassword(ip)
      }
    }))
    const x = results.filter((o) => o.allowsPassword)
    if (x.length === 1) return x[0].ip
    return
  }

  static sshAllowsPassword(ip, user = 'pi') {
    // https://coolaj86.com/articles/testing-if-ssh-allows-passwords
    
    const command = `
      ssh -v -n \
      -o Batchmode=yes \
      -o StrictHostKeyChecking=no \
      -o UserKnownHostsFile=/dev/null \
      ${user}@${ip}
      | true
    `
    return new Promise(function (resolve) {
      // not using promisify because all 3 arguments convey information
      execCb(command, { timeout: 2000 }, (err, stdout, stderr) => {
        stdout = (stdout || '').toString();
        stderr = (stderr || '').toString();
        if (/\bpassword\b/.test(stdout) || /\bpassword\b/.test(stderr)) {
          resolve(true);
          return;
        }
        resolve(false);
      });
    });
  }

  static async wpaSupplicant() {
    const { name, pass } = await this.currentWifi()
    return [
      'ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev',
      'update_config=1',
      'country=US',
      'network={',
      `  ssid="${name}"`,
      `  psk="${pass}"`,
      '}'
    ].join('\n')
  }

  static async createWpaSupplicant(volumeName) {
    if (!volumeName) return false
    const file = await this.wpaSupplicant()
    const wpa_supplicant = path.join(`/Volumes`, volumeName, 'wpa_supplicant.conf')
    await fs.promises.writeFile(wpa_supplicant, file)
    return true
  }

  static async enableSsh(volumeName) {
    if (!volumeName) return false
    const ssh = path.join(`/Volumes`, volumeName, 'ssh')
    await fs.promises.writeFile(ssh, '')
    return true
  }

  static async eject(volumeName) {
    if (!volumeName) return false
    await exec(`diskutil unmount /Volumes/${volumeName}`)
    return true
  }

  static async checkVolume(volumeName) {
    if (!volumeName) return false
    try {
      await exec(`cd /Volumes/boot`)
      return true
    } catch (e) {
      return false
    }
  }

  static async requireVolume(volumeName) {
    const value = await this.checkVolume(volumeName)
    if (!value) throw new Error(`volume ${volumeName} does not exist`)
    return;
  }

  /** readys a fresh raspi sd card by creating a
   * wpa_suppliant file that shares the same wifi
   * credentials as the computer running this
   * command, as well as enables ssh */
  static async readySdCard(volumeName) {
    if (!volumeName) return false
    await this.requireCommands('security')
    console.log('all dependencies available')
    await this.requireVolume(volumeName)
    console.log('volume detected')
    await this.createWpaSupplicant(volumeName)
    console.log('created wpa supplicant')
    await this.enableSsh(volumeName)
    console.log('enabled ssh')
    await this.eject(volumeName)
    console.log('ejected volume')
  }

  static async question(q) { 
    return new Promise((resolve, reject) => { 
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      rl.question(q, (answer) => {
        rl.close()
        return resolve(answer)
      })
    })
  }

  static async readySdCardInteractive() {
    const volume = await this.chooseVolume()
    return this.readySdCard(volume)
  }

  static async volumes() { 
    return await this.splitStdout(`ls /Volumes`)
  }

  static escapeSpace(p) { 
    return p.replace(/(\s+)/g, '\\$1')
  }

  static async chooseVolume() { 
    const volumes = await this.volumes()
    const volumesExcaped = volumes.map(this.escapeSpace)
    const answer = await this.question([
      'Please type (or copy & paste) in the Raspberry PI volume:',
      ...volumes.map(v => ` • ${v}`),
      '> '
    ].join('\n'))
    if (volumes.includes(answer)) return path.join('/Volume', this.escapeSpace(answer))
    if (volumesExcaped.includes(answer))  return path.join('/Volume', answer)
    throw new Error(`invalid volume ${answer}`)
  }

  static async command() { 
    const args = process.argv.slice(2)
    const task = args[0]
    switch (task) {
      case 'find-ip':
        const ip = await this.findRaspberryPiIp()
        console.log(ip)
        break;
      case 'read-sd':
        await this.readySdCardInteractive()
        break;
      default:
        console.log([
          '@reggi/raspi',
          '',
          'find-ip     Attemps to locate the ip of a raspberry pi on a network',
          'ready-sd    Adds wpa_supplicant and ssh files to provided volume'
        ].join('\n'))
    }
  }

  /** coppies this project to raspi via ssh */
  static async rsyncProject() {
    const project = __dirname
    await this.requireCommands('nmap', 'ssh')
    const ip = await this.findRaspberryPiIp() 
  }
}
