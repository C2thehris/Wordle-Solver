function populateTable(map) {
  for (let i = 0; i < 26; i += 1) {
    map.set(String.fromCharCode('a'.charCodeAt(0) + i), 0);
  }
}

function assertTotal(frequency_table) {
  total = 0.0;
  frequency_table.forEach((value, key) => {
    total += value;
  });
  console.assert(total === 1.0);
}

function calculateFrequencies(words) {
  let total = 0;
  const frequency_table = new Map();
  populateTable(frequency_table);
  words.forEach((word) => {
    total += word.length;
    word.split('').forEach((char) => {
      frequency_table.set(char, frequency_table.get(char) + 1);
    });
  });
  frequency_table.forEach((value, key, map) => {
    map.set(key, value / total);
  });

  return frequency_table;
}

exports.calculateFrequencies = calculateFrequencies;