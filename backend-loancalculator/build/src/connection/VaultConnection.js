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
Object.defineProperty(exports, "__esModule", { value: true });
exports.initVault = void 0;
const initVault = () => __awaiter(void 0, void 0, void 0, function* () {
    const vault = require("node-vault")({
        endpoint: process.env.VAULT_ENDPOINT,
    });
    const token = yield vault.userpassLogin({
        username: process.env.VAULT_USER,
        password: process.env.VAULT_PASS,
    });
    const dataVault = require("node-vault")({
        endpoint: process.env.VAULT_ENDPOINT,
        token: token.auth.client_token,
    });
    const result = yield dataVault.read(process.env.VAULT_PATH);
    const config = result.data.data;
    for (const key in config) {
        if (config.hasOwnProperty(key)) {
            process.env[key] = config[key];
        }
    }
    console.log('Vault connected successfully...');
});
exports.initVault = initVault;
//# sourceMappingURL=VaultConnection.js.map