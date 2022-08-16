#!/bin/sh

rm -rf ~/.ununifi

set -o errexit -o nounset

# Build genesis
ununifid init --chain-id ununifi-upgrade-test-v1 testing
cp genesis-mainnet-mock.json ~/.ununifi/config/genesis.json
ununifid keys mnemonic >& validator.txt
ununifid keys mnemonic >& debug.txt
ununifid keys add validator --recover < validator.txt 
ununifid keys add debug --recover < debug.txt
ununifid add-genesis-account $(ununifid keys show validator --address) 100000000000000uguu
echo "added val"
ununifid add-genesis-account $(ununifid keys show debug --address) 100000000000000uguu
echo "added deug"
ununifid gentx validator 100000000uguu --chain-id=ununifi-upgrade-test-v1
echo "gentx"

ununifid collect-gentxs

# Edit app.toml to enable unsafe-cors and set pruning everything to reduce disk usage.
# sed -E -i "s/enabled-unsafe-cors = false/enabled-unsafe-cors = true/" ~/.ununifi/config/app.toml;
# sed -E -i "s/pruning = \".*\"/pruning = \"everything\"/" ~/.ununifi/config/app.toml;

# Start node
ununifid start --pruning=nothing
