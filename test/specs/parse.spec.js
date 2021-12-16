import fs from 'fs';
import expect from 'expect';
import xlsx from 'xlsx';
import {parse as parseXSLX} from '../../src';

describe('node-xlsx parser', () => {
  it('should throw if no input is given', () => {
    expect(() => parseXSLX()).toThrow();
  });
  it('should properly parse an XLSX buffer', () => {
    const expected = JSON.parse(fs.readFileSync(`${__dirname}/../fixtures/test.json`));
    const buffer = fs.readFileSync(`${__dirname}/../fixtures/test.xlsx`);
    const result = JSON.parse(JSON.stringify(parseXSLX(buffer)));
    expect(result).toEqual(expected);
  });
  it('should properly parse an XLSX file', () => {
    const expected = JSON.parse(fs.readFileSync(`${__dirname}/../fixtures/test.json`));
    const file = `${__dirname}/../fixtures/test.xlsx`;
    const result = JSON.parse(JSON.stringify(parseXSLX(file)));
    expect(result).toEqual(expected);
  });
  it('should properly parse an XLSX file with date field', () => {
    const expected = JSON.parse(fs.readFileSync(`${__dirname}/../fixtures/dateField.json`));
    const file = `${__dirname}/../fixtures/dateField.xlsx`;
    const result = JSON.parse(JSON.stringify(parseXSLX(file, {raw: false})));
    expect(result).toEqual(expected);
  });
  it('should properly parse an XLSX with a range option as a function', () => {
    const expected = JSON.parse(fs.readFileSync(`${__dirname}/../fixtures/withEmptyColumns.json`));
    const file = `${__dirname}/../fixtures/withEmptyColumns.xlsx`;
    const result = JSON.parse(
      JSON.stringify(
        parseXSLX(file, {
          raw: true,
          header: 1,
          range: function keepEmptyColumns(sheet) {
            if (sheet['!ref']) {
              const {s, e} = xlsx.utils.decode_range(sheet['!ref']);
              // starts at column #1
              s.c = 0;
              return xlsx.utils.encode_range(s, e);
            }
            return sheet['!ref'];
          },
        })
      )
    );
    expect(result).toEqual(expected);
  });
});
