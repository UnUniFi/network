# Setup of ununifi-test-a
## ssh disable password login
```bash
> vim /etc/ssh/sshd_config
```
PermitRootLogin yes -> without-password

## Close unnecessary ports with ufw
Open ports that need to be vacated.
- port
  - ssh port
  - Cosmos SDK P2P
  - gRPC API
  - Rest API http
  - Rest API https
```bash
> ufw allow <port-number>
> ufw status numbered
```

## update
```bash
> apt update -y && apt upgrade -y
```

## install
```bash
> apt install -y jq git build-essential
```

## go install : ver 1.17
```bash
> wget https://go.dev/dl/go1.17.linux-amd64.tar.gz
> rm -rf /usr/local/go
> tar -C /usr/local -xzf go1.17.linux-amd64.tar.gz
> export PATH=$PATH:/usr/local/go/bin
> go version
go version go1.17 linux/amd64
```

## ununifi blockchain build
```bash
> git clone https://github.com/UnUniFi/chain chain_repo  
> cd chain_repo
> git checkout main
> git pull
> make install
> ~/go/bin/ununifid version
main-a9f86eb184d518bd5122a5ad5a98d109f791ac6d
```

## Initialize node
```bash
> ~/go/bin/ununifid init ununifi-test-a --chain-id ununifi-test-v1
```

## backup genesis.json 
```bash
> ls -l ./.ununifi/config
total 44
-rw-r--r-- 1 root root  7473 Jun 16 14:46 app.toml
-rw-r--r-- 1 root root 16719 Jun 16 15:19 config.toml
-rw-r--r-- 1 root root  7453 Jun 16 15:19 genesis.json
-rw------- 1 root root   148 Jun 16 15:19 node_key.json
-rw------- 1 root root   345 Jun 16 15:19 priv_validator_key.json
> cp ./.ununifi/config/genesis.json ./.ununifi/config/genesis.json.bak
> ls -l ./.ununifi/config
total 52
-rw-r--r-- 1 root root  7473 Jun 16 14:46 app.toml
-rw-r--r-- 1 root root 16719 Jun 16 15:19 config.toml
-rw-r--r-- 1 root root  7453 Jun 16 15:19 genesis.json
-rw-r--r-- 1 root root  7453 Jun 16 15:26 genesis.json.bak
-rw------- 1 root root   148 Jun 16 15:19 node_key.json
-rw------- 1 root root   345 Jun 16 15:19 priv_validator_key.json
```

## get mainnet genesis.json
```bash
> curl -L https://raw.githubusercontent.com/UnUniFi/network/main/launch/ununifi-beta-v1/genesis.json -o ~/.ununifi/config/genesis-mainnet.json
> curl -L https://raw.githubusercontent.com/UnUniFi/network/main/launch/ununifi-beta-v1/genesis-pretty.json -o ~/.ununifi/config/genesis-pretty-mainnet.json
```

## Set app.toml
```bash
# api enable
> sed -i '/\[api\]/,+3 s/enable = false/enable = true/' ~/.ununifi/config/app.toml;
# minimum-gas-prices -> "0uguu"
> sed -i 's/minimum-gas-prices = ".*"/minimum-gas-prices = "0uguu"/' ~/.ununifi/config/app.toml;
# Rest API : enabled-unsafe-cors = false -> true
> sed -E -i "s/enabled-unsafe-cors = false/enabled-unsafe-cors = true/" ~/.ununifi/config/app.toml;

```
## Set config.toml
```bash
# gRPC API : laddr -> tcp://0.0.0.0:26657
> sed -i 's|^laddr = "tcp://127.0.0.1:26657"|laddr = "tcp://0.0.0.0:26657"|g' ~/.ununifi/config/config.toml;
```

## Set genesis.json to match the mainnet configuration.
```bash
# stake -> uguu
> sed -i 's/stake/uguu/g' ~/.ununifi/config/genesis.json;
# default_send_enabled = false
> jq '.app_state.bank.params.default_send_enabled = false'  ~/.ununifi/config/genesis.json > temp.json ; mv temp.json ~/.ununifi/config/genesis.json;
## gov
# gov min_deposit amount -> 20000000000
> jq '.app_state.gov.deposit_params.min_deposit[0].amount = "20000000000"'  ~/.ununifi/config/genesis.json > temp.json ; mv temp.json ~/.ununifi/config/genesis.json;
# gov voting_period -> "259200s"
> jq '.app_state.gov.voting_params.voting_period = "259200s"'  ~/.ununifi/config/genesis.json > temp.json ; mv temp.json ~/.ununifi/config/genesis.json;
## mint
# mint minter.inflation -> 0.090000000000000000
> jq '.app_state.mint.minter.inflation = "0.090000000000000000"'  ~/.ununifi/config/genesis.json > temp.json ; mv temp.json ~/.ununifi/config/genesis.json;
# mint params.inflation_rate_change -> 0.090000000000000000
> jq '.app_state.mint.params.inflation_rate_change = "0.090000000000000000"'  ~/.ununifi/config/genesis.json > temp.json ; mv temp.json ~/.ununifi/config/genesis.json;
# mint params.inflation_max -> 0.160000000000000000
> jq '.app_state.mint.params.inflation_max = "0.160000000000000000"'  ~/.ununifi/config/genesis.json > temp.json ; mv temp.json ~/.ununifi/config/genesis.json;
# mint params.inflation_min -> 0.030000000000000000
> jq '.app_state.mint.params.inflation_min = "0.030000000000000000"'  ~/.ununifi/config/genesis.json > temp.json ; mv temp.json ~/.ununifi/config/genesis.json;
## slashing
# slashing params
> jq '.app_state.slashing.params = {"signed_blocks_window": "30000","min_signed_per_window": "0.050000000000000000","downtime_jail_duration": "60s","slash_fraction_double_sign": "0.050000000000000000","slash_fraction_downtime": "0.000000000000000000"}'  ~/.ununifi/config/genesis.json > temp.json ; mv temp.json ~/.ununifi/config/genesis.json;
## staking
# staking params.unbonding_time -> 1209600s(14day:2weeks)
> jq '.app_state.staking.params.unbonding_time = "1209600s"'  ~/.ununifi/config/genesis.json > temp.json ; mv temp.json ~/.ununifi/config/genesis.json;
## transfer
# transfer params send_enabled & receive_enabled -> false
> jq '.app_state.transfer.params = {"send_enabled": false,"receive_enabled": false}'  ~/.ununifi/config/genesis.json > temp.json ; mv temp.json ~/.ununifi/config/genesis.json;
## wasm
# wasm params.code_upload_access.permission -> "Everybody"
> jq '.app_state.wasm.params.code_upload_access.permission = "Everybody"'  ~/.ununifi/config/genesis.json > temp.json ; mv temp.json ~/.ununifi/config/genesis.json;
# wasm params.instantiate_default_permission -> "Everybody"
> jq '.app_state.wasm.params.instantiate_default_permission = "Everybody"'  ~/.ununifi/config/genesis.json > temp.json ; mv temp.json ~/.ununifi/config/genesis.json;
```

## bank send enable
```bash
# default_send_enabled -> true
> jq '.app_state.bank.params.default_send_enabled = true'  ~/.ununifi/config/genesis.json > temp.json ; mv temp.json ~/.ununifi/config/genesis.json;
```

## add validator account
```bash
> ~/go/bin/ununifid keys add validator-a >& backup-validator-a.txt
> ~/go/bin/ununifid keys add validator-b >& backup-validator-b.txt
> ~/go/bin/ununifid keys add validator-c >& backup-validator-c.txt
> ~/go/bin/ununifid keys add validator-d >& backup-validator-d.txt

> ~/go/bin/ununifid keys list
- name: validator-a
  type: local
  address: ununifi1u6x6q5c7vxw0uss0ep9clq2ppd8v5cfvcnqkuz
  pubkey: '{"@type":"/cosmos.crypto.secp256k1.PubKey","key":"AuzqeSzCKLa6nljPKb+CuLS53lJIxHoniRFoEoGxz2Uj"}'
  mnemonic: ""
- name: validator-b
  type: local
  address: ununifi10v92nsg3tzh0tt4j0kfzpdh0eh4szrsp64sh9a
  pubkey: '{"@type":"/cosmos.crypto.secp256k1.PubKey","key":"A1I9g8puKMg9ceqJTsU/ZCO44OCbNn+uHrnZEaRU5Mj+"}'
  mnemonic: ""
- name: validator-c
  type: local
  address: ununifi1py6tvxk3tdlafky8h07twqsyxkwyq6dage0p4q
  pubkey: '{"@type":"/cosmos.crypto.secp256k1.PubKey","key":"A6RM4BdzzRPeDv2ReU1xD3LOZIuR747LZLR0Ffyq5edb"}'
  mnemonic: ""
- name: validator-d
  type: local
  address: ununifi1ma5tjsw2fznpt8k0edkqj6kr6uc6pvmwu2gukx
  pubkey: '{"@type":"/cosmos.crypto.secp256k1.PubKey","key":"Ayfq1XxgYEEqZQBnsqZRMqnlbZsW4Ea24RpqkiQUh2t9"}'
  mnemonic: ""
```

## add-genesis-account. Set balance for Validator account
1GUU=10^6uguu
```bash
> ~/go/bin/ununifid add-genesis-account validator-a 125000000000000uguu;
> ~/go/bin/ununifid add-genesis-account validator-b 125000000000000uguu;
> ~/go/bin/ununifid add-genesis-account validator-c 125000000000000uguu;
> ~/go/bin/ununifid add-genesis-account validator-d 125000000000000uguu;
```

## gentx. Generate a genesis transaction that creates a validator with a self-delegation
```bash
# validator-a
> ~/go/bin/ununifid gentx validator-a 125000000000000uguu --chain-id="ununifi-test-v1" --from="validator-a" --ip="a.ununifi-test-v1.cauchye.net" --moniker="ununifi-test-a" --identity="ununifi-test-a" --node-id="65710949120e28f8af12f81b75efd2a509280f70" --pubkey="{\"@type\":\"/cosmos.crypto.ed25519.PubKey\",\"key\":\"n1u/h6jebXOnUHXM13bc6CCCFnTFyBCRIgQOb/ZwL8A=\"}" --commission-rate=0.1 --commission-max-rate=1.0 --commission-max-change-rate=1.0 --min-self-delegation=1 --website="https://cauchye.com" --security-contact="info@cauchye.com" --details="CauchyE validator node. Delegate your tokens and Start Earning Staking Rewards."
# validator-b
> ~/go/bin/ununifid gentx validator-b 125000000000000uguu --chain-id="ununifi-test-v1" --from="validator-b" --ip="b.ununifi-test-v1.cauchye.net" --moniker="ununifi-test-b" --identity="ununifi-test-b" --node-id="b20e3aad6b1bf7dc2d1635c388f578f335b13466" --pubkey="{\"@type\":\"/cosmos.crypto.ed25519.PubKey\",\"key\":\"5FoDEKPvJY31kTuiEx89CNMce4ZTVabewDUt7Z1tN4o=\"}" --commission-rate=0.1 --commission-max-rate=1.0 --commission-max-change-rate=1.0 --min-self-delegation=1 --website="https://cauchye.com" --security-contact="info@cauchye.com" --details="CauchyE validator node. Delegate your tokens and Start Earning Staking Rewards."
# validator-c
> ~/go/bin/ununifid gentx validator-c 125000000000000uguu --chain-id="ununifi-test-v1" --from="validator-c" --ip="c.ununifi-test-v1.cauchye.net" --moniker="ununifi-test-c" --identity="ununifi-test-c" --node-id="a8d5662130dd127dfcf82314e7a5b379a95d9daf" --pubkey="{\"@type\":\"/cosmos.crypto.ed25519.PubKey\",\"key\":\"YEV7PbK1K8wD9QoNqYZT5wReeTgUj2q+y9LjaLcekVw=\"}" --commission-rate=0.1 --commission-max-rate=1.0 --commission-max-change-rate=1.0 --min-self-delegation=1 --website="https://cauchye.com" --security-contact="info@cauchye.com" --details="CauchyE validator node. Delegate your tokens and Start Earning Staking Rewards."
# validator-d
> ~/go/bin/ununifid gentx validator-d 125000000000000uguu --chain-id="ununifi-test-v1" --from="validator-d" --ip="d.ununifi-test-v1.cauchye.net" --moniker="ununifi-test-d" --identity="ununifi-test-d" --node-id="59361cdca33b1abbf85b46adb62bb680c6d59768"  --pubkey="{\"@type\":\"/cosmos.crypto.ed25519.PubKey\",\"key\":\"GdkndYbKD0JYZTERnWg0ipAQ2i1WvcBhZAnNI0qNRnI=\"}" --commission-rate=0.1 --commission-max-rate=1.0 --commission-max-change-rate=1.0 --min-self-delegation=1 --website="https://cauchye.com" --security-contact="info@cauchye.com" --details="CauchyE validator node. Delegate your tokens and Start Earning Staking Rewards."
```
### To check the pubkey, execute the following command on each node.
```bash
> ~/go/bin/ununifid tendermint show-validator
```

## ununifid collect-gentxs
```bash
> ~/go/bin/ununifid collect-gentxs;
```

## add faucet account
```bash
> ~/go/bin/ununifid keys add faucet-a >& backup-faucet-a.txt
> ~/go/bin/ununifid keys add faucet-b >& backup-faucet-b.txt
> ~/go/bin/ununifid keys add faucet-c >& backup-faucet-c.txt
> ~/go/bin/ununifid keys add faucet-d >& backup-faucet-d.txt
```
## Set balance for Faucet account
```bash
> ~/go/bin/ununifid add-genesis-account faucet-a 125000000000000uguu;
> ~/go/bin/ununifid add-genesis-account faucet-b 125000000000000uguu;
> ~/go/bin/ununifid add-genesis-account faucet-c 125000000000000uguu;
> ~/go/bin/ununifid add-genesis-account faucet-d 125000000000000uguu;
```

## Start node.(Confirmation of temporary startup.)
```bash
> ~/go/bin/ununifid start
# stop "Ctrl + c"
> ~/go/bin/ununifid unsafe-reset-all
```
``unsafe-reset-all cmd will be remove all history data. Be careful to use it.``

---

# set cosmovisor
## `~/.profile`
``` 
export CHAIN_REPO=https://github.com/UnUniFi/chain
export CHAIN_REPO_BRANCHE=main
export TARGET=ununifid
export TARGET_HOME=.ununifi
export MONIKER=ununifi-test-a # This value is different for each validator.
export DL_CHAIN_BIN= # Currently this is not necessary.
export CHAIN_ID=ununifi-test-v1 # This value is example of mainnet.
export SEEDS= # Currently this is not necessary.
export PEERS= # This is necessary.
export GENESIS_FILE_URL=https://raw.githubusercontent.com/UnUniFi/network/ununifi-test-v1/launch/ununifi-test-v1/genesis.json
export SETUP_NODE_CONFIG_ENV=TRUE
export SETUP_NODE_ENV=TRUE
export SETUP_NODE_MASTER=TRUE
export DAEMON_NAME=$TARGET
export DAEMON_HOME=$HOME/$TARGET_HOME
export DAEMON_ALLOW_DOWNLOAD_BINARIES=true
export DAEMON_LOG_BUFFER_SIZE=512
export DAEMON_RESTART_AFTER_UPGRADE=true
export UNSAFE_SKIP_BACKUP=true
```

```bash
> source .profile
```

## install cosmovisor 
```bash
cd $HOME
go install github.com/cosmos/cosmos-sdk/cosmovisor/cmd/cosmovisor@v1.0.0
mkdir -p $DAEMON_HOME/cosmovisor
mkdir -p $DAEMON_HOME/cosmovisor/genesis
mkdir -p $DAEMON_HOME/cosmovisor/genesis/bin
mkdir -p $DAEMON_HOME/cosmovisor/upgrades
cp ~/go/bin/$DAEMON_NAME $DAEMON_HOME/cosmovisor/genesis/bin
```

## create cosmovisor.service
```bash
> touch /lib/systemd/system/cosmovisor.service
> vim /lib/systemd/system/cosmovisor.service
```

`/lib/systemd/system/cosmovisor.service`
```
[Unit]
Description=Cosmovisor daemon
After=network-online.target
[Service]
Environment="DAEMON_NAME=ununifid"
Environment="DAEMON_HOME=/root/.ununifi"
Environment="DAEMON_RESTART_AFTER_UPGRADE=true"
Environment="DAEMON_ALLOW_DOWNLOAD_BINARIES=false"
Environment="DAEMON_LOG_BUFFER_SIZE=512"
Environment="UNSAFE_SKIP_BACKUP=true"
User=root
ExecStart=/root/go/bin/cosmovisor start
Restart=always
RestartSec=3
LimitNOFILE=infinity
LimitNPROC=infinity
[Install]
WantedBy=multi-user.target
```

## Set systemctl
```bash
systemctl daemon-reload
systemctl restart systemd-journald
systemctl enable cosmovisor
```

## Start node with cosmovisor
```bash
> systemctl start cosmovisor
> systemctl status cosmovisor
● cosmovisor.service - Cosmovisor daemon
     Loaded: loaded (/lib/systemd/system/cosmovisor.service; enabled; vendor preset: enabled)
     Active: active (running) since Tue 2022-06-21 15:36:54 UTC; 2min 36s ago
   Main PID: 4152 (cosmovisor)
      Tasks: 14 (limit: 2274)
     Memory: 40.1M
     CGroup: /system.slice/cosmovisor.service
             ├─4152 /root/go/bin/cosmovisor start
             └─4157 /root/.ununifi/cosmovisor/genesis/bin/ununifid start

```

# SSL with Let ’s Encrypt

## install
```bash
> apt -y install certbot nginx
```

## domain setting
```
export DOMAIN=a.ununifi-test-v1.cauchye.net
```

## stop nginx
```bash
> systemctl stop nginx
```

## port allow
```bash
> ufw allow 80
> ufw allow 443
```

## Get an SSL certificate
```bash
> certbot certonly --standalone -d $DOMAIN -n --agree-tos -m <Email address>
```

## set nginx
```bash
> echo "server {
        listen 1318 ssl;
        server_name "$DOMAIN";
        ssl_certificate /etc/letsencrypt/live/"$DOMAIN"/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/"$DOMAIN"/privkey.pem;

        location / {
                proxy_pass http://127.0.0.1:1317;
                proxy_http_version 1.1;
        }
}
" > $HOME/nginx.conf
> mv $HOME/nginx.conf /etc/nginx/conf.d/ununifi.conf
> systemctl start nginx
```

## port close
```bash
> ufw status numbered
> ufw delete <port 80 and 443>
```

---
# Setup at each node
ununifi-test-b, ununifi-test-c, ununifi-test-d
## Initialize node
```bash
> ~/go/bin/ununifid init ununifi-test-b --chain-id ununifi-test-v1
> ~/go/bin/ununifid init ununifi-test-c --chain-id ununifi-test-v1
> ~/go/bin/ununifid init ununifi-test-d --chain-id ununifi-test-v1
```

## Set app.toml
```bash
# api enable
> sed -i '/\[api\]/,+3 s/enable = false/enable = true/' ~/.ununifi/config/app.toml;
# minimum-gas-prices -> "0uguu"
> sed -i 's/minimum-gas-prices = ".*"/minimum-gas-prices = "0uguu"/' ~/.ununifi/config/app.toml;
# Rest API : enabled-unsafe-cors = false -> true
> sed -E -i "s/enabled-unsafe-cors = false/enabled-unsafe-cors = true/" ~/.ununifi/config/app.toml;
```

## Set config.toml
```bash
# gRPC API : laddr -> tcp://0.0.0.0:26657
> sed -i 's|^laddr = "tcp://127.0.0.1:26657"|laddr = "tcp://0.0.0.0:26657"|g' ~/.ununifi/config/config.toml;
```

# set peers 
`.ununifi/config/config.toml`
## ununifi-test-b
```bash
> sed -i 's/persistent_peers = ".*"/persistent_peers = "59361cdca33b1abbf85b46adb62bb680c6d59768@d.ununifi-test-v1.cauchye.net:26656,a8d5662130dd127dfcf82314e7a5b379a95d9daf@c.ununifi-test-v1.cauchye.net:26656,65710949120e28f8af12f81b75efd2a509280f70@a.ununifi-test-v1.cauchye.net:26656"/' ~/.ununifi/config/config.toml;
```
## ununifi-test-c
```bash
> sed -i 's/persistent_peers = ".*"/persistent_peers = "65710949120e28f8af12f81b75efd2a509280f70@a.ununifi-test-v1.cauchye.net:26656,b20e3aad6b1bf7dc2d1635c388f578f335b13466@b.ununifi-test-v1.cauchye.net:26656,59361cdca33b1abbf85b46adb62bb680c6d59768@d.ununifi-test-v1.cauchye.net:26656"/' ~/.ununifi/config/config.toml;
```
## ununifi-test-d
```bash
> sed -i 's/persistent_peers = ".*"/persistent_peers = "65710949120e28f8af12f81b75efd2a509280f70@a.ununifi-test-v1.cauchye.net:26656,b20e3aad6b1bf7dc2d1635c388f578f335b13466@b.ununifi-test-v1.cauchye.net:26656,a8d5662130dd127dfcf82314e7a5b379a95d9daf@c.ununifi-test-v1.cauchye.net:26656"/' ~/.ununifi/config/config.toml;
```
## get genesis.json
```bash
> curl -L https://raw.githubusercontent.com/UnUniFi/network/ununifi-test-v1/launch/ununifi-test-v1/genesis.json -o ~/.ununifi/config/genesis.json
```
## set cosmovisor
Refer to the cosmovisor setup performed by ununifi-test-a.
Change PEERS and MONIKER as appropriate.


# setup faucet
## install docker
```bash
> mkdir -p ~/faucet
> cd ~/faucet
> wget https://github.com/tendermint/faucet/releases/download/v0.0.3/faucet_0.0.3_linux_amd64.tar.gz
> tar -xvf ./faucet_0.0.3_linux_amd64.tar.gz
> ufw allow <open listen port number>
> ./faucet --cli-name ununifid --denoms ubtc --keyring-backend test --account-name faucet --port 7000 --credit-amount=100 --max-credit=100 --home=/root/.ununifi &
> ./faucet --cli-name ununifid --denoms uguu --keyring-backend test --account-name faucet --port 7002 --credit-amount=100 --max-credit=100 --home=/root/.ununifi &
> echo "
  server {
    listen 8000;
    listen [::]:8000;
    server_name localhost;
    charset UTF-8;

    location / {
      proxy_http_version 1.1;
      proxy_pass http://localhost:7000;

      if (\$request_method = 'OPTIONS') {
        add_header Access-Control-Allow-Origin '*';
        add_header Access-Control-Allow-Methods 'GET, POST, PUT, DELETE';
        add_header Access-Control-Allow-Headers 'Origin, Authorization, Accept, Content-Type';
        # add_header Access-Control-Max-Age 3600;
        add_header Content-Type 'text/plain charset=UTF-8';
        add_header Content-Length 0;
        return 204;
      }
    }
  }

  server {
    listen 8002;
    listen [::]:8002;
    server_name localhost;
    charset UTF-8;

    location / {
      proxy_http_version 1.1;
      proxy_pass http://localhost:7002;

      if (\$request_method = 'OPTIONS') {
        add_header Access-Control-Allow-Origin '*';
        add_header Access-Control-Allow-Methods 'GET, POST, PUT, DELETE';
        add_header Access-Control-Allow-Headers 'Origin, Authorization, Accept, Content-Type';
        # add_header Access-Control-Max-Age 3600;
        add_header Content-Type 'text/plain charset=UTF-8';
        add_header Content-Length 0;
        return 204;
      }
    }
  }

" >> /etc/nginx/conf.d/ununifi.conf
> systemctl restart nginx
```