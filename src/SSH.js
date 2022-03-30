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
Object.defineProperty(exports, "__esModule", { value: true });
var constant_1 = require("./constant");
var NodeSSH = require('node-ssh');
var path = require('path');
var SSH = (function () {
    function SSH(destination, user, password, maintainer) {
        if (password === void 0) { password = null; }
        if (maintainer === void 0) { maintainer = null; }
        this.loggedIn = false;
        this.isCommunityAccount = false;
        this.env = '';
        this.SSH = new NodeSSH();
        this.user = user;
        this.password = password;
        this.maintainer = maintainer;
        var server = constant_1.default.destinationMap[destination];
        if (server === undefined) {
            throw Error('cannot identify server from destination name ' + destination);
        }
        if (server.isCommunityAccount) {
            this.isCommunityAccount = true;
            if (server.communityAccountSSH.useLocalKeys) {
                var config = require('../config.json');
                this.privateKey = config.privateKeyPath;
                this.passphrase = config.passphrase;
            }
            else {
                this.privateKey = server.communityAccountSSH.key.privateKey;
                this.passphrase = server.communityAccountSSH.key.passphrase;
            }
        }
        this.ip = server.ip;
        this.port = server.port;
    }
    SSH.prototype.connect = function (env) {
        if (env === void 0) { env = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var envCmd, i, v, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.loggedIn) {
                            return [2];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, , 7]);
                        if (!this.isCommunityAccount) return [3, 3];
                        return [4, this.SSH.connect({
                                host: this.ip,
                                port: this.port,
                                username: this.user,
                                privateKey: this.privateKey,
                                passphrase: this.passphrase
                            })];
                    case 2:
                        _a.sent();
                        return [3, 5];
                    case 3: return [4, this.SSH.connect({
                            host: this.ip,
                            port: this.port,
                            username: this.user,
                            password: this.password
                        })];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5:
                        this.loggedIn = true;
                        if (this.maintainer != null) {
                            this.maintainer.emitEvent('SSH_CONNECTION', 'successfully connected to server [' + this.ip + ':' + this.port + ']');
                        }
                        envCmd = 'source /etc/profile;';
                        for (i in env) {
                            v = env[i];
                            envCmd += 'export ' + i + '=' + v + ';';
                        }
                        this.env = envCmd;
                        return [3, 7];
                    case 6:
                        e_1 = _a.sent();
                        if (this.maintainer != null) {
                            this.maintainer.emitEvent('SSH_CONNECTION_ERROR', 'connection to server [' + this.ip + ':' + this.port + '] failed with error: ' + e_1);
                        }
                        this.loggedIn = false;
                        return [3, 7];
                    case 7: return [2];
                }
            });
        });
    };
    SSH.prototype.stop = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.maintainer != null) {
                            this.maintainer.emitEvent('SSH_DISCONNECTION', 'disconnected with server [' + this.ip + ':' + this.port + ']');
                        }
                        return [4, this.SSH.dispose()];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    SSH.prototype.isConnected = function () {
        return this.loggedIn;
    };
    SSH.prototype.exec = function (commands, options, context) {
        if (options === void 0) { options = {}; }
        if (context === void 0) { context = null; }
        return __awaiter(this, void 0, void 0, function () {
            var out, lastOut, nextOut, maintainer, opt, _a, _b, _i, i, command, cmd;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        out = [];
                        lastOut = {
                            stage: 0,
                            cmd: null,
                            stdout: null,
                            stderr: null,
                            executionFailure: null,
                            flags: [],
                            isFirstCmd: true,
                        };
                        nextOut = {
                            stage: null,
                            cmd: null,
                            stdout: null,
                            stderr: null,
                            executionFailure: null,
                            flags: [],
                            isFirstCmd: true,
                        };
                        maintainer = this.maintainer;
                        opt = Object.assign({
                            onStdout: function (out) {
                                var stdout = out.toString();
                                if (nextOut.stdout === null) {
                                    nextOut.stdout = stdout;
                                }
                                else {
                                    nextOut.stdout += stdout;
                                }
                                var parsedStdout = stdout.split('@');
                                for (var i in parsedStdout) {
                                    var f = parsedStdout[i].match(/flag=\[[\s\S]*\]/g);
                                    if (f != null) {
                                        f.forEach(function (v, i) {
                                            v = v.replace('flag=[', '');
                                            v = v.replace(/]$/g, '');
                                            var e = v.split(':');
                                            nextOut.flags.push({
                                                type: e[0],
                                                message: e[1]
                                            });
                                            if (maintainer != null) {
                                                maintainer.emitEvent(e[0], e[1]);
                                            }
                                            var flag = '@flag=[' + e[0] + ':' + e[1] + ']';
                                            stdout = stdout.replace(flag, '');
                                        });
                                    }
                                }
                                if (maintainer != null) {
                                    maintainer.emitLog(stdout);
                                }
                            },
                            onStderr: function (out) {
                                var stderr = out.toString();
                                if (nextOut.stderr === null) {
                                    nextOut.stderr = stderr;
                                }
                                else {
                                    nextOut.stderr += stderr;
                                }
                                if (maintainer != null) {
                                    maintainer.emitLog(stderr);
                                }
                            }
                        }, options);
                        _a = [];
                        for (_b in commands)
                            _a.push(_b);
                        _i = 0;
                        _c.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3, 4];
                        i = _a[_i];
                        command = commands[i];
                        nextOut.stage = lastOut.stage + 1;
                        if (typeof command === 'string') {
                            cmd = command;
                        }
                        else {
                            try {
                                cmd = command(lastOut, context);
                            }
                            catch (e) {
                                nextOut.executionFailure = e;
                                if (this.maintainer != null) {
                                    this.maintainer.emitEvent('SSH_EXECUTION_ERROR', e);
                                }
                                out.push(nextOut);
                                return [3, 4];
                            }
                        }
                        nextOut.cmd = cmd;
                        return [4, this.SSH.execCommand(this.env + cmd, opt)];
                    case 2:
                        _c.sent();
                        lastOut = nextOut;
                        out.push(nextOut);
                        nextOut = {
                            stage: null,
                            cmd: null,
                            stdout: null,
                            stderr: null,
                            executionFailure: null,
                            flags: [],
                            isFirstCmd: false,
                        };
                        _c.label = 3;
                    case 3:
                        _i++;
                        return [3, 1];
                    case 4: return [2, out];
                }
            });
        });
    };
    SSH.prototype.getRemoteHomePath = function () {
        return __awaiter(this, void 0, void 0, function () {
            var out;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.SSH.execCommand(this.env + 'cd ~;pwd;')];
                    case 1:
                        out = _a.sent();
                        return [2, out['stdout']];
                }
            });
        });
    };
    SSH.prototype.putDirectory = function (from, to, validate) {
        if (validate === void 0) { validate = null; }
        return __awaiter(this, void 0, void 0, function () {
            var out, opts, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        out = {
                            failed: [],
                            successful: []
                        };
                        opts = {
                            recursive: true,
                            concurrency: 10,
                            tick: function (localPath, remotePath, error) {
                                if (error) {
                                    out.failed.push(localPath);
                                }
                                else {
                                    out.successful.push(localPath);
                                }
                            }
                        };
                        if (validate != null) {
                            opts['validate'] = validate;
                        }
                        return [4, this.SSH.putDirectory(from, to, opts)];
                    case 1:
                        _a.sent();
                        return [2, out];
                    case 2:
                        e_2 = _a.sent();
                        throw new Error('unable to put directory: ' + e_2.toString());
                    case 3: return [2];
                }
            });
        });
    };
    SSH.prototype.putFile = function (from, to) {
        return __awaiter(this, void 0, void 0, function () {
            var e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, this.SSH.putFile(from, to)];
                    case 1:
                        _a.sent();
                        return [3, 3];
                    case 2:
                        e_3 = _a.sent();
                        throw new Error('unable to put file: ' + e_3.toString());
                    case 3: return [2];
                }
            });
        });
    };
    SSH.prototype.getFile = function (from, to) {
        return __awaiter(this, void 0, void 0, function () {
            var e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, this.SSH.getFile(to, from)];
                    case 1:
                        _a.sent();
                        return [3, 3];
                    case 2:
                        e_4 = _a.sent();
                        throw new Error('unable to get directory zipped: ' + e_4.toString());
                    case 3: return [2];
                }
            });
        });
    };
    SSH.prototype.getDirectoryZipped = function (from, to, customFileName) {
        if (customFileName === void 0) { customFileName = null; }
        return __awaiter(this, void 0, void 0, function () {
            var cwd, name, tarFilename, e_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        if (from[from.length - 1] == '/') {
                            from = from.slice(0, -1);
                        }
                        if (to[to.length - 1] == '/') {
                            to = to.slice(0, -1);
                        }
                        cwd = path.dirname(from);
                        name = path.basename(from);
                        tarFilename = from.split('/').pop() + '.tar';
                        return [4, this.exec(['tar -czf ' + tarFilename + ' ./' + name + '/'], {
                                cwd: cwd
                            })];
                    case 1:
                        _a.sent();
                        return [4, this.SSH.getFile(to + '/' + (customFileName != null ? customFileName : tarFilename), from + '.tar')];
                    case 2:
                        _a.sent();
                        return [3, 4];
                    case 3:
                        e_5 = _a.sent();
                        throw new Error('unable to get file: ' + e_5.toString());
                    case 4: return [2];
                }
            });
        });
    };
    return SSH;
}());
exports.default = SSH;
