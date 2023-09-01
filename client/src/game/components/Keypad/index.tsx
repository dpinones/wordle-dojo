import { HStack, VStack } from '@chakra-ui/react';
import KeypadKey from '../KeypadKey';

interface KeypadProps {
  keysColor: {
    [key: string]: string;
  };
  handleKeyup: ({
    key,
  }:
    | KeyboardEvent
    | {
        key: string;
      }) => void;
}

const keypadLayout = [
  [
    { key: 'q' },
    { key: 'w' },
    { key: 'e' },
    { key: 'r' },
    { key: 't' },
    { key: 'y' },
    { key: 'u' },
    { key: 'i' },
    { key: 'o' },
    { key: 'p' },
  ],
  [
    { key: 'a' },
    { key: 's' },
    { key: 'd' },
    { key: 'f' },
    { key: 'g' },
    { key: 'h' },
    { key: 'j' },
    { key: 'k' },
    { key: 'l' },
  ],
  [
    { key: 'Enter' },
    { key: 'z' },
    { key: 'x' },
    { key: 'c' },
    { key: 'v' },
    { key: 'b' },
    { key: 'n' },
    { key: 'm' },
    { key: 'Backspace' },
  ],
];

const Keypad = ({ keysColor, handleKeyup }: KeypadProps) => {
  return (
    <VStack spacing={1}>
      {keypadLayout.map((row, index) => {
        return (
          <HStack key={index} spacing={1}>
            {row.map((letter) => {
              return (
                <KeypadKey
                  key={letter.key}
                  keysColor={keysColor}
                  letter={letter}
                  handleKeyup={handleKeyup}
                />
              );
            })}
          </HStack>
        );
      })}
    </VStack>
  );
};

export default Keypad;
