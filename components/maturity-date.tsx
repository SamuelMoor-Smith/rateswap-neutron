import {
    Box,
    Button,
    Collapse,
    Divider,
    Editable,
    EditableInput,
    EditablePreview,
    Flex,
    Grid,
    Icon,
    Image,
    Popover,
    PopoverBody,
    PopoverContent,
    PopoverTrigger,
    Skeleton,
    Stack,
    SystemStyleObject,
    Text,
    useColorModeValue,
    useDisclosure,
    useOutsideClick,
    useRadio,
    useRadioGroup
  } from '@chakra-ui/react';
  import { assets, chains } from 'chain-registry';
  import {
    AsyncSelect,
    chakraComponents,
    ControlProps,
    GroupBase,
    OptionBase,
    OptionProps
  } from 'chakra-react-select';
  import React, { useEffect, useRef, useState } from 'react';
  import {
    BsExclamationCircleFill,
    BsHexagon,
    BsHexagonFill
  } from 'react-icons/bs';
  import { CgArrowsExchangeV } from 'react-icons/cg';
  import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
  import { RiSearch2Fill, RiSettings4Fill } from 'react-icons/ri';
import { UseCustomColors } from './custom-colors';
import { LockTokens } from './lock-tokens';

interface dataType extends OptionBase {
    label: string;
    value: string;
    imgSrc?: string;
    ibc?: {
      source_channel?: string;
      dst_channel?: string;
      source_denom?: string;
    };
  }

export const Maturity = ({
    fromItem,
    toItem,
    tokenInputValue
  }: {
    fromItem: dataType | undefined;
    toItem: dataType | undefined;
    tokenInputValue: string;
  }) => {

    const { white_or_black, orange300_or_orange300, gray_or_white, gray50_or_whiteAlpha200, gray100_or_gray700, gray100_or_whiteAlpha300, primary100_or_primary500, primary500_or_primary300, primary700_or_primary200, blackAlpha50_or_whiteAlpha50, blackAlpha100_or_whiteAlpha100, blackAlpha200_or_whiteAlpha200, blackAlpha200_or_whiteAlpha400, blackAlpha300_or_whiteAlpha300, blackAlpha300_or_whiteAlpha600, blackAlpha400_or_whiteAlpha400, blackAlpha400_or_whiteAlpha500, blackAlpha400_or_whiteAlpha600, blackAlpha500_or_whiteAlpha600, blackAlpha600_or_whiteAlpha600, blackAlpha700_or_whiteAlpha700, blackAlpha800_or_whiteAlpha800, blackAlpha800_or_whiteAlpha900, whiteAlpha500_or_whiteAlpha50, blackAlpha900_or_whiteAlpha900, color1, color2, color3, color4, color5 } = UseCustomColors();


    return (
      <Box
        bg={gray50_or_whiteAlpha200}
        borderRadius="xl"
        boxShadow={gray_or_white}
        p={6}
      >
        <Flex
          justify="space-between"
          align="start"
          fontWeight="bold"
          fontSize={{ md: 'lg' }}
          color={blackAlpha700_or_whiteAlpha700}
          mb={1}
        >
          <Text flex={1} mr={2}>
            Rate
          </Text>
          {fromItem && toItem ? (
            <Stack
              as="span"
              isInline
              wrap="wrap"
              maxW={{ base: 56, sm: 'initial' }}
              justify="end"
            >
              <Text>
                {tokenInputValue}&ensp;{fromItem.label}
              </Text>
              <Text>=</Text>
              <Text>3.265358&ensp;{toItem.label}</Text>
            </Stack>
          ) : (
            <Skeleton w={{ base: 32, sm: 48 }} h={{ base: 6, sm: 8 }} />
          )}
        </Flex>
        <Flex justify="end" mb={4}>
          {fromItem && toItem ? (
            <Stack
              as="span"
              isInline
              wrap="wrap"
              fontSize={{ base: 'sm', md: 'md' }}
              fontWeight="bold"
              color={blackAlpha600_or_whiteAlpha600}
              maxW={{ base: 56, sm: 'initial' }}
              justify="end"
            >
              <Text>3.265358&ensp;{toItem.label}</Text>
              <Text>=</Text>
              <Text>
                {tokenInputValue}&ensp;{fromItem.label}
              </Text>
            </Stack>
          ) : (
            <Skeleton w={{ base: 28, sm: 40 }} h={{ base: 4, sm: 6 }} />
          )}
        </Flex>
        <Flex
          justify="space-between"
          fontWeight="bold"
          fontSize={{ md: 'lg' }}
          color={blackAlpha700_or_whiteAlpha700}
        >
          <Text>Maturity Date</Text>
          <Text>2023-03-04</Text>
        </Flex>
        <Divider
          borderColor={blackAlpha400_or_whiteAlpha600}
          my={{ base: 4, md: 6 }}
        />
        <Flex
          justify="space-between"
          fontWeight="bold"
          fontSize={{ md: 'lg' }}
          color={blackAlpha800_or_whiteAlpha900}
        >
          <Text>Estimated Slippage</Text>
          <Text>&lt;&nbsp;0.001%</Text>
        </Flex>
      </Box>
    );
  };