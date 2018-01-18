let alphabet = [
  "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m",
  "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"
];

let words = [
  [
    "the", "to", "and", "a", "I", "you", "it", "in", "said", "for", "up", "look",
    "is", "go", "we", "little", "down", "can", "see", "not", "one", "my", "me",
    "big", "come", "blue", "red", "where", "jump", "away", "here", "help", "make",
    "yellow", "two", "play", "run", "find", "three", "funny"
  ],
  [
    "he", "was", "that", "she", "on", "they", "but", "at", "with", "all", "there",
    "out", "be", "have", "am", "do", "did", "what", "so", "get", "like", "this",
    "will", "yes", "went", "are", "now", "no", "came", "ride", "into", "good",
    "want", "too", "pretty", "four", "saw", "well", "ran", "brown", "eat", "who",
    "new", "must", "black", "white", "soon", "our", "ate", "say", "under", "please"
  ],
  [
    "of", "his", "had", "him", "her", "some", "as", "then", "could", "when",
    "were", "them", "ask", "an", "over", "just", "from", "any", "how", "know",
    "put", "take", "every", "old", "by", "after", "think", "let", "going", "walk",
    "again", "may", "stop", "fly", "round", "give", "once", "open", "has", "live",
    "thank"
  ],
  [
    "would", "very", "your", "its", "around", "don't", "right", "green", "their",
    "call", "sleep", "five", "wash", "or", "before", "been", "off", "cold",
    "tell", "work", "first", "does", "goes", "write", "always", "made", "gave",
    "us", "buy", "those", "use", "fast", "pull", "both", "sit", "which", "read",
    "why", "found", "because", "best", "upon", "these", "sing", "wish", "many"
  ],
  [
    "if", "long", "about", "got", "six", "never", "seven", "eight", "today",
    "myself", "much", "keep", "try", "start", "ten", "bring", "drink", "only",
    "better", "hold", "warm", "full", "done", "light", "pick", "hurt", "cut",
    "kind", "fall", "carry", "small", "own", "show", "hot", "far", "draw",
    "clean", "grow", "together", "shall", "laugh"
  ]
];


let SightWord = (function() {
  'use strict';

  let settings,
      gameParam,
      dictionary;

  /**
   **  Private Functions
   **/

  function flattenWords(words) {
    return words.reduce((a, b) => { return a.concat(b) }, []);;
  }

  function pushDictionary(dict, items) {
    for (var i = 0; i < items.length; i++) {
      dict[items[i]] = {entry: items[i]};
    }
  }

  function randomWord() {
    return dictionary[settings.flatWords[randomValue(0, settings.flatWords.length)]];
  }

  function randomValue(min, max) {
    return Math.floor(Math.random()*(max-min+1)+min);
  }

  function startKeyboardListener() {
    document.addEventListener("keypress", (e) => {
      console.log(">" + e.key + " was pressed!")

      guessLetter(e.key);
    });

    return true;
  }

  function startWordClickListener() {
    let elem = document.getElementById(settings.ids.word);

    elem.addEventListener("click", (e) => {
      speakWord(elem.textContent);
    });

    return true;
  }

  function guessLetter(letter) {
    if (!gameParam.roundFinished && letter.toLowerCase() === gameParam.roundWord[gameParam.roundWordIndex].toLowerCase()) {
      speakWord(letter);

      gameParam.roundGuess = gameParam.roundGuess.substr(0,gameParam.roundWordIndex) +
                             gameParam.roundWord[gameParam.roundWordIndex] +
                             gameParam.roundGuess.substr(gameParam.roundWordIndex + 1);

      document.getElementById(settings.ids.guess).textContent = gameParam.roundGuess;

      gameParam.roundWordIndex += 1;

      if (gameParam.roundWordIndex >= gameParam.roundWord.length) {
        winRound();
      }
    }
  }

  function winRound() {
    gameParam.roundFinished = true;

    setTimeout(function () {
      if (gameParam.round == gameParam.wordsPerRound) {
        winGame();
      } else {
        newRound();
      }
    }, 3000);
  }

  function winGame() {
    alert("You won!");

    newGame();
  }

  /**
   **  Public Functions
   **/

  function init(initialSettings) {
    //catching bad input data
    initialSettings = initialSettings || {};
    settings = initialSettings;

    //default flags
    settings.initSuccess = true;

    //default word libraries
    settings.alphabet = settings.alphabet || [];
    settings.words = settings.words || [];
    settings.flatWords = flattenWords(settings.words);

    //default synth
    settings.synth = settings.synth || window.speechSynthesis;

    //default element ids
    settings.ids = settings.ids || {};
    settings.ids.word = settings.ids.word || "word"
    settings.ids.guess = settings.ids.guess || "guess"

    //default game parameters
    gameParam = gameParam || {};
    gameParam.wordsPerRound = gameParam.wordsPerRound || 10;
    //default game parameters
    gameParam.gameFinished = true;
    gameParam.round = 0;
    gameParam.roundFinished = true;
    gameParam.roundWord = "";
    gameParam.roundGuess = "";
    gameParam.roundWordIndex = 0;

    //make the dictionary
    dictionary = {};
    pushDictionary(dictionary, settings.alphabet);
    pushDictionary(dictionary, settings.flatWords);

    //start the listeners
    startKeyboardListener();
    startWordClickListener();

    if (settings.initSuccess) {
      newGame();
    } else {
      console.log("Sight Words Initialization Failed.");
    }
  }

  function newGame() {
    gameParam.gameFinished = false;
    gameParam.round = 0;

    newRound();
  }

  function newRound() {
    gameParam.round += 1;
    gameParam.roundFinished = false;
    gameParam.roundWord = randomWord().entry;
    gameParam.roundGuess = gameParam.roundWord.replace(/./g, "_");
    gameParam.roundWordIndex = 0;

    document.getElementById(settings.ids.word).innerText = gameParam.roundWord;
    document.getElementById(settings.ids.guess).innerText = gameParam.roundGuess;

    let stmt = `Can you spell the word, ${gameParam.roundWord}?`,
        utt = new SpeechSynthesisUtterance(stmt);

    settings.synth.cancel();
    settings.synth.speak(utt);
  }

  function getWords() {
    return settings.words;
  }

  function getDictionary() {
    return dictionary;
  }

  function getAlphabet() {
    return settings.alphabet;
  }

  function speakWord(word) {
    let entry = dictionary[word].entry,
        utt = new SpeechSynthesisUtterance(entry);

    utt.onend = function(e) {
      console.log(">>" + e.utterance.text + " utterance done");
    };

    settings.synth.cancel();
    settings.synth.speak(utt);
  }

  /**
  **  Expose Public Functions
  **/

  return {
    init, newGame,
    getWords, getAlphabet, getDictionary,
    speakWord
  };
}());

SightWord.init({alphabet, words});
