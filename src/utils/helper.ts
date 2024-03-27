//IMPORTS
import { airExport } from './airExport';
// Contains Functions that are reused over and over
export const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} seconds`));
    }, s * 1000);
  });
};
export const waitTimer = function (s, func, parameters = []) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      if (parameters.length > 0 && func) {
        func(...parameters);
      } else if (func) {
        func();
        resolve();
      }
      resolve(); // Resolve after the timeout
    }, s * 1000);
  });
};
export const getLocal = (key) => {
  try {
    const storedData = localStorage.CanvassAppAuto;
    if (!storedData) return null; // Handle case when localStorage is empty

    const locData = JSON.parse(storedData);
    if (!locData || typeof locData.lastLoggedInUser !== 'object') return null; // Handle invalid or missing data

    return locData.lastLoggedInUser[key];
  } catch (error) {
    console.error(`Error parsing local storage data: ${error}`);
    return null;
  }
};
export const getFormData = (e) => {
  const finalData = {};
  const data = new FormData(e.target);
  // Iterate through form elements

  data.forEach((value, key) => {
    finalData[key] = value;
  });
  return finalData;
};
export const getItem = async (id, key, table) => {
  try {
    airExport.setTableName(table);
    const value = await airExport.getItemValue(id, key);
  } catch (err) {
    console.error(`💥💥 ${err}`);
    throw err;
  }
};
