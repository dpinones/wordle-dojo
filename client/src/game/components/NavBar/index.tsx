import { Flex, Heading, Button, useColorMode, HStack } from '@chakra-ui/react';
import { FaSun, FaMoon, FaGithub } from 'react-icons/fa';
import InfoScreen from '../InfoScreen';
import ProgressPopver from '../ProgressPopover';

interface NavBarProps {
  streak: number;
  quantity: number;
}

const NavBar = ({ streak, quantity }: NavBarProps) => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Flex alignItems="center" justifyContent="space-between" h="10vh" px={4}>
      <Heading size="lg" userSelect="none">
        Wordle Dojo
      </Heading>
      <HStack>
        <ProgressPopver streak={streak} quantity={quantity} />
        <InfoScreen quantity={quantity} />
        <Button
          onClick={toggleColorMode}
          size={['xs', 'sm', 'md']}
          variant="ghost"
        >
          {colorMode === 'dark' ? <FaSun /> : <FaMoon />}
        </Button>
        <Button
          as="a"
          href="https://github.com/dpinones/wordle-dojo"
          target="_blank"
          size={['xs', 'sm', 'md']}
          variant="ghost"
        >
          <FaGithub />
        </Button>
      </HStack>
    </Flex>
  );
};

export default NavBar;
