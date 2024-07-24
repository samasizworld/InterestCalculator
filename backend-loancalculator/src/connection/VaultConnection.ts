export const initVault = async () => {

    const vault = require("node-vault")({
        endpoint: process.env.VAULT_ENDPOINT,
    });

    const token = await vault.userpassLogin({
        username: process.env.VAULT_USER,
        password: process.env.VAULT_PASS,
    });

    const dataVault = require("node-vault")({
        endpoint: process.env.VAULT_ENDPOINT,
        token: token.auth.client_token,
    });
    const result = await dataVault.read(process.env.VAULT_PATH);

    const config = result.data.data;

    for (const key in config) {
        if (config.hasOwnProperty(key)) {
            process.env[key] = config[key];
        }
    }
    console.log('Vault connected successfully...');

};