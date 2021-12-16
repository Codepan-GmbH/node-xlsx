import XLSX from 'xlsx';
import bufferFrom from 'buffer-from';
import {buildSheetFromMatrix, isString} from './helpers';
import Workbook from './workbook';

const getRangeFromOptions = (options, name, sheet) => {
  let range = null;
  if (options.range) {
    range = typeof options.range === 'object' ? options.range[name] : options.range;
    if (typeof range === 'function') {
      range = range(sheet);
    }
  }
  return range;
};

export const parse = (mixed, options = {}) => {
  const workSheet = XLSX[isString(mixed) ? 'readFile' : 'read'](mixed, options);
  return Object.keys(workSheet.Sheets).map((name) => {
    const sheet = workSheet.Sheets[name];
    const range = getRangeFromOptions(options, name, sheet);
    return {name, data: XLSX.utils.sheet_to_json(sheet, {header: 1, raw: options.raw !== false, range})};
  });
};

export const parseMetadata = (mixed, options = {}) => {
  const workSheet = XLSX[isString(mixed) ? 'readFile' : 'read'](mixed, options);
  return Object.keys(workSheet.Sheets).map((name) => {
    const sheet = workSheet.Sheets[name];
    return {name, data: sheet['!ref'] ? XLSX.utils.decode_range(sheet['!ref']) : null};
  });
};

export const build = (worksheets, options = {}) => {
  const defaults = {
    bookType: 'xlsx',
    bookSST: false,
    type: 'binary',
  };
  const workBook = new Workbook();
  worksheets.forEach((worksheet) => {
    const sheetName = worksheet.name || 'Sheet';
    const sheetOptions = worksheet.options || {};
    const sheetData = buildSheetFromMatrix(worksheet.data || [], {...options, ...sheetOptions});
    workBook.SheetNames.push(sheetName);
    workBook.Sheets[sheetName] = sheetData;
  });
  const excelData = XLSX.write(workBook, {...defaults, ...options});
  return excelData instanceof Buffer ? excelData : bufferFrom(excelData, 'binary');
};

export default {parse, parseMetadata, build};
