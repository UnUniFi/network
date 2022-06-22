# ssh disable password login
```bash
> vim /etc/ssh/sshd_config
```
PermitRootLogin yes -> without-password

# ufw で不要なportは閉じる
空ける必要があるポートを開けておく

```bash
> ufw allow <port-number>
> ufw status numbered
```

# update
```bash
> apt update -y && apt upgrade -y
```

# install
```bash
> apt install -y jq git build-essential
```

# go install : ver 1.17
```bash
> wget https://go.dev/dl/go1.17.linux-amd64.tar.gz
> rm -rf /usr/local/go
> tar -C /usr/local -xzf go1.17.linux-amd64.tar.gz
> export PATH=$PATH:/usr/local/go/bin
> go version
go version go1.17 linux/amd64
```

# ununifi blockchain build
```bash
> git clone https://github.com/UnUniFi/chain chain_repo  
> cd chain_repo
> git checkout main
> git pull
> make install
> ~/go/bin/ununifid version
main-a9f86eb184d518bd5122a5ad5a98d109f791ac6d
```

# Initialize node
```bash
> ~/go/bin/ununifid init ununifi-test-a --chain-id ununifi-test-v1
{"app_message":{"auction":{"auctions":[],"next_auction_id":"1","params":{"bid_duration":"3600s","increment_collateral":"0.050000000000000000","increment_debt":"0.050000000000000000","increment_surplus":"0.050000000000000000","max_auction_duration":"172800s"}},"auth":{"accounts":[],"params":{"max_memo_characters":"256","sig_verify_cost_ed25519":"590","sig_verify_cost_secp256k1":"1000","tx_sig_limit":"7","tx_size_cost_per_byte":"10"}},"authz":{"authorization":[]},"bank":{"balances":[],"denom_metadata":[],"params":{"default_send_enabled":true,"send_enabled":[]},"supply":[]},"capability":{"index":"1","owners":[]},"cdp":{"cdps":[],"deposits":[],"gov_denom":"uguu","params":{"collateral_params":[],"debt_params":[{"circuit_breaker":false,"conversion_factor":"6","debt_auction_lot":"10000000000","debt_auction_threshold":"100000000000","debt_denom":"debtjpu","debt_floor":"1","denom":"jpu","global_debt_limit":{"amount":"0","denom":"jpu"},"reference_asset":"jpy","surplus_auction_lot":"10000000000","surplus_auction_threshold":"500000000000"},{"circuit_breaker":false,"conversion_factor":"6","debt_auction_lot":"10000000000","debt_auction_threshold":"100000000000","debt_denom":"debteuu","debt_floor":"1","denom":"euu","global_debt_limit":{"amount":"0","denom":"euu"},"reference_asset":"eur","surplus_auction_lot":"10000000000","surplus_auction_threshold":"500000000000"}]},"previous_accumulation_times":[],"starting_cdp_id":"1","total_principals":[]},"crisis":{"constant_fee":{"amount":"1000","denom":"stake"}},"distribution":{"delegator_starting_infos":[],"delegator_withdraw_infos":[],"fee_pool":{"community_pool":[]},"outstanding_rewards":[],"params":{"base_proposer_reward":"0.010000000000000000","bonus_proposer_reward":"0.040000000000000000","community_tax":"0.020000000000000000","withdraw_addr_enabled":true},"previous_proposer":"","validator_accumulated_commissions":[],"validator_current_rewards":[],"validator_historical_rewards":[],"validator_slash_events":[]},"evidence":{"evidence":[]},"feegrant":{"allowances":[]},"genutil":{"gen_txs":[]},"gov":{"deposit_params":{"max_deposit_period":"172800s","min_deposit":[{"amount":"10000000","denom":"stake"}]},"deposits":[],"proposals":[],"starting_proposal_id":"1","tally_params":{"quorum":"0.334000000000000000","threshold":"0.500000000000000000","veto_threshold":"0.334000000000000000"},"votes":[],"voting_params":{"voting_period":"172800s"}},"ibc":{"channel_genesis":{"ack_sequences":[],"acknowledgements":[],"channels":[],"commitments":[],"next_channel_sequence":"0","receipts":[],"recv_sequences":[],"send_sequences":[]},"client_genesis":{"clients":[],"clients_consensus":[],"clients_metadata":[],"create_localhost":false,"next_client_sequence":"0","params":{"allowed_clients":["06-solomachine","07-tendermint"]}},"connection_genesis":{"client_connection_paths":[],"connections":[],"next_connection_sequence":"0","params":{"max_expected_time_per_block":"30000000000"}}},"incentive":{"cdp_accumulation_times":[],"cdp_minting_claims":[],"denoms":{"cdp_minting_reward_denom":"uguu","principal_denom":"jpu"},"params":{"cdp_minting_reward_periods":[],"claim_end":"1970-01-01T00:00:01Z","claim_multipliers":[]}},"mint":{"minter":{"annual_provisions":"0.000000000000000000","inflation":"0.130000000000000000"},"params":{"blocks_per_year":"6311520","goal_bonded":"0.670000000000000000","inflation_max":"0.200000000000000000","inflation_min":"0.070000000000000000","inflation_rate_change":"0.130000000000000000","mint_denom":"stake"}},"params":null,"pricefeed":{"params":{"markets":[]},"posted_prices":[]},"slashing":{"missed_blocks":[],"params":{"downtime_jail_duration":"600s","min_signed_per_window":"0.500000000000000000","signed_blocks_window":"100","slash_fraction_double_sign":"0.050000000000000000","slash_fraction_downtime":"0.010000000000000000"},"signing_infos":[]},"staking":{"delegations":[],"exported":false,"last_total_power":"0","last_validator_powers":[],"params":{"bond_denom":"stake","historical_entries":10000,"max_entries":7,"max_validators":100,"unbonding_time":"1814400s"},"redelegations":[],"unbonding_delegations":[],"validators":[]},"transfer":{"denom_traces":[],"params":{"receive_enabled":true,"send_enabled":true},"port_id":"transfer"},"ununifidist":{"gov_denom":"uguu","params":{"active":false,"periods":[]},"previous_block_time":"1970-01-01T00:00:01Z"},"upgrade":{},"vesting":{},"wasm":{"codes":[],"contracts":[],"gen_msgs":[],"params":{"code_upload_access":{"address":"","permission":"Everybody"},"instantiate_default_permission":"Everybody","max_wasm_code_size":"1228800"},"sequences":[]}},"chain_id":"ununifi-test-v1","gentxs_dir":"","moniker":"ununifi-test-a","node_id":"65710949120e28f8af12f81b75efd2a509280f70"}
```

# backup genesis.json 
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

# get mainnet genesis.json
```bash
> curl -L https://raw.githubusercontent.com/UnUniFi/network/main/launch/ununifi-beta-v1/genesis.json -o ~/.ununifi/config/genesis-mainnet.json
> curl -L https://raw.githubusercontent.com/UnUniFi/network/main/launch/ununifi-beta-v1/genesis-pretty.json -o ~/.ununifi/config/genesis-pretty-mainnet.json
```

# Set app.toml
```bash
# api enable
> sed -i '/\[api\]/,+3 s/enable = false/enable = true/' ~/.ununifi/config/app.toml;
# minimum-gas-prices -> "0uguu"
> sed -i 's/minimum-gas-prices = ".*"/minimum-gas-prices = "0uguu"/' ~/.ununifi/config/app.toml;
```

# Set genesis.json to match the mainnet configuration.
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
# wasm params.code_upload_access.permission -> "Nobody"
> jq '.app_state.wasm.params.code_upload_access.permission = "Nobody"'  ~/.ununifi/config/genesis.json > temp.json ; mv temp.json ~/.ununifi/config/genesis.json;
# wasm params.instantiate_default_permission -> "Nobody"
> jq '.app_state.wasm.params.instantiate_default_permission = "Nobody"'  ~/.ununifi/config/genesis.json > temp.json ; mv temp.json ~/.ununifi/config/genesis.json;
```

# bank send enable
```bash
# default_send_enabled -> true
> jq '.app_state.bank.params.default_send_enabled = true'  ~/.ununifi/config/genesis.json > temp.json ; mv temp.json ~/.ununifi/config/genesis.json;
```

# add validator account
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

# add-genesis-account. Set balance for Validator account
10億GUU 1GUU=10^6uguu
125000000 000000uguu
```bash
> ~/go/bin/ununifid add-genesis-account validator-a 125000000000000uguu;
> ~/go/bin/ununifid add-genesis-account validator-b 125000000000000uguu;
> ~/go/bin/ununifid add-genesis-account validator-c 125000000000000uguu;
> ~/go/bin/ununifid add-genesis-account validator-d 125000000000000uguu;
```

# gentx. Generate a genesis transaction that creates a validator with a self-delegation
```bash
# validator-a
> ~/go/bin/ununifid gentx validator-a 125000000000000uguu --chain-id="ununifi-test-v1" --from="validator-a" --ip="2001:19f0:7002:4d3:5400:04ff:fe07:ef3a" --moniker="ununifi-test-a" --identity="ununifi-test-a" --node-id="65710949120e28f8af12f81b75efd2a509280f70" --commission-rate=0.1 --commission-max-rate=1.0 --commission-max-change-rate=1.0 --min-self-delegation=1 --website="https://cauchye.com" --security-contact="info@cauchye.com" --details="CauchyE validator node. Delegate your tokens and Start Earning Staking Rewards."
# validator-b
> ~/go/bin/ununifid gentx validator-b 125000000000000uguu --chain-id="ununifi-test-v1" --from="validator-b" --ip="2001:19f0:7002:4d3:5400:04ff:fe07:ef3a" --moniker="ununifi-test-b" --identity="validator-b" --node-id="65710949120e28f8af12f81b75efd2a509280f70" --commission-rate=0.1 --commission-max-rate=1.0 --commission-max-change-rate=1.0 --min-self-delegation=1 --website="https://cauchye.com" --security-contact="info@cauchye.com" --details="CauchyE validator node. Delegate your tokens and Start Earning Staking Rewards."
# validator-c
> ~/go/bin/ununifid gentx validator-c 125000000000000uguu --chain-id="ununifi-test-v1" --from="validator-c" --ip="2001:19f0:7002:4d3:5400:04ff:fe07:ef3a" --moniker="ununifi-test-c" --identity="validator-c" --node-id="65710949120e28f8af12f81b75efd2a509280f70" --commission-rate=0.1 --commission-max-rate=1.0 --commission-max-change-rate=1.0 --min-self-delegation=1 --website="https://cauchye.com" --security-contact="info@cauchye.com" --details="CauchyE validator node. Delegate your tokens and Start Earning Staking Rewards."
# validator-d
> ~/go/bin/ununifid gentx validator-d 125000000000000uguu --chain-id="ununifi-test-v1" --from="validator-d" --ip="2001:19f0:7002:4d3:5400:04ff:fe07:ef3a" --moniker="ununifi-test-d" --identity="validator-d" --node-id="65710949120e28f8af12f81b75efd2a509280f70" --commission-rate=0.1 --commission-max-rate=1.0 --commission-max-change-rate=1.0 --min-self-delegation=1 --website="https://cauchye.com" --security-contact="info@cauchye.com" --details="CauchyE validator node. Delegate your tokens and Start Earning Staking Rewards."
```

# ununifid collect-gentxs
```bash
> ~/go/bin/ununifid collect-gentxs;
```

# add faucet account
```bash
> ~/go/bin/ununifid keys add faucet-a >& backup-faucet-a.txt
> ~/go/bin/ununifid keys add faucet-b >& backup-faucet-b.txt
> ~/go/bin/ununifid keys add faucet-c >& backup-faucet-c.txt
> ~/go/bin/ununifid keys add faucet-d >& backup-faucet-d.txt
```
# Set balance for Faucet account
```bash
> ~/go/bin/ununifid add-genesis-account faucet-a 125000000000000uguu;
> ~/go/bin/ununifid add-genesis-account faucet-b 125000000000000uguu;
> ~/go/bin/ununifid add-genesis-account faucet-c 125000000000000uguu;
> ~/go/bin/ununifid add-genesis-account faucet-d 125000000000000uguu;
```

# Start node.
```bash
> ~/go/bin/ununifid start
# stop "Ctrl + c"
> ~/go/bin/ununifid unsafe-reset-all
```


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

# install cosmovisor 
```bash
cd $HOME
go install github.com/cosmos/cosmos-sdk/cosmovisor/cmd/cosmovisor@v1.0.0
mkdir -p $DAEMON_HOME/cosmovisor
mkdir -p $DAEMON_HOME/cosmovisor/genesis
mkdir -p $DAEMON_HOME/cosmovisor/genesis/bin
mkdir -p $DAEMON_HOME/cosmovisor/upgrades
cp ~/go/bin/$DAEMON_NAME $DAEMON_HOME/cosmovisor/genesis/bin
```

# create cosmovisor.service
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

# Set systemctl
```bash
systemctl daemon-reload
systemctl restart systemd-journald
systemctl enable cosmovisor
```

# Start node with cosmovisor
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

