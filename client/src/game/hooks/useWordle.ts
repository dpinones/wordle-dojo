import { useState, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import { useDojo } from '../../DojoContext';
import { getComponent, toHexPrefixedString, getEpocDay, numberToLetter, letterToNumber, generateWord, generateNumber } from '../../utils';
import { set } from 'mobx';
import { sleep } from '@latticexyz/utils';


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

  //
  const [trigger, setTrigger] = useState(false);
  const [player, setPlayer] = useState({});
  const [epocDay, setEpocDay] = useState(getEpocDay());

  const {
    setup: {
      systemCalls: { add_word_system, guess },
      network: { graphSdk },
    },
    account: { create, list, select, account, isDeploying }
  } = useDojo();
  const entityId = account.address;

  const [formattedGuess, setFormattedGuess] = useState({});
  const [remainingTries, setRemainingTries] = useState(0);
  const [loadWord, setLoadWord] = useState(false);

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
    // setCurrentGuess('');
    // setGuesses(
    //   JSON.parse(localStorage.getItem('guesses') || 'null') ??
    //     Array(6).fill(undefined)
    // );
    // setHistory(JSON.parse(localStorage.getItem('history') || '[]'));
    // setKeysColor(JSON.parse(localStorage.getItem('keysColor') || '{}'));
    // setIsCorrect(JSON.parse(localStorage.getItem('isCorrect') || 'false'));
    if (!entityId) return;
    fetchData();
  }, []);

  const already_play_today = (player: any) => { 
    if (player == null || player.last_try == 0) {
      return false;
    } else if (getEpocDay() == player.last_try) {
      return true;
    } else {
      return false;
    }
  }

  const has_remaining_tries = () => { 
    return true
  }

  useEffect(() => {
    if (!entityId) return;
    fetchData();
  }, [trigger]);

  const fetchData = async () => {
    if (localStorage.getItem('load-word') == null) {
      localStorage.setItem('load-word', JSON.stringify(true));
      await add_word_system(account, generateNumber('stark'));
    }

    console.log('fetchData')
    const { data } = await graphSdk.getEntities();
    console.log('data', data)

    if (data && data.entities && data.entities.edges && data.entities.edges.length > 0) {
      let player = getComponent(data.entities?.edges, [entityId])
      if (already_play_today(player)) {
        let stats = getComponent(data.entities?.edges, [entityId, toHexPrefixedString(epocDay)])
        
        let remaining_tries = getComponent(data.entities?.edges, [entityId, toHexPrefixedString(epocDay)]).remaining_tries;
        const guesess: Array<Guess[]> = Array(6).fill(undefined);
        setRemainingTries(remaining_tries)

        for (let i = 0; i < 6 - remaining_tries; i++) {
          const playerWordAttemptI = getComponent(data.entities?.edges, [entityId, toHexPrefixedString(epocDay), toHexPrefixedString(i)])
          const sub_guess: Guess[] = [];  
          for(let j = 0; j < 5; j++) {
            let color = 'gray'
            switch (playerWordAttemptI.word_hits.toString()[j]) {
              case '3':
                color = 'green'
                break;
              case '2':
                color = 'yellow'
                break;
              default:
                color = 'gray'
            }
            let key = generateWord(playerWordAttemptI.word_attempt)[j];
            const props: Guess = {
              key,
              color,
            };
            sub_guess.push(props)
          }
          guesess[i] = sub_guess;
        } 
        setGuesses(guesess);
        setTurn(6 - remaining_tries);

        console.log("stats: ", stats)
        if (stats.won) {
          setGameOverStatus('win');
        } else if (stats.remaining_tries == 0) {
          setGameOverStatus('lose');
        }
      } else {
        setGuesses(Array(6).fill(undefined));
        setTurn(0);
      }
    }
  }

  async function callDojoGuess(word: string) {
    await guess(account, generateNumber(word));
    await sleep(1000);
    setTrigger(!trigger);
  }

  // Whenever the game states update, a backup of that state will be put in localStorage
  // This is used so that the player can always resume from where they left off if they leave the browser, refresh, etc.
  // This also prevent cheating. e.g: The user refresh the page on their last turn, so they get to start from the first turn again while keeping their streaks.

  // processGuess will map each character in a string into an array of object with this format
  // and add the formatted guess to the guesses state and also used letter
  // format: {key='letter', color='yellow'}
  const processGuess = async () => {
    // turn the solution string into array
    await callDojoGuess(currentGuess);

    // let solutionArray = [...solution];
    // format each letter, and set default color to gray
    // let formattedGuess: Guess[] = [...currentGuess].map((letter, i) => {
    //   // color check
    //   let color = 'gray'; // default color
    //   if (letter.toLowerCase() === solutionArray[i]) {
    //     color = 'green'; // letter in correct spot
    //   } else if (solutionArray.includes(letter.toLowerCase())) {
    //     color = 'yellow'; // letter is part of the word, but not in the correct spot
    //   }

    //   return {
    //     key: letter.toLowerCase(),
    //     color,
    //   };
    // });

    // add guess to history to prevent duplicate input
    setHistory((prev) => {
      const newHistory = [...prev, currentGuess];
      localStorage.setItem('history', JSON.stringify(newHistory));
      return newHistory;
    });

    // update guesses array with the formattedGuess
    // setGuesses((prev) => {
    //   let guessesArray = [...prev];
    //   guessesArray[turn] = formattedGuess;
    //   localStorage.setItem('guesses', JSON.stringify(guessesArray));
    //   return guessesArray;
    // });

    // update the keysColor state, so that   const [gameOverStatus, setGameOverStatus] = useState('');the color of the used key is reflected on the keypad
    // setKeysColor((prev) => {
    //   let newKeysColor = { ...prev };
    //   formattedGuess.forEach((letterObj) => {
    //     const currentKeyColor = newKeysColor[letterObj.key];

    //     // this checks prevent higher order color (if available) from being replaced. Color order: green > yellow > gray
    //     if (letterObj.color === 'green') {
    //       newKeysColor[letterObj.key] = 'green';
    //     } else if (
    //       letterObj.color === 'yellow' &&
    //       currentKeyColor !== 'green'
    //     ) {
    //       newKeysColor[letterObj.key] = 'yellow';
    //     } else if (
    //       letterObj.color === 'gray' &&
    //       currentKeyColor !== 'green' &&
    //       currentKeyColor !== 'gray'
    //     ) {
    //       newKeysColor[letterObj.key] = 'gray';
    //     }
    //   });
    //   localStorage.setItem('keysColor', JSON.stringify(newKeysColor));
    //   return newKeysColor;
    // });

    // add a turn
    setTurn((_) => {
      const newTurnValue = 6 - remainingTries;
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
