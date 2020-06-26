import csvParse from 'csv-parse';
import fs from 'fs';
import path from 'path';

interface LineTransaction {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

async function loadTransactionsCSV(fileName: string): Promise<LineTransaction[]> {
  const csvFilePath = path.resolve(__dirname, '..', '..', 'tmp', fileName);

  const readCSVStream = fs.createReadStream(csvFilePath);

  const parseStream = csvParse({
    from_line: 2,
    ltrim: true,
    rtrim: true,
  });

  const parseCSV = readCSVStream.pipe(parseStream);

  const lines = <LineTransaction[]>[];

  parseCSV.on('data', line => {
    const transaction = {
      title: line[0],
      type: line[1],
      value: line[2],
      category: line[3],
    }
    lines.push(transaction);
  });

  await new Promise(resolve => {
    parseCSV.on('end', resolve);
  });

  return lines;
}

export default loadTransactionsCSV;
