import Airtable from 'airtable';
require('dotenv').config();
// import { API_KEY, BASE_ID, TIMEOUT_SEC } from "../config.js";
import { timeout } from './helper';
// import { loggedIn } from "../user";
// var base = new Airtable({
//   apiKey: process.env.AIR_API_KEY,
// }).base(process.env.AIR_BASE_ID);
// var base = new Airtable({
//   apiKey: process.env.AIR_API_KEY,
// }).base(process.env.AIR_BASE_ID);
var base = new Airtable({
  apiKey: process.env.AIR_API_KEY,
}).base(process.env.AIR_BASE_ID);

let table = base('Programs');

const airExport = (function () {
  // FUNCTIONS
  const listRecords = async () => {
    try {
      const records = await Promise.race([table.select().firstPage(), timeout(10)]);
      return records.map((rec) => recordData(rec));
    } catch (err) {
      console.error(`💥💥 ${err}`);
      throw err;
    }
  };
  const setTableName = (tableName) => {
    table = base(tableName);
  };

  const getRecordById = async (id) => {
    try {
      const record = await table.find(id);
      // console.log(recordData(record));
      return recordData(record);
    } catch (err) {
      console.error(`💥💥 ${err}`);
      throw err;
    }
  };
  const getItemValue = async (id, key) => {
    try {
      const recData = recordData(await getRecordById(id));
      return recData.fields[key];
    } catch (err) {
      console.error(`💥💥 ${err}`);
      throw err;
    }
  };
  // fields needs to be an object
  const createRecord = async (fields) => {
    try {
      // console.log(fields);
      const createdRecord = await table.create(fields);
      // console.log(recordData(createdRecord));
    } catch (err) {
      console.error(`💥💥 ${err}`);
      throw err;
    }
  };
  const updateRecord = async (id, fields) => {
    try {
      const updateRecord = await table.update(id, fields);
      console.log(`Record (${id}) Updated: {${fields}}`);
    } catch (err) {
      console.error(`💥💥 ${err}`);
      throw err;
    }
  };
  const recordData = (record) => {
    return {
      id: record.id,
      fields: record.fields,
    };
  };
  const deleteRecord = async (id) => {
    try {
      const deletedRecord = await table.destroy(id);
      // console.log(`Deleted: ${recordData(deleteRecord)}`);
    } catch (err) {
      console.error(`💥💥 ${err}`);
      throw err;
    }
  };
  const sortRecordList = async (field, direction) => {
    try {
      const records = await table
        .select({
          sort: [{ field: field, direction: direction }],
        })
        .firstPage();
      return records.map((rec) => recordData(rec));
    } catch (err) {
      console.error(`💥💥 ${err}`);
      throw err;
    }
  };
  const filterRecords = async (filter) => {
    try {
      const records = await table
        .select({
          filterByFormula: filter,
        })
        .firstPage();
      const item = records.map((rec) => recordData(rec));
      return item;
    } catch (err) {
      console.error(`💥💥 ${err}`);
      throw err;
    }
  };
  const searchArray = (search, arrField) => `FIND('${search}', ARRAYJOIN(${arrField}))`;

  // EXPORT for External user
  return {
    listRecords,
    getItemValue,
    setTableName,
    getRecordById,
    createRecord,
    updateRecord,
    deleteRecord,
    recordData,
    sortRecordList,
    searchArray,
    filterRecords,
  };
})();

export { airExport };
// console.log(airExport.listRecords());
// listRecords();
// getRecordById("rec8FhDBJaXfFLzyf");
// createRecord({
//   username: "jamie1231",
//   password: "test",
//   location: "carter",
//   head: "fork",
//   Leaders: ["recJQt3I9flNcR3pn"],
//   Students: ["recSNlZ5pOv471Lwc"],
//   Vans: ["recq4ZDtMVPVJkADf"],
// });

// updateRecord("reccK6AYN5fXFlDhk", {
//   password: "JamesandJesus",
//   username: "JJ",
// });

// updateRecord(`reccK6AYN5f434k`, { head: "Anika" });
//filterRecords(searchArray("Katia", "Leaders"));
// airExport.filterRecords(airExport.searchArray("tesMis2024", "username"));
