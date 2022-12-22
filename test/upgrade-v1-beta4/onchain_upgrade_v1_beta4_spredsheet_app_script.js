// This script is AppScript for spreadsheets
// for spreadsheets.
// It is used in the following spreadsheets.
// https://cauchye.slack.com/files/U8W7Y7VHT/F04DM12FPKP/token_distribution_on_upgrade_in_the_middle_of_december
const ERROR_CODE = {
    none: 0,
    no_address: 1, 
    address_mismatched_discord_usernames: 2,
    amount_0: 3
  }
  const ERROR_MSG = [
    "no error",
    "target no ununifi address.",
    "Same address but mismatched Discord usernames.",
    "target amount 0."
  ]
  // input data index
  const WALLET_ADDRESS = 0;
  const DISCORD_ID = 1;
  const VESTING_AMOUNT_UGUU = 2;
  const VALIDATOR_AMOUNT_UGUU = 3;
  const VESTING_STARTS = 5;
  const VESTING_ENDS = 6;
  
  function main() {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    let com_prog_sheet = spreadsheet.getSheetByName("Community Program");
    let comp_sheet = spreadsheet.getSheetByName("Competition");
    let mode_sheet = spreadsheet.getSheetByName("Moderator");
    let vali_sheet = spreadsheet.getSheetByName("validators");
    let vc_sheet = spreadsheet.getSheetByName("Existing VC of Japanese company");
    let advisor_sheet = spreadsheet.getSheetByName("Advisor");
  
    let range;
  
    // /////////////////// get data
  
    // get data (Community Program)
    // Community Program record
    // 0 : wallet address
    // 1 : discord id
    // 2 : amount(uguu)
    // 3 : vesting amount
    // 4 : vesting term
    // 5 : vesting start
    // 6 : vesting end
    // 7 : others
    // 8 : delegating amount
    range = com_prog_sheet.getRange('b3:j');
    let obj_com_prog_records = range.getValues();
  
    // get data (Competition)
    range = comp_sheet.getRange('b3:i');
    let obj_comp_records = range.getValues();
  
    // get data (Moderator)
    range = mode_sheet.getRange('b3:i');
    let obj_mode_records = range.getValues();
  
    // get data (validators)
    range = vali_sheet.getRange('b3:m');
    let obj_vali_records     = range.getValues().filter((target) => (target[WALLET_ADDRESS] != "" && Number(target[VALIDATOR_AMOUNT_UGUU]) > 0));
    let obj_lendvali_records = range.getValues().filter((target) => (target[WALLET_ADDRESS] != "" && Number(target[VALIDATOR_AMOUNT_UGUU]) == 0));
  
    // get data (Existing VC of Japanese company)
    range = vc_sheet.getRange('c3:j');
    let obj_vc_records = range.getValues();
  
    // get data (Advisor)
    range = advisor_sheet.getRange('c3:j');
    let obj_advisor_records = range.getValues();
  
    // /////////////////// put together a list
    let validator_bank_send_list = new Map(); // man = {"address": {error code: 0, address: "addr", discord id: "id", amount: 0, vesting starts: "", vestting ends: ""}}
    let lendvalidator_bank_send_list = new Map();
    let eco_bank_send_list = new Map();
    let vc_bank_send_list = new Map();
    let advisor_bank_send_list = new Map();
    let error_list = new Map();    // man = {"discord_id": {error code: 1, address: "addr", discord id: "id", amount: 0, vesting starts: "", vestting ends: ""}}
    
    // send target : validator
    obj_vali_records.forEach((target) => chkBankSendTarget(target, validator_bank_send_list, error_list, null, null, null, obj_vali_records, null, null));
    obj_lendvali_records.forEach((target) => chkBankSendTarget(target, lendvalidator_bank_send_list, error_list, null, null, null, obj_lendvali_records, null, null));
  
    // send target : community program, competition, moderator
    obj_com_prog_records.forEach((target) => chkBankSendTarget(target, eco_bank_send_list, error_list, obj_com_prog_records, obj_comp_records, obj_mode_records, null, null, null));
    obj_comp_records.forEach((target) => chkBankSendTarget(target, eco_bank_send_list, error_list, obj_com_prog_records, obj_comp_records, obj_mode_records, null, null, null));
    obj_mode_records.forEach((target) => chkBankSendTarget(target, eco_bank_send_list, error_list, obj_com_prog_records, obj_comp_records, obj_mode_records, null, null, null));
  
    // send target : Existing VC of Japanese company
    obj_vc_records.forEach((target) => chkBankSendTarget(target, vc_bank_send_list, error_list, null, null, null, null, obj_vc_records, null));
  
    // send target : advisor
    obj_advisor_records.forEach((target) => chkBankSendTarget(target, advisor_bank_send_list, error_list, null, null, null, null, null, obj_advisor_records));
  
  
    // /////////////////// output
    // output sheet (validator bank send list)
    let bankSendListSheet = spreadsheet.getSheetByName("validator bank send list");
    output_bank_send_list(bankSendListSheet, validator_bank_send_list)
    // output sheet (lendvalidator bank send list)
    bankSendListSheet = spreadsheet.getSheetByName("lendvalidator bank send list");
    output_bank_send_list(bankSendListSheet, lendvalidator_bank_send_list)
    // output sheet (eco bank send list)
    bankSendListSheet = spreadsheet.getSheetByName("eco bank send list");
    output_bank_send_list(bankSendListSheet, eco_bank_send_list)
    // output sheet (vc bank send list)
    bankSendListSheet = spreadsheet.getSheetByName("vc bank send list");
    output_bank_send_list(bankSendListSheet, vc_bank_send_list)
    // output sheet (advisors bank send list)
    bankSendListSheet = spreadsheet.getSheetByName("advisors bank send list");
    output_bank_send_list(bankSendListSheet, advisor_bank_send_list)
    // output sheet (error list)
    output_error_list(spreadsheet, error_list)
  
    // output json 
    output_json(spreadsheet, validator_bank_send_list, lendvalidator_bank_send_list, eco_bank_send_list, vc_bank_send_list, advisor_bank_send_list)
  }
  
  
  function chkBankSendTarget(target, bank_send_list, error_list, obj_com_prog_records, obj_comp_records, obj_mode_records, obj_vali_records, obj_vc_records, obj_advisor_records){
    // check addres blank
    const _TARGET_ADDR = target[WALLET_ADDRESS];
    const _TARGET_DISCORD_ID = target[DISCORD_ID];
    if (_TARGET_ADDR == "")
    {
      if (_TARGET_DISCORD_ID == "")
        return; // skip (no data)
  
      // error : no_address
      Logger.log(ERROR_MSG[ERROR_CODE.no_address] + ": discord id[%s], address[%s]", _TARGET_DISCORD_ID, _TARGET_ADDR);
      error_list.set(_TARGET_DISCORD_ID, getObject(target, ERROR_CODE.no_address));
      return;
    }
  
    // check bank send list
    // Data for the same addresses are combined in a later process, so addresses that have already been set in the processed list are skipped.
    if (bank_send_list.has(_TARGET_ADDR))
    {
      return;// skip
    }
  
    // check same address
    // Checks for the same address from all the transmission targets and adds them up if they are the same.
    let same_records = getSameAddress(_TARGET_ADDR, obj_com_prog_records, obj_comp_records, obj_mode_records, obj_vali_records, obj_vc_records, obj_advisor_records);
    let count = same_records.length;
    if (count > 1){
      // is same address
  
      let sameIds = same_records.filter((e) => e[DISCORD_ID] === _TARGET_DISCORD_ID);
      if (sameIds.length == count)
      {
        // is same discord id
        let sum_amount = 0;
        same_records.forEach((e) => sum_amount = sum_amount + Number(e[VESTING_AMOUNT_UGUU]));
  
        // vesting_start sets a more past time
        // vesting_end sets a more future time
        let target_vesting_start_latest_date = Math.min(...same_records.map((e)=>e[VESTING_STARTS]));
        let target_vesting_end_latest_date = Math.max(...same_records.map((e)=>e[VESTING_ENDS]));
        let _target = same_records[0];
        _target[VESTING_STARTS] = new Date(target_vesting_start_latest_date);
        _target[VESTING_ENDS] = new Date(target_vesting_end_latest_date);
        _target[VESTING_AMOUNT_UGUU] = sum_amount;
        
        // add bank send list
        bank_send_list.set(_target[WALLET_ADDRESS], getObject(_target, ERROR_CODE.none));
      }
      else
      {
        // error : Same address but mismatched Discord usernames
        Logger.log(ERROR_MSG[ERROR_CODE.address_mismatched_discord_usernames] + ": discord id[%s], address[%s]", _TARGET_DISCORD_ID, _TARGET_ADDR);
        error_list.set(_TARGET_DISCORD_ID, getObject(target, ERROR_CODE.address_mismatched_discord_usernames));
        return;
      }
  
    }
    else 
    {
      // not same address
  
      // chk amount
      if (target[VESTING_AMOUNT_UGUU] <= 0)
      {
        if (_TARGET_DISCORD_ID == "")
          return; // skip (no data)
        // error : amount 0
        Logger.log(ERROR_MSG[ERROR_CODE.amount_0] + ": discord id[%s], address[%s]", _TARGET_DISCORD_ID, _TARGET_ADDR);
        error_list.set(_TARGET_DISCORD_ID, getObject(target, ERROR_CODE.amount_0));
        return;
      }
  
      // add bank send list
      bank_send_list.set(_TARGET_ADDR, getObject(target, ERROR_CODE.none));
    }
  }
  function getObject(target, error_code){
    return {
      "error_code": error_code,
      "address": target[WALLET_ADDRESS],
      "amount": Math.floor(Number(target[VESTING_AMOUNT_UGUU])),
      "vesting_starts": !target[VESTING_STARTS] ? "" : Number((target[VESTING_STARTS].getTime() / 1000).toString()),
      "vesting_ends": !target[VESTING_ENDS] ? "" : Number((target[VESTING_ENDS].getTime() / 1000).toString()),
      "discord_id": target[DISCORD_ID]
    };
  }
  function getSameAddress(target_addr, obj_com_prog_records, obj_comp_records, obj_mode_records, obj_vali_records, obj_vc_records, obj_advisor_records){
    // same Community Program
    let records = [];
    
    if (obj_com_prog_records != null)
      records = obj_com_prog_records.filter((e) => e[WALLET_ADDRESS] === target_addr);
    
    // same Competition
    if (obj_comp_records != null)
      records = records.concat(obj_comp_records.filter((e) => e[WALLET_ADDRESS] === target_addr));
  
    // same Moderator
    if (obj_mode_records != null)
      records = records.concat(obj_mode_records.filter((e) => e[WALLET_ADDRESS] === target_addr));
  
    // same validators (!validators only!)
    if (obj_vali_records != null)
      records = records.concat(obj_vali_records.filter((e) => e[WALLET_ADDRESS] === target_addr));
  
    // same Existing VC of Japanese company
    if (obj_vc_records != null)
      records = records.concat(obj_vc_records.filter((e) => e[WALLET_ADDRESS] === target_addr));
  
    // same Advisor
    if (obj_advisor_records != null)
      records = records.concat(obj_advisor_records.filter((e) => e[WALLET_ADDRESS] === target_addr));
  
    return records;
  }
  
  
  function output_bank_send_list(bankSendListSheet, bank_send_list){
    bankSendListSheet.clear();
    range = bankSendListSheet.getRange(1,1,1,6); // a1:f1
    range.setValues([["toAddress", "amount", "denom", "vesting_starts", "vesting_ends", "discord id"]]);
  
    range = bankSendListSheet.getRange(2,1,bank_send_list.size,6); // a2:f
    map_list = [];
    bank_send_list.forEach((value) => map_list.push([
      value.address,
      value.amount,
      "uguu",
      value.vesting_starts,
      value.vesting_ends,
      value.discord_id
    ]));
    range.setValues(map_list);
  }
  function output_error_list(spreadsheet, error_list){
    let errorListSheet = spreadsheet.getSheetByName("error list");
    errorListSheet.clear();
    range = errorListSheet.getRange(1,1,1,6); // a1:f1
    range.setValues([["error code", "toAddress", "amount", "vesting_starts", "vesting_ends", "discord id"]]);
  
    if (error_list.size == 0)
     return; // skip (no error)
  
    range = errorListSheet.getRange(2,1,error_list.size,6); // a2:f
    // error code, discord id, address, amount, vesting starts, vesting ends
    let map_list = [];
    error_list.forEach((value) => map_list.push([
      value.error_code, 
      value.address,
      value.amount,
      value.vesting_starts,
      value.vesting_ends,
      value.discord_id
    ]));
    range.setValues(map_list);
  }
  function output_json(spreadsheet, validator_bank_send_list, lendvalidator_bank_send_list, eco_bank_send_list, vc_bank_send_list, advisor_bank_send_list){
    let jsonSheet = spreadsheet.getSheetByName("output json");
    jsonSheet.clear();
  
    // validator
    let jsonobj = { "validator": [] };
    range = jsonSheet.getRange(1,1); // a1
    range.setValue("validator");
    range = jsonSheet.getRange(1,2); // b1
    range.setValue(JSON.stringify(getJsonObj(jsonobj, "validator", validator_bank_send_list)));
  
    // lendvalidator
    jsonobj = { "lendValidator": [] };
    range = jsonSheet.getRange(2,1); // a2
    range.setValue("lendvalidator");
    range = jsonSheet.getRange(2,2); // b2
    range.setValue(JSON.stringify(getJsonObj(jsonobj, "lendValidator", lendvalidator_bank_send_list)));
  
    // Ecocsytem Development(Community Program, Competition, Moderator)
    jsonobj = { "ecocsytemDevelopment": [] };
    range = jsonSheet.getRange(3,1); // a3
    range.setValue("Ecocsytem Development");
    range = jsonSheet.getRange(3,2); // b3
    range.setValue(JSON.stringify(getJsonObj(jsonobj, "ecocsytemDevelopment", eco_bank_send_list)));
  
    // Marketing(Existing VC of Japanese company)
    jsonobj = { "marketing": [] };
    range = jsonSheet.getRange(4,1); // a4
    range.setValue("Marketing");
    range = jsonSheet.getRange(4,2); // b4
    range.setValue(JSON.stringify(getJsonObj(jsonobj, "marketing", vc_bank_send_list)));
  
    // advisors(Advisor)
    jsonobj = { "advisors": [] };
    range = jsonSheet.getRange(5,1); // a5
    range.setValue("advisors");
    range = jsonSheet.getRange(5,2); // b5
    range.setValue(JSON.stringify(getJsonObj(jsonobj, "advisors", advisor_bank_send_list)));
  }
  function getJsonObj(jsonobj, list_name, bank_send_list){
    bank_send_list.forEach((value) =>
      jsonobj[list_name].push({ 
        "toAddress"     : value.address,
        "amount"        : value.amount,
        "denom"         : "uguu",
        "vesting_starts": value.vesting_starts,
        "vesting_ends"  : value.vesting_ends
      })
    );
    return jsonobj
  }