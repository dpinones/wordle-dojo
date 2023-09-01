import { HStack, VStack } from '@chakra-ui/react';
import { Tile, EmptyTile } from '../Tile';

interface LetterObj {
  key: string;
  color: string;
}

interface BoardProps {
  currentGuess: string;
  guesses: Array<LetterObj[]>;
  turn: number;
}

interface RowProps {
  guess?: LetterObj[] | undefined | null;
  currentGuess?: string;
}

const Row = ({ guess, currentGuess }: RowProps) => {
  if (guess === null) guess = undefined; // this is needed because the data may come from localStorage which can't store undefined, so we convert it to undefined

  // if there's a currentGuess available (which means the user is typing)
  if (currentGuess || currentGuess === '') {
    // turn it into an array of letterObj and map over it instead
    let letters = [...currentGuess].map((letter) => {
      return {
        key: letter,
        color: 'transparent',
      };
    });

    return (
      <HStack className="row">
        {letters.map((letterObj, index) => (
          <Tile key={index} letter={letterObj.key} color={letterObj.color} />
        ))}
        {/* the letters array is not always 5 characters long, the blanks will be filled with empty tile */}
        {[...Array(5 - letters.length)].map((_, index) =>
          index === 0 ? (
            <EmptyTile key={index} showCursor />
          ) : (
            <EmptyTile key={index} />
          )
        )}
      </HStack>
    );
  }

  // if there's no guess, return a row of empty tiles
  if (guess === undefined) {
    return (
      <HStack>
        <EmptyTile />
        <EmptyTile />
        <EmptyTile />
        <EmptyTile />
        <EmptyTile />
      </HStack>
    );
  }

  // a complete word (when the user press ENTER)
  return (
    <HStack>
      {guess.map((letterObj, index) => (
        <Tile
          key={index}
          letter={letterObj.key}
          color={letterObj.color}
          order={index}
        />
      ))}
    </HStack>
  );
};

const Board = ({ currentGuess, guesses, turn }: BoardProps) => {
  return (
    <VStack>
      {guesses.map((guess, index) => {
        if (turn === index) {
          return <Row key={index} currentGuess={currentGuess} />;
        }
        return <Row key={index} guess={guess} />;
      })}
    </VStack>
  );
};

export default Board;
