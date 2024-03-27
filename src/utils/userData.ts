import { airExport } from './airExport';

export const retrieveData = async (table, user) => {
  //USER
  airExport.setTableName(table);
  let [userData] = await airExport.filterRecords(`{userEmail} = '${user}'`);
  //PAYMENT RECORDS
  airExport.setTableName('payments');
  let payments = await airExport.filterRecords(`{user} = '${user}'`);
  let payData = payments.map((row) => row.fields);
  payData.sort((a, b) => {
    if (a.Date && b.Date) {
      return new Date(b.Date) - new Date(a.Date);
    } else if (a.Date) {
      return -1;
    } else if (b.Date) {
      return 1;
    } else {
      return 0;
    }
  });
  const rented = payData.filter((rec) => {
    const exist = rec.renting;
    if (exist) return rec;
  });
  const charge = payData.filter((rec) => {
    const exist = rec.renting;
    if (!exist) return rec;
  });
  //COURSES
  airExport.setTableName('courses');
  let courses = (await airExport.filterRecords(`{oocUser} = '${user}'`)).map((row) => row.fields);
  //CLUBS
  airExport.setTableName('clubs');
  let clubs = (await airExport.filterRecords(`{oocUser} = '${user}'`)).map((row) => row.fields);
  const data = {
    userData,
    payments: {
      rented,
      charge,
    },
    courses,
    clubs,
  };
  console.log(data);
  return data;
};

// let table = context.param.table
// let arData = await;
// const lib = require("lib")({ token: process.env.STDLIB_SECRET_TOKEN });

// let arData = await lib.airtable.query["@1.0.0"].select({
//   baseId: process.env.baseID,
//   table: table,
//   where: [
//     {
//       userEmail: `${user}`,
//     },
//   ],
//   limit: {
//     count: 0,
//     offset: 0,
//   },
// });
// let [userData] = arData.rows.map((row) => row.fields);
// let payments = await lib.airtable.query["@1.0.0"].select({
//   baseId: process.env.baseID,
//   table: `payments`,
//   where: [
//     {
//       user: `${user}`,
//     },
//   ],
//   limit: {
//     count: 0,
//     offset: 0,
//   },
// });
// let payData = payments.rows.map((row) => row.fields);
// // Sort the data array by the Date property
//
//
// return data;
// //console.log(table);
