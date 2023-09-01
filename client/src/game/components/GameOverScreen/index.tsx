import { Dispatch, SetStateAction, useEffect } from 'react';
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  useDisclosure,
  Text,
} from '@chakra-ui/react';

interface GameOverScreenProps {
  gameOverStatus: string;
  solution: string;
  resetBoard: () => void;
  setStreak: Dispatch<SetStateAction<number>>;
  setRound: Dispatch<SetStateAction<number>>;
}

const GameOverScreen = ({
  gameOverStatus,
  solution,
  resetBoard,
  setStreak,
  setRound,
}: GameOverScreenProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Open the modal after render
  useEffect(() => {
    if (gameOverStatus) {
      onOpen();
    }
  }, [gameOverStatus, onOpen]);

  const winGame = () => {
    // remove solution from solutionsList in localStorage
    const solutionsList: string[] = JSON.parse(
      localStorage.getItem('solutionsList') || '[]'
    );
    const newSolutionsList = solutionsList.filter((word) => word != solution);
    localStorage.setItem('solutionsList', JSON.stringify(newSolutionsList));

    resetBoard();
    setStreak((prev) => prev + 1);
    setRound((prev) => prev + 1);
    onClose();
  };

  const loseGame = () => {
    // reset the solutionsList in LocalStorage
    localStorage.removeItem('solutionsList');

    resetBoard();
    setStreak(0);
    setRound((prev) => prev + 1);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeOnOverlayClick={false}
      closeOnEsc={false}
      isCentered
      motionPreset="slideInBottom"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center">Game Over</ModalHeader>
        <ModalBody textAlign="center">
          <Text>
            {gameOverStatus === 'win'
              ? 'Nice! Keep up the streaks 👍'
              : 'Too bad! Better luck next time 😊'}
          </Text>
          {gameOverStatus === 'lose' && (
            <Text>{`The Wordle you missed is "${solution}"`}</Text>
          )}
        </ModalBody>
        <ModalFooter justifyContent="center">
          {gameOverStatus === 'win' ? (
            <Button onClick={winGame}>Next Round</Button>
          ) : (
            <Button onClick={loseGame}>Reset Game</Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default GameOverScreen;
