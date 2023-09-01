import { useState, useEffect } from 'react';
import { Box } from '@chakra-ui/react';
import { getSolution } from '../../lib/getSolution';
import Wordle from '../Wordle';
import WinnerScreen from '../WinnerScreen';
import NavBar from '../NavBar';

const Main = () => {
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
  );
};

export default Main;
