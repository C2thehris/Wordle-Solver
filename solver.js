const prompt = require('prompt-sync')({ sigint: true });
const fs = require('fs');
const frequencies = require('./frequencies');

const test = 1;

function scoreWord(word, letterFrequencies) {
  let score = 0.0;
  for (let i = 0; i < 26; i += 1) {
    const char = String.fromCharCode('a'.charCodeAt(0) + i);
    if (word.includes(char)) {
      score += letterFrequencies.get(char);
    }
  }
  return score;
}

function bestFromDict(dict, letterFrequencies) {
  let best = '';
  if (dict.length === 0) {
    throw 'No words in dict';
  }

  let bestScore = 0;
  dict.forEach((word) => {
    const score = scoreWord(word, letterFrequencies);
    if (score > bestScore) {
      best = word;
      bestScore = score;
    }
  });

  return best;
}

function allIndices(word, char) {
  let index = word.indexOf(char);
  const indices = [];
  while (index !== -1) {
    indices.push(index);
    index = word.indexOf(char, index + 1);
  }

  return indices;
}


function updateValid(dict, guess, colors) {
  let next = dict;
  const requiredFrequencies = new Map();
  for (let i = 0; i < 5; i += 1) {
    if (colors[i] === 'g') {
      next = next.filter((word) => word[i] === guess[i]);
      frequencies.incrementFrequency(requiredFrequencies, guess[i]);
    } else if (colors[i] === 'y') {
      next = next.filter((word) => word[i] !== guess[i] && word.indexOf(guess[i]) !== -1);
      frequencies.incrementFrequency(requiredFrequencies, guess[i]);
    }
  }

  for (let i = 0; i < 5; i += 1) {
    if (colors[i] === 'b') {
      const required = requiredFrequencies.has(guess[i]) ? requiredFrequencies.get(guess[i]) : 0;
      next = next.filter((word) => {
        return allIndices(word, guess[i]).length === required;
      });
    }
  }

  return next;
}

function diffStr(guess, answer) {
  if (guess === answer) {
    return 'ggggg';
  }

  let ret = ['b', 'b', 'b', 'b', 'b'];

  for (let i = 0; i < 5; i += 1) {
    if (guess[i] === answer[i]) {
      ret[i] = 'g';
    }
  }

  for (let i = 0; i < 5; i += 1) {
    if (ret[i] === 'g') continue;
    let index = answer.indexOf(guess[i]);
    while (index !== -1 && ret[index] === 'g') {
      index = answer.indexOf(guess[i], index + 1);
    }
    if (index !== -1) {
      ret[i] = 'y';
    }
  }

  return ret.join('');
}

function playGame(words) {
  let win = false;

  let dict = words;
  for (let i = 0; i < 6 && !win; i += 1) {
    const letterFrequencies = frequencies.calculateFrequencies(dict);
    const best = bestFromDict(dict, letterFrequencies);
    console.log(`Recommended Guess: ${best}`);
    const guess = prompt('What was your guess? ');
    const colors = prompt('What colors were shown? (Ex.) BYBBG: ').toLowerCase();
    console.log('\n');
    if (colors === 'ggggg') {
      win = true;
      console.log(`Yay! You win.\nRequired Guesses: ${i + 1}`);
    } else {
      dict = updateValid(dict, guess, colors);
    }
  }
  if (!win) {
    console.log('You lose :(\n (The bot is not yet perfect.)');
  }
  console.log('Play again tomorrow!');
}

function playAutomatic(dict, word) {
  let i = 0;
  let win = false;

  let valid = dict;
  for (i = 0; !win; i += 1) {
    const letterFrequencies = frequencies.calculateFrequencies(valid);
    const best = bestFromDict(valid, letterFrequencies);
    const colors = diffStr(best, word);

    if (colors === 'ggggg') {
      win = true;
    } else {
      valid = updateValid(valid, best, colors);
    }
  }

  return i;
}

function testWords(solutions, permitted) {
  const table = new Map();
  let total = 0;

  solutions.forEach((word) => {
    const requiredAttemps = playAutomatic(permitted, word);
    table.set(word, requiredAttemps);
    total += requiredAttemps;
  });

  console.log(`Average Guesses Required: ${total / solutions.length}`);
}

if (fs.existsSync('words.txt')) {
  fs.readFile('words.txt', 'ascii', (err1, data1) => {
    const solutions = data1.split('\n');
    if (test) {
      fs.readFile('allowed_words.txt', 'ascii', (err2, data2) => {
        const permitted = [...data2.split('\n'), ...solutions].sort();
        testWords(solutions, permitted);
      })
    } else {
      playGame(solutions);
    }
  });
} else {
  console.error('Couldn\'t find words.txt.\n');
  process.exit(1);
}
