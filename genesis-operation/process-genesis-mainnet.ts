// vadation file of genesis.json at mainnet launch
import genesis from "./genesis.json";
import * as fs from "fs";

const path = require("path");
const { parse } = require("csv-parse/sync");

const genesisJson = genesis;
const genesisTime = genesisJson.genesis_time;
const unixGenesisTime = genesisTimeToUnixTime(genesisTime);

function disableTokenTransfer() {
  // check the permission state of default_send_enabled
  let default_send_state =
    genesisJson.app_state.bank.params.default_send_enabled;
  if (default_send_state != false) {
    default_send_state = false;
  }
}

function arrangeTokenAllocationInfoCsv(fileName: string): {
  keyData: any;
  vestingKeyData: any;
} {
  // read the file
  const filepath = path.join(__dirname, fileName);
  const data = fs.readFileSync(filepath);

  // parse the content of the file
  const records = parse(data);

  // keyData = [address, balance]
  let keyData = [];
  
  // vestingKeyData = [address, balance, end_time]
  let vestingKeyData = [];

  for (const record of records) {
    if (record[4] == "") {
      continue;
    } else if (record[8] == "FALSE") {
      const balance = record[5].replace(/,/g, "");
      const content = [record[4], balance];
      keyData.push(content);
    } else if (record[8] == "TRUE" && record[11] == "") {
      const balance = record[5].replace(/,/g, "");
      const content = [record[4], balance, record[10]];
      vestingKeyData.push(content);
    }
  }
  return { keyData, vestingKeyData };
}

function processNormalAccounts(accInfo: any) {
  for (const acc of accInfo) {
    genesisJson.app_state.auth.accounts.push({
      "@type": "/cosmos.auth.v1beta1.BaseAccount",
      address: acc[0],
      pub_key: null,
      account_number: "0",
      sequence: "0",
    });

    genesisJson.app_state.bank.balances.push({
      address: acc[0],
      coins: [
        {
          denom: "uguu",
          amount: acc[1],
        },
      ],
    });
  }
}

function processVestingAccounts(accInfo: any) {
  for (const acc of accInfo) {
    const end_time = dateToUnixTime(acc[2]);

    genesisJson.app_state.auth.accounts.push(
      {
        "@type": "/cosmos.vesting.v1beta1.ContinuousVestingAccount",
        base_vesting_account: {
          base_account: {
            address: acc[0],
            pub_key: null,
            account_number: "0",
            sequence: "0",
          },
          original_vesting: [
            {
              denom: "uguu",
              amount: acc[1],
            },
          ],
          delegated_free: [],
          delegated_vesting: [],
          end_time: end_time,
      },
      start_time: unixGenesisTime,
      });
    
    // add balance to vesting accs
    genesisJson.app_state.bank.balances.push(
      {
        "address": acc[0],
        "coins": [
          {
            "denom": "uguu",
            "amount": acc[1]
          }
        ]
      }
    );
  }
}

// treat date as UTC
function genesisTimeToUnixTime(date: string): string {
  const revisedDate = date
    .replace(/-/g, "/")
    .replace(/T/g, " ")
    .replace(/Z/g, "");
  const unixTime = Date.parse(revisedDate) / 1000;
  return unixTime.toString();
}

function dateToUnixTime(gmtDate: string): string {
  const unixTime = Date.parse(gmtDate) / 1000;
  return unixTime.toString();
}

// export processed genesis.json
function exportJSON(data: any) {
  const genesisJson = JSON.stringify(data, null, "  ");
  const outputFilepath = path.join(
    __dirname,
    "genesis.json"
  );

  try {
    fs.writeFileSync(outputFilepath, genesisJson);
  } catch (e) {
    console.log(e);
  }
}

const main = () => {
  disableTokenTransfer();

  // vesting account info type should be following:
  // [address: string, amount: string, vesting period: num ? string]
  // processVestingAccounts(vestingAccInfo);
  const { keyData, vestingKeyData } = arrangeTokenAllocationInfoCsv(
    "launch_preparation_public_test_v2-token-allocation.csv"
  );

  processNormalAccounts(keyData);
  processVestingAccounts(vestingKeyData);

  exportJSON(genesisJson);
};

main();
