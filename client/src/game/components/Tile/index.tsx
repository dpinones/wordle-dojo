import { Center, Text, keyframes, useColorMode } from '@chakra-ui/react';

interface TileProps {
  letter: string;
  color: string;
  order?: number;
}

// defaultBorderColor = ChakraUI's gray.700
const defaultBorderColor = '#2D3748';

// fontColor = ChakraUI's whitealpha.900 and blackalpha.900
const fontWhite = 'RGBA(255, 255, 255, 0.92)';
const fontBlack = 'RGBA(0, 0, 0, 0.92)';

// NOTE: You might have to move mapColor inside the Tile and wrap both it and flip inside a useEffect

const Tile = ({ letter, color, order }: TileProps) => {
  const { colorMode } = useColorMode();

  // function mapColor is used to change the default html color for custom hex color
  const mapColor = (color: string) => {
    if (color === 'transparent') {
      return 'transparent';
    }
    if (color === 'gray') {
      return colorMode === 'dark' ? '#E2E8F0' : '#718096';
    }
    if (color === 'green') {
      return colorMode === 'dark' ? '#9AE6B4' : '#38A169';
    }
    if (color === 'yellow') {
      return colorMode === 'dark' ? '#FAF089' : '#D69E2E';
    }
    return '#fff';
  };

  // flip keyframes is used when the user submit a Wordle
  const flip = keyframes`
    0% {
      transform: rotateX(0);
      background-color: transparent;
      border-color: ${defaultBorderColor};
    }
    45% {
      transform: rotateX(90deg);
      background-color: transparent;
      border-color: ${defaultBorderColor}
    }
    55% {
      transform: rotateX(90deg);
      background-color: ${mapColor(color)};
      border-color: ${mapColor(color)};
      color: ${
        colorMode === 'dark' ? fontBlack : fontWhite
      }; // This is useful in Light mode, where the default fontColor is black. When the animation finish, the fontColor will transition to white. In Darkmode, this is the default color: ;
    }
    100% {
      transform: rotateX(0);
      background-color: ${mapColor(color)};
      border-color: ${mapColor(color)};
      color: ${colorMode === 'dark' ? fontBlack : fontWhite}
  }`;

  // bounce keyframes is used when user is typing
  const bounce = keyframes`
    0% {
      transform: scale(1);
      border-color: ${defaultBorderColor}
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
      border-color: gray
    }
  `;

  // default animation when typing
  let animation = `${bounce} 0.1s ease`;
  // when user press ENTER, change animation to flip animation
  if (color === 'gray' || color === 'green' || color === 'yellow') {
    animation = `${flip} 0.6s ease`;
  }

  // control animation delay, so that the tiles don't animate all at once
  let delay = undefined;
  if (order) {
    delay = `${0.2 * order}s`;
  }

  return (
    <Center
      w={['50px', '55px', '60px']}
      h={['50px', '55px', '60px']}
      border="1px"
      borderColor="gray.700"
      animation={animation}
      userSelect="none"
      sx={{ animationDelay: delay, animationFillMode: 'forwards' }} // backgroundColor come from animationFillMode forwards
    >
      <Text fontWeight={700} fontSize="x-large">
        {letter.toUpperCase()}
      </Text>
    </Center>
  );
};

// animation keyframe for cursor in empty tile
const blink = keyframes`
  0% {
    opacity: 0.1
  }
  50% {
    opacity: 1
  }
  100% {
    opacity: 0.1
  }
`;

const EmptyTile = ({ showCursor }: { showCursor?: boolean }) => (
  <Center
    w={['50px', '55px', '60px']}
    h={['50px', '55px', '60px']}
    border="1px"
    borderColor={defaultBorderColor}
    userSelect="none"
  >
    {showCursor && (
      <Text fontSize="x-large" animation={`${blink} 2s infinite ease`}>
        _
      </Text>
    )}
  </Center>
);

export { Tile, EmptyTile };
