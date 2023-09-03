import '@fontsource/fascinate-inline';
import '@fontsource/clear-sans';
import '@fontsource/clear-sans/700.css';
import './App.css';

import { useDojo } from './DojoContext';
import { getComponent, toHexPrefixedString, getEpocDay, numberToLetter, letterToNumber, generateWord, generateNumber } from './utils';
import { Moves, Position, Player, PlayerStatsByDay, PlayerWordAttempts } from './generated/graphql';

import { ChakraProvider } from '@chakra-ui/react';
import theme from './theme';
import { useState, useEffect } from 'react';
import { Box } from '@chakra-ui/react';
import { getSolution } from './lib/getSolution';
import Wordle from './game/components/Wordle';
import WinnerScreen from './game/components/WinnerScreen';
import NavBar from './game/components/NavBar';
import DojoWordleImage from '../public/dojo-wordle.png';

function App() {

  const [trigger, setTrigger] = useState(false);
  const [player, setPlayer] = useState<Player>({});
  const [word, setWord] = useState('');
  const [stats, setStats] = useState<PlayerStatsByDay>({});
  const [history, setHistory] = useState<Array<String>>([]);

  const [epocDay, setEpocDay] = useState(getEpocDay());

  
  const {
    setup: {
      systemCalls: { add_word_system, guess },
      network: { graphSdk, call }
    },
    account: { create, list, select, account, isDeploying }
  } = useDojo();

  const [solution, setSolution] = useState({ word: '', quantity: 0 });
  const [streak, setStreak] = useState(0);
  const [round, setRound] = useState(0);

  useEffect(() => {
    setStreak(getSolution().streak);
  }, []);

  useEffect(() => {
    const solution = getSolution();
    setSolution({ word: solution.word, quantity: solution.quantity });
  }, [round]);

  return (
    <>
    <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '40vh',
          }}
    >
      <img src={DojoWordleImage} width={'80%'} />  
    </div>
      <ChakraProvider theme={theme}>
        <Box as="main">
          <NavBar streak={streak} quantity={solution.quantity} />
          <Box height="calc(100vh - 10vh)">
            {solution && (
              <Wordle
                solution={solution.word}
                setStreak={setStreak}
                setRound={setRound}
              />
            )}
            {streak === solution.quantity && (
              <WinnerScreen
                quantity={solution.quantity}
                setStreak={setStreak}
                setRound={setRound}
              />
            )}
          </Box>
        </Box>
      </ChakraProvider>
    </>
  );
}

export default App;
