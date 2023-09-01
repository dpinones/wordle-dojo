import { useState, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';

interface Guess {
  key: string;
  color: string;
}

// useWordle is the main logic of the game
const useWordle = (solution: string) => {
  let defaultTurn = 0;
  let defaultCurrentGuess: string | null = null;
  let defaultGuesses: Array<Guess[]> | null = null;
  let defaultHistory: Array<string> = [];
  let defaultKeysColor = {};
  let defaultIsCorrect = false;

  const [turn, setTurn] = useState(defaultTurn);
  const [currentGuess, setCurrentGuess] = useState(defaultCurrentGuess ?? ''); // track what the user is currently typing
  const [guesses, setGuesses] = useState<Array<Guess[]>>(
    defaultGuesses ?? Array(6).fill(undefined)
  ); // 6 array of formatted Guess, empty by default
  const [history, setHistory] = useState<string[]>(defaultHistory); // history of guesses to prevent the user from submitting duplicates
  const [keysColor, setKeysColor] = useState<{ [key: string]: string }>(
    defaultKeysColor
  ); // {a: 'green', b: 'gray', ...}
  const [isCorrect, setIsCorrect] = useState(defaultIsCorrect);
  const [gameOverStatus, setGameOverStatus] = useState(''); // can be "win", "lose", "". When it got a value, the GameOverScreen will be rendered
  const toast = useToast(); // used to display a toast when user give an invalid input

  // Try to get default from localStorage in case the player have any state saved before
  useEffect(() => {
    setTurn(JSON.parse(localStorage.getItem('turn') || '0'));
    setCurrentGuess(
      JSON.parse(localStorage.getItem('currentGuess') || 'null') ?? ''
    );
    setGuesses(
      JSON.parse(localStorage.getItem('guesses') || 'null') ??
        Array(6).fill(undefined)
    );
    setHistory(JSON.parse(localStorage.getItem('history') || '[]'));
    setKeysColor(JSON.parse(localStorage.getItem('keysColor') || '{}'));
    setIsCorrect(JSON.parse(localStorage.getItem('isCorrect') || 'false'));
  }, []);

  // Whenever the game states update, a backup of that state will be put in localStorage
  // This is used so that the player can always resume from where they left off if they leave the browser, refresh, etc.
  // This also prevent cheating. e.g: The user refresh the page on their last turn, so they get to start from the first turn again while keeping their streaks.

  // processGuess will map each character in a string into an array of object with this format
  // and add the formatted guess to the guesses state and also used letter
  // format: {key='letter', color='yellow'}
  const processGuess = () => {
    // turn the solution string into array
    let solutionArray = [...solution];
    // format each letter, and set default color to gray
    let formattedGuess: Guess[] = [...currentGuess].map((letter, i) => {
      // color check
      let color = 'gray'; // default color
      if (letter.toLowerCase() === solutionArray[i]) {
        color = 'green'; // letter in correct spot
      } else if (solutionArray.includes(letter.toLowerCase())) {
        color = 'yellow'; // letter is part of the word, but not in the correct spot
      }

      return {
        key: letter.toLowerCase(),
        color,
      };
    });

    // add guess to history to prevent duplicate input
    setHistory((prev) => {
      const newHistory = [...prev, currentGuess];
      localStorage.setItem('history', JSON.stringify(newHistory));
      return newHistory;
    });

    // update guesses array with the formattedGuess
    setGuesses((prev) => {
      let guessesArray = [...prev];
      guessesArray[turn] = formattedGuess;
      localStorage.setItem('guesses', JSON.stringify(guessesArray));
      return guessesArray;
    });

    // update the keysColor state, so that   const [gameOverStatus, setGameOverStatus] = useState('');the color of the used key is reflected on the keypad
    setKeysColor((prev) => {
      let newKeysColor = { ...prev };
      formattedGuess.forEach((letterObj) => {
        const currentKeyColor = newKeysColor[letterObj.key];

        // this checks prevent higher order color (if available) from being replaced. Color order: green > yellow > gray
        if (letterObj.color === 'green') {
          newKeysColor[letterObj.key] = 'green';
        } else if (
          letterObj.color === 'yellow' &&
          currentKeyColor !== 'green'
        ) {
          newKeysColor[letterObj.key] = 'yellow';
        } else if (
          letterObj.color === 'gray' &&
          currentKeyColor !== 'green' &&
          currentKeyColor !== 'gray'
        ) {
          newKeysColor[letterObj.key] = 'gray';
        }
      });
      localStorage.setItem('keysColor', JSON.stringify(newKeysColor));
      return newKeysColor;
    });

    // add a turn
    setTurn((prev) => {
      const newTurnValue = prev + 1;
      localStorage.setItem('turn', JSON.stringify(newTurnValue));
      return newTurnValue;
    });
  };

  // finalizeTurn checks if the guess is correct, and reset some states
  const finalizeTurn = () => {
    if (currentGuess === solution) {
      setIsCorrect(true);
      localStorage.setItem('isCorrect', JSON.stringify(true));
    }

    // reset currentGuess
    setCurrentGuess('');
    localStorage.setItem('currentGuess', JSON.stringify(''));
  };

  // handleKeyup handles keyboard event
  const handleKeyup = ({ key }: KeyboardEvent | { key: string }) => {
    if (/^[a-zA-Z]$/.test(key) && currentGuess.length < 5) {
      // on Alphabet key press, add a letter when guess length < 5
      setCurrentGuess((prev) => {
        const newCurrentGuess = prev + key;
        localStorage.setItem('currentGuess', JSON.stringify(newCurrentGuess));
        return newCurrentGuess;
      });
    } else if (key === 'Backspace') {
      // on Backspace key press, remove the last letter
      setCurrentGuess((prev) => {
        const newCurrentGuess = prev.slice(0, -1);
        localStorage.setItem('currentGuess', JSON.stringify(newCurrentGuess));
        return newCurrentGuess;
      });
    } else if (key === 'Enter') {
      // on Enter key press, call addNewGuess
      // condition: not a duplicate word, word length = 5
      if (history.includes(currentGuess)) {
        toast({
          title: "You've tried that before.",
          status: 'error',
          position: 'top',
          duration: 2000,
        });
        return;
      }
      if (currentGuess.length !== 5) {
        toast({
          title: 'A Wordle is 5 characters long.',
          status: 'warning',
          position: 'top',
          duration: 2000,
        });
        return;
      }
      // give a kind reminder to the player
      if (turn === 4 && currentGuess !== solution) {
        toast({
          title: 'Last try, think carefully!',
          status: 'info',
          position: 'top',
          duration: 2000,
        });
      }

      processGuess();
      finalizeTurn();
    }
  };

  // resetBoard reset every state to its default
  const resetBoard = () => {
    setTurn(0);
    setCurrentGuess('');
    setGuesses(Array(6).fill(undefined));
    setHistory([]);
    setKeysColor({});
    setIsCorrect(false);
    setGameOverStatus('');
    localStorage.setItem('turn', JSON.stringify(0));
    localStorage.setItem('currentGuess', JSON.stringify(null));
    localStorage.setItem('guesses', JSON.stringify(null));
    localStorage.setItem('history', JSON.stringify([]));
    localStorage.setItem('keysColor', JSON.stringify({}));
    localStorage.setItem('isCorrect', JSON.stringify(false));
    localStorage.removeItem('randint');
  };

  return {
    turn,
    currentGuess,
    guesses,
    keysColor,
    isCorrect,
    handleKeyup,
    resetBoard,
    gameOverStatus,
    setGameOverStatus,
  };
};

export default useWordle;
