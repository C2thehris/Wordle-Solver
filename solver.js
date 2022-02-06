const prompt = require('prompt-sync')({ sigint: true });
const frequencies = require('./frequencies');
const fs = require('fs');

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
  })

  return best;
}

function updateValid(dict, guess, colors) {
  let next = dict;
  for (let i = 0; i < 5; i += 1) {
    switch (colors[i]) {
      case 'b':
        next = next.filter((word) => (word.indexOf(guess[i]) == -1));
        break;
      case 'g':
        next = next.filter((word) => word.indexOf(guess[i]) !== -1);
        break;
      case 'y':
        next = next.filter((word) => {
          let pos = word.indexOf(guess[i]);
          return pos !== i && pos !== -1;
        });
        break;
      default:
        throw 'Unkown Color in Color string';
    }
  }

  return next;
}

function playGame(words) {
  let win = false;

  let dict = words;
  for (let i = 0; i < 6 && !win; i += 1) {
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
      dict = updateValid(dict, guess, colors);
    }
  }
  if (!win) {
    console.log(`You lose :(\n (The bot is not yet perfect.)`);
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