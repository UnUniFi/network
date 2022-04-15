import * as fs from "fs";
import genesis from "./genesis.json";
import * as bech32 from "bech32";

const genesisJson = genesis;
const PATH = require("path");
const { parse } = require("csv-parse/sync");

const UNUNIFI = "ununifi";
const HTTPS_STRING = "https";
const LEN_RECORD_CONTENT = 2;
const REGEX = RegExp(/^\w{46}$/);
const TOTAL_AIRDROP_AMOUNT = 30000000000000;

function arrangeReportingScammers(FileName: string): Array<any> {
  // read the file
  const filepath = PATH.join(__dirname, FileName);
  const data = fs.readFileSync(filepath);

  // parse the content of the file
  const records = parse(data);

  // arange the content
  let index = 0;

  // array to have each discord-id and address pair
  let arrangedList: any[] = [];

  for (const record of records) {
    const urlString = record[3].substr(0, 5);
    const addressPrefix = record[4].substr(0, 7);
    if (HTTPS_STRING != urlString) {
      delete records[index];
    } else if (addressPrefix != UNUNIFI) {
      delete records[index];
    } else if (!checkAddressFormat(record[4])) {
      delete records[index];
    } else {
      let content = [record[2], record[4]];
      arrangedList.push(content);
    }
    index++;
  }

  return arrangedList;
}

function arrangeAirdropApplication(FileName: string): Array<any> {
  // read the file
  const filepath = PATH.join(__dirname, FileName);
  const data = fs.readFileSync(filepath);

  // parse the content of the file
  const records = parse(data);

  // arrange content
  let index = 0;

  // array to have each discord-id and address pair
  let arrangedList = [];
  for (const record of records) {
    const addressPrefix = record[4].substr(0, 7);
    if (addressPrefix != UNUNIFI) {
      delete records[index];
    } else if (!checkAddressFormat(record[4])) {
      delete records[index];
    } else {
      let content = [record[2], record[4]];
      arrangedList.push(content);
    }
    index += 1;
  }

  return arrangedList;
}

/* // arrange non active doubtful user report form
function arrangeDoubtfulUser(FileName: string): any {
  // read the file
  const filepath = PATH.join(__dirname,  FileName);
  const data = fs.readFileSync(filepath);

  // parse the content of the file
  const records = parse(data);

  // arrange content ([reporter id, doubtfulUser id])
  let arrangeList = [];
  for (const record of records) {
    arrangeList.push([record[2], record[4]]);
  }
  return arrangeList;
} */

// overwrite the reported discord-id user's address and doubtful user id, and then create a perfect list
function makeFinalList(
  arrangedReportingScammersList: Array<any>,
  arrangedAirdropApplicationList: Array<any>
): Array<any> {
  const lenArrangedReportingScammersList = arrangedReportingScammersList.length;
  for (let i = 0; i < lenArrangedReportingScammersList; i++) {
    arrangedAirdropApplicationList.filter(function (pair) {
      if (pair[0] == arrangedReportingScammersList[i][0]) {
        return (pair[1] = arrangedReportingScammersList[i][1]);
      }
    });
  }
  /* arrangedAirdropApplicationList.map((pair) => {
    for (const doubtfulUser of doubtfulUserList) {
      if (pair[0] == doubtfulUser[1]) {
        return pair[1] = "disallowed";
      }
    }
  }) */

  return arrangedAirdropApplicationList;
}

function addressValidation(finalAirdropList: Array<any>): Array<any> {
  let validatedFinalAirdropList = [];
  for (const list of finalAirdropList) {
    //check the appearance (should be once)
    if (existanceJudgement(list, validatedFinalAirdropList)) {
      continue;
    }
    // check if the address follows bech32 format (don't include 1, i, b, o)
    else if (!checkAddressFormat(list[1])) {
      continue;
    } else {
      let validatedContent = list;
      validatedFinalAirdropList.push(validatedContent);
    }
  }
  return validatedFinalAirdropList;
}
function existanceJudgement(
  addressPair: Array<string>,
  list: Array<any>
): Boolean {
  const lenList = list.length;
  for (let i = 0; i < lenList; i++) {
    if (addressPair[0] == list[i][0]) {
      return true;
    } else if (addressPair[1] == list[i][1]) {
      return true;
    }
  }
  return false;
}

function checkAddressFormat(address: string): boolean {
  if (!REGEX.test(address)) {
    return false;
  }
  // check if the address part follows the bech32 chars rule
  try {
    const _ = bech32.decode(address);
  } catch (e) {
    return false;
  }

  return true;
}

function exportCSV(content: Array<any>, exportingFileName: string) {
  // export aranged csv file
  let str = "Discord-id,WalletAddress,\n";
  const lenArrangedRecord = content.length;
  for (let i = 0; i < lenArrangedRecord; i++) {
    for (let j = 0; j < LEN_RECORD_CONTENT; j++) {
      (str += '"' + content[i][j] + '",'), "";
    }
    str += "\n";
  }

  try {
    const filepath = PATH.join(__dirname, exportingFileName);
    fs.writeFileSync(filepath, str);
  } catch (e) {
    console.log(e);
  }
}

// below is the fns for determine airdrop amount for the typed addresses
function determineBaseAirdropAmount(numEligibleAcc: number): {
  baseAirdropAmount: number;
  restAmount: number;
} {
  const baseAirdropAmount = Math.floor(TOTAL_AIRDROP_AMOUNT / numEligibleAcc);

  const restAmount = TOTAL_AIRDROP_AMOUNT - baseAirdropAmount * numEligibleAcc;

  return { baseAirdropAmount, restAmount };
}

// below is the fns for the process related to genesis.json manipulation
function extractAddresses(airdropList: Array<any>): Array<string> {
  let airdropAdresses = airdropList.map((content) => {
    return content[1];
  });
  return airdropAdresses;
}

function processGenesisAccounts(airdropAddresses: Array<string>) {
  for (const address of airdropAddresses) {
    genesisJson.app_state.auth.accounts.push({
      "@type": "/cosmos.auth.v1beta1.BaseAccount",
      address: address,
      pub_key: null,
      account_number: "0",
      sequence: "0",
    });
  }
}

function processGenesisBankBalances(
  airdropAddresses: Array<string>,
  amount: string
) {
  // add airdrop information
  for (const address of airdropAddresses) {
    genesisJson.app_state.bank.balances.push({
      address: address,
      coins: [
        {
          denom: "uguu",
          amount: amount,
        },
      ],
    });
  }
}

// export processed genesis.json
function exportJSON(data: any) {
  const genesisJson = JSON.stringify(data, null, "  ");
  const outputFilepath = PATH.join(__dirname, "genesis.json");

  try {
    fs.writeFileSync(outputFilepath, genesisJson);
  } catch (e) {
    console.log(e);
  }
}

function exportTokenAllocationInfo(
  numValidAddresses: number,
  baseAirdropAmount: number,
  restAmount: number
) {
  let data = "";
  data +=
    "Number of the valid addresses," + numValidAddresses.toString() + ",\n";
  data += "Basic airdrop amount," + baseAirdropAmount.toString() + ",\n";
  data +=
    "The rest of token amount for airdrop," + restAmount.toString() + ",\n";

  const outputFilepath = PATH.join(__dirname, "key-info.csv");
  try {
    fs.writeFileSync(outputFilepath, data);
  } catch (e) {
    console.log(e);
  }
}

const main = () => {
  // the process of csv files and create final valid addresses
  const arrangedReportingScammersList = arrangeReportingScammers(
    "Form_for_reporting_scammers_who_use_your_id.csv"
  );
  const arrangedAirdropApplicationList = arrangeAirdropApplication(
    "UnUniFi_Testnet_Airdrop_Campaign_Application_Form.csv"
  );
  // the content of doubtfulUserList is [reporter, doubtful user]
  //const doubtfulUserList = arrangeDoubtfulUser("Form_for_reporting_non_active_doubtful_user_by_rules-agreed.csv");
  const finalAirdropList = makeFinalList(
    arrangedReportingScammersList,
    arrangedAirdropApplicationList
  );

  const validatedFinalAirdropList = addressValidation(finalAirdropList);
  //exportCSV(validatedFinalAirdropList, "Final_airdrop_list.csv");

  // the process related to genesis.json
  const validatedFinalAirdropAddresses = extractAddresses(
    validatedFinalAirdropList
  );
  processGenesisAccounts(validatedFinalAirdropAddresses);

  const numValidAddresses = validatedFinalAirdropAddresses.length;
  const { baseAirdropAmount, restAmount } =
    determineBaseAirdropAmount(numValidAddresses);
  processGenesisBankBalances(
    validatedFinalAirdropAddresses,
    baseAirdropAmount.toString()
  ); // the amount is temporal

  exportJSON(genesisJson);
  exportTokenAllocationInfo(numValidAddresses, baseAirdropAmount, restAmount);
};

main();
