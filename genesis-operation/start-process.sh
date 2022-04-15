#!/bin/bash

mv ~/.ununifi/config/genesis.json .
npm i
npm run start:process-genesis-mainnet
npm run start:process-airdrop-operation


mv genesis.json ~/.ununifi/config/
