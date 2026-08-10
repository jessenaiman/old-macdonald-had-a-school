import fs from 'fs';
import XLSX from 'xlsx';

const excelPath = 'data/Early Years Action Song Research Corpus.xlsx';

console.log('=== EARLY YEARS ACTION SONG CORPUS ANALYSIS ===\n');
console.log(`Reading: ${excelPath}\n`);

try {
  const workbook = XLSX.readFile(excelPath);
  
  console.log(`Workbook contains ${workbook.SheetNames.length} sheet(s):`);
  workbook.SheetNames.forEach((name, i) => {
    console.log(`  ${i + 1}. ${name}`);
  });
  
  // Analyze each sheet
  for (const sheetName of workbook.SheetNames) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`SHEET: ${sheetName}`);
    console.log('='.repeat(60));
    
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    if (data.length === 0) {
      console.log('  (Empty sheet)');
      continue;
    }
    
    const headers = data[0];
    const rows = data.slice(1);
    
    console.log(`\nRows: ${rows.length}`);
    console.log(`Columns: ${headers.length}`);
    
    console.log('\nColumn Analysis:');
    console.log('-'.repeat(60));
    
    headers.forEach((header, colIndex) => {
      // Sample values from this column
      const sampleValues = rows
        .slice(0, 10)
        .map(row => row[colIndex])
        .filter(val => val !== undefined && val !== null && val !== '');
      
      const uniqueValues = [...new Set(rows.map(row => row[colIndex]))].filter(val => val !== undefined && val !== null);
      
      // Detect data type
      let dataType = 'unknown';
      if (sampleValues.length > 0) {
        const firstValue = sampleValues[0];
        if (typeof firstValue === 'number') {
          dataType = Number.isInteger(firstValue) ? 'integer' : 'float';
        } else if (typeof firstValue === 'string') {
          // Check if it looks like a date
          if (/^\d{4}-\d{2}-\d{2}/.test(firstValue) || /^\d{1,2}\/\d{1,2}\/\d{4}/.test(firstValue)) {
            dataType = 'date';
          } else if (firstValue.length > 100) {
            dataType = 'text (long)';
          } else {
            dataType = 'text';
          }
        }
      }
      
      // Check for nulls
      const nullCount = rows.filter(row => row[colIndex] === undefined || row[colIndex] === null || row[colIndex] === '').length;
      const nullPercent = Math.round((nullCount / rows.length) * 100);
      
      console.log(`\n  Column: "${header}"`);
      console.log(`    Type: ${dataType}`);
      console.log(`    Unique values: ${uniqueValues.length}`);
      console.log(`    Null/empty: ${nullCount}/${rows.length} (${nullPercent}%)`);
      
      if (sampleValues.length > 0) {
        console.log(`    Sample values:`);
        sampleValues.slice(0, 5).forEach(val => {
          const display = typeof val === 'string' && val.length > 60 ? val.substring(0, 60) + '...' : val;
          console.log(`      - ${display}`);
        });
      }
      
      // For columns with few unique values, show all options
      if (uniqueValues.length > 0 && uniqueValues.length <= 30) {
        console.log(`    All unique values:`);
        uniqueValues.forEach(val => {
          console.log(`      - ${val}`);
        });
      }
    });
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('ANALYSIS COMPLETE');
  console.log('='.repeat(60));
  
} catch (error) {
  console.error('Error reading Excel file:', error.message);
  console.error('\nMake sure the file exists and is a valid Excel file.');
  process.exit(1);
}
