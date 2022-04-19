#!/bin/bash

rm -rf ~/.ununifi;
ununifid unsafe-reset-all
ununifid init [moniker] --chain-id [chain-id]

sed -i '/\[api\]/,+3 s/enable = false/enable = true/' ~/.ununifi/config/app.toml
sed -i 's/stake/uguu/g' ~/.ununifi/config/genesis.json
jq '.app_state.cdp.params.collateral_params =[{ "auction_size": "50000000000", "conversion_factor": "6", "debt_limit": { "amount": "20000000000000", "denom": "jpu" }, "denom": "ubtc", "liquidation_market_id": "ubtc:jpy:30", "liquidation_penalty": "0.075000000000000000", "liquidation_ratio": "1.500000000000000000", "prefix": 0, "spot_market_id": "ubtc:jpy", "stability_fee": "1.000000001547125958", "type": "ubtc-a", "check_collateralization_index_count": "1000", "keeper_reward_percentage": "0.000001" },{"auction_size": "50000000000", "conversion_factor": "6","debt_limit": {"amount":"20000000000000","denom": "euu" },"denom": "ubtc", "liquidation_market_id": "ubtc:eur:30",  "liquidation_penalty": "0.075000000000000000",  "liquidation_ratio": "1.500000000000000000",  "prefix": 1,  "spot_market_id": "ubtc:eur",  "stability_fee": "1.000000001547125958",  "type": "ubtc-b",  "check_collateralization_index_count": "1000", "keeper_reward_percentage": "0.000001"}]'  ~/.ununifi/config/genesis.json > temp.json ; mv temp.json ~/.ununifi/config/genesis.json
jq '.app_state.cdp.params.debt_params[0].global_debt_limit.amount = "200000000000000"'  ~/.ununifi/config/genesis.json > temp.json ; mv temp.json ~/.ununifi/config/genesis.json;
jq '.app_state.cdp.params.debt_params[1].global_debt_limit.amount = "200000000000000"'  ~/.ununifi/config/genesis.json > temp.json ; mv temp.json ~/.ununifi/config/genesis.json;
jq '.app_state.pricefeed.params.markets = [{ "market_id": "ubtc:jpy", "base_asset": "ubtc", "quote_asset": "jpy", "oracles": [ "ununifi1a8jcsmla6heu99ldtazc27dna4qcd4jygsthx6" ], "active": true }, { "market_id": "ubtc:jpy:30", "base_asset": "ubtc", "quote_asset": "jpy", "oracles": [ "ununifi1a8jcsmla6heu99ldtazc27dna4qcd4jygsthx6" ], "active": true }, { "market_id": "ubtc:eur", "base_asset": "ubtc", "quote_asset": "eur", "oracles": [ "ununifi1a8jcsmla6heu99ldtazc27dna4qcd4jygsthx6" ], "active": true }, { "market_id": "ubtc:eur:30", "base_asset": "ubtc", "quote_asset": "eur", "oracles": [ "ununifi1a8jcsmla6heu99ldtazc27dna4qcd4jygsthx6" ], "active": true }]'  ~/.ununifi/config/genesis.json > temp.json ; mv temp.json ~/.ununifi/config/genesis.json;
jq '.app_state.gov.voting_params.voting_period = "259200s"'  ~/.ununifi/config/genesis.json > temp.json ; mv temp.json ~/.ununifi/config/genesis.json;
ununifid collect-gentxs;

jq '.app_state.auth.accounts |= .+[{"@type":"/cosmos.auth.v1beta1.BaseAccount","address":"todefinetypeintsfile","pub_key":null,"account_number":"0","sequence":"0"}]' ~/.ununifi/config/genesis.json > temp.json ; mv temp.json ~/.ununifi/config/genesis.json
# move to folder that have ts scripts
# locate genesis.json file in where is appropriate for executing below ts scripts
./node_modules/.bin/ts-node ./process-genesis-mainnet.ts
./node_modules/.bin/ts-node ./process-airdrop-operation.ts
mv ./genesis.json ~/.ununifi/config/;
ununifid start;
