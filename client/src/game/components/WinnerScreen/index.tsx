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
  Link,
} from '@chakra-ui/react';

interface WinnerScreenProps {
  quantity: number;
  setStreak: Dispatch<SetStateAction<number>>;
  setRound: Dispatch<SetStateAction<number>>;
}

// WinnerScreen is a modal that'll show up when the player actually beat the game
const WinnerScreen = ({ quantity, setStreak, setRound }: WinnerScreenProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Open the modal after render
  useEffect(() => {
    onOpen();
  });

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
        <ModalFooter display="flex" justifyContent="center">
          <Button
            onClick={() => {
              setStreak(0);
              setRound(0);
              onClose();
            }}
          >
            Reset Game
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default WinnerScreen;
