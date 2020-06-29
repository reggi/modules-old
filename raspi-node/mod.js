"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.RaspberryPi = void 0;
var readline = require('readline');
var path = require('path');
var fs = require('fs');
var util = require('util');
var execCb = require('child_process').exec;
var exec = util.promisify(execCb);
var RaspberryPi = /** @class */ (function () {
    function RaspberryPi() {
    }
    RaspberryPi.stdout = function (command) {
        return __awaiter(this, void 0, void 0, function () {
            var stdout;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, exec(command)];
                    case 1:
                        stdout = (_a.sent()).stdout;
                        return [2 /*return*/, stdout.trim()];
                }
            });
        });
    };
    RaspberryPi.splitStdout = function (command) {
        return __awaiter(this, void 0, void 0, function () {
            var stdout;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, exec(command)];
                    case 1:
                        stdout = (_a.sent()).stdout;
                        return [2 /*return*/, stdout.split('\n').filter(function (i) { return i !== ''; })];
                }
            });
        });
    };
    RaspberryPi.currentWifiNetwork = function () {
        return __awaiter(this, void 0, void 0, function () {
            var command, stdout;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        command = "/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport -I | awk '/ SSID/ {print substr($0, index($0, $2))}'";
                        return [4 /*yield*/, exec(command)];
                    case 1:
                        stdout = (_a.sent()).stdout;
                        return [2 /*return*/, stdout.trim()];
                }
            });
        });
    };
    RaspberryPi.currentWifi = function () {
        return __awaiter(this, void 0, void 0, function () {
            var name, command, pass;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.currentWifiNetwork()];
                    case 1:
                        name = _a.sent();
                        command = "security find-generic-password -w -a " + name + " -g";
                        return [4 /*yield*/, this.stdout(command)];
                    case 2:
                        pass = _a.sent();
                        return [2 /*return*/, { name: name, pass: pass }];
                }
            });
        });
    };
    RaspberryPi.commandExists = function (command) {
        return __awaiter(this, void 0, void 0, function () {
            var e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, exec("command -v " + command + " >/dev/null 2>&1")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 2:
                        e_1 = _a.sent();
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    RaspberryPi.requireCommand = function (command) {
        return __awaiter(this, void 0, void 0, function () {
            var exists;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.commandExists(command)];
                    case 1:
                        exists = _a.sent();
                        if (!exists)
                            throw new Error("the command \"" + command + "\" does not exist, please install it and try again");
                        return [2 /*return*/];
                }
            });
        });
    };
    RaspberryPi.requireCommands = function () {
        var commands = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            commands[_i] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            var status, missing, cmds;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.all(commands.map(function (command) { return __awaiter(_this, void 0, void 0, function () {
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        _a = {
                                            command: command
                                        };
                                        return [4 /*yield*/, this.commandExists(command)];
                                    case 1: return [2 /*return*/, (_a.exists = _b.sent(),
                                            _a)];
                                }
                            });
                        }); }))];
                    case 1:
                        status = _a.sent();
                        missing = status.filter(function (c) { return !c.exists; });
                        if (!missing.length)
                            return [2 /*return*/];
                        cmds = missing.map(function (c) { return "\"" + c.command + "\""; }).join(', ');
                        throw new Error("the following commands commands " + cmds + " do not exist, please install them and try again");
                }
            });
        });
    };
    RaspberryPi.hostIp = function () {
        return __awaiter(this, void 0, void 0, function () {
            var stdout;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, exec('ipconfig getifaddr en0')];
                    case 1:
                        stdout = (_a.sent()).stdout;
                        return [2 /*return*/, stdout.trim()];
                }
            });
        });
    };
    RaspberryPi.networkIps = function () {
        return __awaiter(this, void 0, void 0, function () {
            var hostIp, stdout, begining, viable;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.hostIp()];
                    case 1:
                        hostIp = _a.sent();
                        return [4 /*yield*/, exec("nmap -n -sP " + hostIp + "/24")];
                    case 2:
                        stdout = (_a.sent()).stdout;
                        begining = 'Nmap scan report for ';
                        viable = stdout.split('\n')
                            .filter(function (i) { return i.match(begining); })
                            .map(function (i) { return i.replace(begining, ''); });
                        return [2 /*return*/, viable];
                }
            });
        });
    };
    RaspberryPi.findRaspberryPiIp = function () {
        return __awaiter(this, void 0, void 0, function () {
            var ips, results, x;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.networkIps()];
                    case 1:
                        ips = _a.sent();
                        return [4 /*yield*/, Promise.all(ips.map(function (ip) { return __awaiter(_this, void 0, void 0, function () {
                                var _a;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            _a = {
                                                ip: ip
                                            };
                                            return [4 /*yield*/, this.sshAllowsPassword(ip)];
                                        case 1: return [2 /*return*/, (_a.allowsPassword = _b.sent(),
                                                _a)];
                                    }
                                });
                            }); }))];
                    case 2:
                        results = _a.sent();
                        x = results.filter(function (o) { return o.allowsPassword; });
                        if (x.length === 1)
                            return [2 /*return*/, x[0].ip];
                        return [2 /*return*/];
                }
            });
        });
    };
    RaspberryPi.sshAllowsPassword = function (ip, user) {
        // https://coolaj86.com/articles/testing-if-ssh-allows-passwords
        if (user === void 0) { user = 'pi'; }
        var command = "\n      ssh -v -n       -o Batchmode=yes       -o StrictHostKeyChecking=no       -o UserKnownHostsFile=/dev/null       " + user + "@" + ip + "\n      | true\n    ";
        return new Promise(function (resolve) {
            // not using promisify because all 3 arguments convey information
            execCb(command, { timeout: 2000 }, function (err, stdout, stderr) {
                stdout = (stdout || '').toString();
                stderr = (stderr || '').toString();
                if (/\bpassword\b/.test(stdout) || /\bpassword\b/.test(stderr)) {
                    resolve(true);
                    return;
                }
                resolve(false);
            });
        });
    };
    RaspberryPi.wpaSupplicant = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, name, pass;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.currentWifi()];
                    case 1:
                        _a = _b.sent(), name = _a.name, pass = _a.pass;
                        return [2 /*return*/, [
                                'ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev',
                                'update_config=1',
                                'country=US',
                                'network={',
                                "  ssid=\"" + name + "\"",
                                "  psk=\"" + pass + "\"",
                                '}'
                            ].join('\n')];
                }
            });
        });
    };
    RaspberryPi.createWpaSupplicant = function (volumeName) {
        return __awaiter(this, void 0, void 0, function () {
            var file, wpa_supplicant;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!volumeName)
                            return [2 /*return*/, false];
                        return [4 /*yield*/, this.wpaSupplicant()];
                    case 1:
                        file = _a.sent();
                        wpa_supplicant = path.join("/Volumes", volumeName, 'wpa_supplicant.conf');
                        return [4 /*yield*/, fs.promises.writeFile(wpa_supplicant, file)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, true];
                }
            });
        });
    };
    RaspberryPi.enableSsh = function (volumeName) {
        return __awaiter(this, void 0, void 0, function () {
            var ssh;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!volumeName)
                            return [2 /*return*/, false];
                        ssh = path.join("/Volumes", volumeName, 'ssh');
                        return [4 /*yield*/, fs.promises.writeFile(ssh, '')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, true];
                }
            });
        });
    };
    RaspberryPi.eject = function (volumeName) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!volumeName)
                            return [2 /*return*/, false];
                        return [4 /*yield*/, exec("diskutil unmount /Volumes/" + volumeName)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, true];
                }
            });
        });
    };
    RaspberryPi.checkVolume = function (volumeName) {
        return __awaiter(this, void 0, void 0, function () {
            var e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!volumeName)
                            return [2 /*return*/, false];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, exec("cd /Volumes/boot")];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 3:
                        e_2 = _a.sent();
                        return [2 /*return*/, false];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    RaspberryPi.requireVolume = function (volumeName) {
        return __awaiter(this, void 0, void 0, function () {
            var value;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.checkVolume(volumeName)];
                    case 1:
                        value = _a.sent();
                        if (!value)
                            throw new Error("volume " + volumeName + " does not exist");
                        return [2 /*return*/];
                }
            });
        });
    };
    /** readys a fresh raspi sd card by creating a
     * wpa_suppliant file that shares the same wifi
     * credentials as the computer running this
     * command, as well as enables ssh */
    RaspberryPi.readySdCard = function (volumeName) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!volumeName)
                            return [2 /*return*/, false];
                        return [4 /*yield*/, this.requireCommands('security')];
                    case 1:
                        _a.sent();
                        console.log('all dependencies available');
                        return [4 /*yield*/, this.requireVolume(volumeName)];
                    case 2:
                        _a.sent();
                        console.log('volume detected');
                        return [4 /*yield*/, this.createWpaSupplicant(volumeName)];
                    case 3:
                        _a.sent();
                        console.log('created wpa supplicant');
                        return [4 /*yield*/, this.enableSsh(volumeName)];
                    case 4:
                        _a.sent();
                        console.log('enabled ssh');
                        return [4 /*yield*/, this.eject(volumeName)];
                    case 5:
                        _a.sent();
                        console.log('ejected volume');
                        return [2 /*return*/];
                }
            });
        });
    };
    RaspberryPi.question = function (q) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var rl = readline.createInterface({
                            input: process.stdin,
                            output: process.stdout
                        });
                        rl.question(q, function (answer) {
                            rl.close();
                            return resolve(answer);
                        });
                    })];
            });
        });
    };
    RaspberryPi.readySdCardInteractive = function () {
        return __awaiter(this, void 0, void 0, function () {
            var volume;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.chooseVolume()];
                    case 1:
                        volume = _a.sent();
                        return [2 /*return*/, this.readySdCard(volume)];
                }
            });
        });
    };
    RaspberryPi.volumes = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.splitStdout("ls /Volumes")];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    RaspberryPi.escapeSpace = function (p) {
        return p.replace(/(\s+)/g, '\\$1');
    };
    RaspberryPi.chooseVolume = function () {
        return __awaiter(this, void 0, void 0, function () {
            var volumes, volumesExcaped, answer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.volumes()];
                    case 1:
                        volumes = _a.sent();
                        volumesExcaped = volumes.map(this.escapeSpace);
                        return [4 /*yield*/, this.question(__spreadArrays([
                                'Please type (or copy & paste) in the Raspberry PI volume:'
                            ], volumes.map(function (v) { return " \u2022 " + v; }), [
                                '> '
                            ]).join('\n'))];
                    case 2:
                        answer = _a.sent();
                        if (volumes.includes(answer))
                            return [2 /*return*/, path.join('/Volume', this.escapeSpace(answer))];
                        if (volumesExcaped.includes(answer))
                            return [2 /*return*/, path.join('/Volume', answer)];
                        throw new Error("invalid volume " + answer);
                }
            });
        });
    };
    RaspberryPi.command = function () {
        return __awaiter(this, void 0, void 0, function () {
            var args, task, _a, ip;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        args = process.argv.slice(2);
                        task = args[0];
                        _a = task;
                        switch (_a) {
                            case 'find-ip': return [3 /*break*/, 1];
                            case 'read-sd': return [3 /*break*/, 3];
                        }
                        return [3 /*break*/, 5];
                    case 1: return [4 /*yield*/, this.findRaspberryPiIp()];
                    case 2:
                        ip = _b.sent();
                        console.log(ip);
                        return [3 /*break*/, 6];
                    case 3: return [4 /*yield*/, this.readySdCardInteractive()];
                    case 4:
                        _b.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        console.log([
                            '@reggi/raspi',
                            '',
                            'find-ip     Attemps to locate the ip of a raspberry pi on a network',
                            'ready-sd    Adds wpa_supplicant and ssh files to provided volume'
                        ].join('\n'));
                        _b.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /** coppies this project to raspi via ssh */
    RaspberryPi.rsyncProject = function () {
        return __awaiter(this, void 0, void 0, function () {
            var project, ip;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        project = __dirname;
                        return [4 /*yield*/, this.requireCommands('nmap', 'ssh')];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.findRaspberryPiIp()];
                    case 2:
                        ip = _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return RaspberryPi;
}());
exports.RaspberryPi = RaspberryPi;
