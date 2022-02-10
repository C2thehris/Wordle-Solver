function populateTable(map) {
  for (let i = 0; i < 26; i += 1) {
    map.set(String.fromCharCode('a'.charCodeAt(0) + i), 0);
  }
}

function incrementFrequency(frequencies, char) {
  if (frequencies.has(char)) {
    frequencies.set(char, frequencies.get(char) + 1);
  } else {
    frequencies.set(char, 1);
  }
}

function wordFrequencies(word) {
  const frequencies = new Map();

  word.split().forEach((char) => {
    if (frequencies.has(char)) {
      frequencies.set(char, frequencies.get(char) + 1);
    } else {
      frequencies.set(char, 1);
    }
  });

  return frequencies;
}

function calculateFrequencies(words) {
  let total = 0;
  const frequencyTable = new Map();
  populateTable(frequencyTable);
  words.forEach((word) => {
    total += word.length;
    word.split('').forEach((char) => {
      frequencyTable.set(char, frequencyTable.get(char) + 1);
    });
  });
  frequencyTable.forEach((value, key, map) => {
    map.set(key, value / total);
  });

  return frequencyTable;
}

exports.calculateFrequencies = calculateFrequencies;
exports.wordFrequencies = wordFrequencies;
exports.incrementFrequency = incrementFrequency;