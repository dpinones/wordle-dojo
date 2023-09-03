import { useEffect, Dispatch, SetStateAction } from 'react';
import { Flex } from '@chakra-ui/react';
import useWordle from '../../hooks/useWordle';
import Board from '../Board';
import Keypad from '../Keypad';
import GameOverScreen from '../GameOverScreen';

interface WordleProps {
  solution: string;
  setStreak: Dispatch<SetStateAction<number>>;
  setRound: Dispatch<SetStateAction<number>>;
}

const Wordle = ({ solution, setStreak, setRound }: WordleProps) => {
  const {
    currentGuess,
    handleKeyup,
    guesses,
    isCorrect,
    turn,
    keysColor,
    resetBoard,
    gameOverStatus,
    setGameOverStatus,
  } = useWordle(solution);

  useEffect(() => {
    window.addEventListener('keyup', handleKeyup);

    // remove event listener when the player make a correct guess
    if (isCorrect) {
      window.removeEventListener('keyup', handleKeyup);
      // wait until the tile flipping animation finish (1.3s)
      const setMessage = setTimeout(() => setGameOverStatus('win'), 1300);

      return () => clearTimeout(setMessage);
    }
    // remove event listener when the player is out of turn
    if (turn > 5) {
      window.removeEventListener('keyup', handleKeyup);
      const setMessage = setTimeout(() => setGameOverStatus('lose'), 1300);

      return () => clearTimeout(setMessage);
    }

    return () => window.removeEventListener('keyup', handleKeyup);
  }, [handleKeyup, isCorrect, turn, setGameOverStatus]);

  return (
    <Flex
      flexDir="column"
      height="100%"
      overflow={'hidden'}
      alignItems="center"
      justifyContent="space-evenly"
    >
      <Board currentGuess={currentGuess} guesses={guesses} turn={turn} />
      <Keypad key={solution} keysColor={keysColor} handleKeyup={handleKeyup} />
      {gameOverStatus && (
        <GameOverScreen
          gameOverStatus={gameOverStatus}
          solution={solution}
          resetBoard={resetBoard}
          setStreak={setStreak}
          setRound={setRound}
        />
      )}
    </Flex>
  );
};

export default Wordle;
