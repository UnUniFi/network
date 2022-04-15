#!/bin/bash

# mv ~/.ununifi/config/genesis.json .
npm i
# Caution: if genesis.json doesn't contain account type of vesting,
# process-genesis-mainnet script can't add vesting type account
# because genesis object doesn't have type information of vesting account type
# so before run this script, you have to put at leaset one vesting account info
# in the genesis.json
npm run start:process-genesis-mainnet
npm run start:process-airdrop-operation

# mv genesis.json ~/.ununifi/config/
