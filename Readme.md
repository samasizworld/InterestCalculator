# Vault config

1. Run docker-compose.yml
2. create config folder inside (~/vault_data)
3. go inside config folder and paste config.hcl
4. go to http://localhost:8200
5. generate keys to unseal vault and root token
6. unseal vault using generated keys
7. login via root token
8. create new userpass to login via username and password
9. create new policy i.e. user_policies.hcl

   `path "nodeapi/*" { capabilities = ["read", "create", "update", "list"] } path "auth/token/create" { capabilities = ["update"] } path "sys/mounts/*" { capabilities = ["read", "create", "update", "delete", "list"] }`
10. hit the command "vault policy write user-policy user_policies.hcl"
11. vault write auth/userpass/users/`<username>`
    password="`<password>`"
    policies="default,user_polices"
12. now login via userpass created at step 4

# Express Static

Please copy public folder inside build directory
