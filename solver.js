
const generateFrequencies = require('./generateFrequencies');
const fs = require('fs');
let letterFrequencies;

if (fs.existsSync('./frequency_table.txt')) {
  fs.readFile('frequency_table.txt', 'ascii', (err, data) => {
    letterFrequencies = new Map(JSON.parse(data));
  });
} else {
  console.log('Couldn\'t find frequency_table.txt.\nGenerating frequency_table.txt');
  fs.readFile('words.txt', 'ascii', (err, data) => {
    if (err) throw err;
    letterFrequencies = generateFrequencies.calculateFrequencies(data);
    fs.writeFile('frequency_table.txt', JSON.stringify(Array.from(letterFrequencies.entries()), null, 2), (err, written, string) => {
      if (err) throw err;
      console.log('Wrote frequency table to frequency_table.txt');
    });
  });
}