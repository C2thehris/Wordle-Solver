const prompt = require('prompt-sync')({ sigint: true });
const frequencies = require('./frequencies');
const fs = require('fs');

function filterDict(dict, validChars) {
  let reString = `${validChars.join('')}`;
  let rexp = new RegExp(reString, 'g');

  return dict.join('\n').match(rexp);
}

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
  let bestScore = 0;
  dict.forEach((word) => {
    const score = scoreWord(word, letterFrequencies);
    if (score > bestScore) {
      best = word;
      bestScore = score;
    }
  })

  return best;
}

function removeInvalid(charSet, char) {
  let index = charSet.indexOf(char);
  let ret;
  if (index !== -1) {
    ret = charSet.substr(0, index).concat(charSet.substr(index + 1));
  } else {
    ret = charSet;
  }
  return ret;
}

function updateValid(validChars, guess, colors) {
  for (let i = 0; i < 5; i += 1) {
    switch (colors[i]) {
      case 'b':
        for (let j = 0; j < 5; j += 1) {
          validChars[j] = removeInvalid(validChars[j], guess[i]);
        }
        break;
      case 'g':
        validChars[i] = guess[i];
        break;
      case 'y':
        validChars[i] = removeInvalid(validChars[i], guess[i]);
        break;
      default:
        throw 'Unkown Color in Color string';
    }
  }
}

function playGame(words) {
  let win = false;
  const validChars = [];
  for (let i = 0; i < 5; i += 1) {
    validChars.push('[abcdefghijklmnopqrstuvwxyz]');
  }

  let dict = words;
  for (let i = 0; i < 6 && !win; i += 1) {
    dict = filterDict(dict, validChars);
    let letterFrequencies = frequencies.calculateFrequencies(dict);
    const best = bestFromDict(dict, letterFrequencies);
    console.log(`Recommended Guess: ${best}`);
    let guess = prompt('What was your guess? ');
    let colors = prompt('What colors were shown? (Ex.) BYBBG: ').toLowerCase();
    console.log('\n');
    if (colors === 'ggggg') {
      win = true;
      console.log(`Yay! You win.\nRequired Guesses: ${i + 1}`);
    } else {
      updateValid(validChars, guess, colors);
    }
  }
  if (!win) {
    console.log(`You lose :(\n The bot is not yet perfect.)`);
  }
  console.log('Play again tomorrow!');
}

if (fs.existsSync('words.txt')) {
  fs.readFile('words.txt', 'ascii', (err, data) => {
    playGame(data.split('\n'));
  })
} else {
  console.error('Couldn\'t find words.txt.\n');
  process.exit(1);
}