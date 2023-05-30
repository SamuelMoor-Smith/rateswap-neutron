/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react';
import {
  Box,
  Text,
  Stack,
  useColorModeValue,
  Image,
  Icon,
  useBreakpointValue,
  SystemStyleObject,
  SkeletonCircle,
  Skeleton
} from '@chakra-ui/react';
import { Searcher } from 'fast-fuzzy';
import { FiChevronDown } from 'react-icons/fi';
import {
  AsyncSelect,
  OptionProps,
  chakraComponents,
  GroupBase,
  DropdownIndicatorProps,
  PlaceholderProps
} from 'chakra-react-select';
import {
  ChainOption,
  ChangeChainDropdownType,
  ChangeChainMenuType
} from '../types';

const SkeletonOptions = () => {
  return (
    <Stack isInline={true} alignItems="center" spacing={3}>
      <SkeletonCircle w={10} h={10} />
      <Skeleton w={40} h={6} />
    </Stack>
  );
};

export const Chain = ({ chainOption }: { chainOption: ChainOption }) => {
  const colorModeValue = useColorModeValue('blackAlpha.800', 'whiteAlpha.800');
  return (
    <Box
            as="div"
            display="flex"
            zIndex={2500}
            justifyContent="center"
            alignItems="center"
            h="fit-content"
            p={0}
            w="fit-content"
            borderRadius="xl"
            boxShadow={chainOption ? "base" : "none"}
            bg={useColorModeValue("gray.200", "gray.800")}
            _focus={{ outline: "none" }}
            >
              <Box
                w={{ base: 10, md: 14 }}
                h={{ base: 10, md: 14 }}
                maxW={{ base: 10, md: 14 }}
                maxH={{ base: 10, md: 14 }}
                minW={{ base: 10, md: 14 }}
                minH={{ base: 10, md: 14 }}
                borderRadius="full"
                overflow="hidden"
              >
                <Image src={chainOption.icon} />
              </Box>
              <Box flex={1} textAlign="start" mx={{ base: 2, md: 4 }}>
                <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="bold">
                  {chainOption.label}
                </Text>
              </Box>
            </Box>
    );
    // <Box
    //   minW={10}
    //   minH={10}
    //   maxW={100}
    //   maxH={100}
    //   w="full"
    //   h="full"
    //   border="1px solid"
    //   borderColor={useColorModeValue('blackAlpha.200', 'whiteAlpha.200')}
    //   borderRadius="full"
    //   overflow="hidden"
    // >
    //   <Stack
    //     isInline={true}
    //     alignItems="center"
    //     spacing={3}
    //     overflow="hidden"
    //     wordBreak="break-word"
    //     color={colorModeValue}
    //     w="full"
    //     direction="row"  // explicitly set flexDirection to row
    //   >
    //     <Image
    //       alt="hey"
    //       // src={chainOption.icon}
    //       fallbackSrc={'https://dummyimage.com/150/9e9e9e/ffffff&text=☒'}
    //     />
    //     <Text fontSize="xl" fontWeight="semibold" textColor="green">
    //       {chainOption.label}
    //     </Text>
    //   </Stack>
    // </Box>
  // );
};

export const ChainBox = ({ chainOption }: { chainOption: ChainOption }) => {
  return (
    <Box w="full" position="relative" zIndex={150}>
      <Chain chainOption={chainOption}  />
    </Box>
  );
};

