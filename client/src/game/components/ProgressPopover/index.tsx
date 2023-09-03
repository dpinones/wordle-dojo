import {
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  Progress,
  Text,
  Flex,
} from '@chakra-ui/react';

interface ProgressPopoverProps {
  streak: number;
  quantity: number;
}

const ProgressPopover = ({ streak, quantity }: ProgressPopoverProps) => {
  return (
    <Popover>
      <PopoverTrigger>
        <Button size={['xs', 'sm', 'md']} variant="ghost">
          <Text fontSize="xl">{streak}</Text>
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader>Current Progress</PopoverHeader>
        <PopoverBody>
          <Progress
            value={(streak / quantity) * 100}
            borderRadius="md"
            my={2}
          />
          <Flex width="55%" justifyContent="space-between">
            <Text>Total Wordles :</Text>
            <Text>{quantity}</Text>
          </Flex>
          <Flex width="55%" justifyContent="space-between">
            <Text>Win Streaks :</Text>
            <Text>{streak}</Text>
          </Flex>
          <Flex width="55%" justifyContent="space-between">
            <Text>Wordles Left :</Text>
            <Text>{quantity - streak}</Text>
          </Flex>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default ProgressPopover;
