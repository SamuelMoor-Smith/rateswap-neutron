import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Stack,
  useColorModeValue,
  Text,
  Heading,
  Button,
  IconButton,
  Radio,
  RadioGroup,
  SimpleGrid,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import { ImCross } from "react-icons/im";
import { UseCustomColors } from "../custom-colors";

export const Deposit = () => {

  const { white_or_black, orange300_or_orange300, gray_or_white, gray50_or_whiteAlpha200, gray100_or_gray700, gray100_or_whiteAlpha300, primary100_or_primary500, primary500_or_primary300, primary700_or_primary200, blackAlpha50_or_whiteAlpha50, blackAlpha100_or_whiteAlpha100, blackAlpha200_or_whiteAlpha200, blackAlpha200_or_whiteAlpha400, blackAlpha300_or_whiteAlpha300, blackAlpha300_or_whiteAlpha600, blackAlpha400_or_whiteAlpha400, blackAlpha400_or_whiteAlpha500, blackAlpha400_or_whiteAlpha600, blackAlpha500_or_whiteAlpha600, blackAlpha600_or_whiteAlpha600, blackAlpha700_or_whiteAlpha700, blackAlpha800_or_whiteAlpha800, blackAlpha800_or_whiteAlpha900, whiteAlpha500_or_whiteAlpha50, blackAlpha900_or_whiteAlpha900, color1, color2, color3, color4, color5 } = UseCustomColors();

  function addMonths(date: Date, months: number) {
    date.setMonth(date.getMonth() + months);
    return date;
  }

  function addYear(date: Date, year: number) {
    date.setFullYear(date.getFullYear() + year);
    return date;
  }

  let dateNow = new Date();

  const plans = [
    { days: addMonths(dateNow, 3).toISOString().slice(0,10), value: "3months", fees: "20.24%" },
    { days: addMonths(dateNow, 6).toISOString().slice(0,10), value: "6months", fees: "32.39%" },
    { days: addYear(dateNow, 1).toISOString().slice(0,10), value: "1year", fees: "40.49%" },
  ];

  const [radioValue, setRadioValue] = useState(plans[2].value);
  const [inputValue, setInputValue] = useState(5);
  const [show, setShow] = useState(true);
  const [showNumberInputStepper, setShowNumberInputStepper] = useState(false);

  useEffect(() => {
    setTimeout(() => setShow(true), 2500);
  }, [show]);

  return (
    show ? (
      <Flex align="center" justify="center" p={6}>
        <Box
          bg={blackAlpha50_or_whiteAlpha50}
          borderRadius="2xl"
          maxW={{ base: "full", md: "2xl" }}
          w="full"
          p={6}
        >
          <Flex justify="space-between" align="center" mb={8}>
            <Heading size="lg">Deposit</Heading>
          </Flex>
          <Text fontWeight="semibold" mb={8}>
            Maturity Date
          </Text>
          <RadioGroup
            colorScheme="primary"
            defaultValue={radioValue}
            onChange={(v) => setRadioValue(v)}
          >
            <SimpleGrid columns={{ md: 3 }} spacing={6} mb={6}>
              {plans.map(({ days, value, fees }, i) => {
                return (
                  <Stack
                    key={i}
                    border="1px solid"
                    borderColor={radioValue === value ? orange300_or_orange300 : blackAlpha400_or_whiteAlpha400}
                    borderRadius="xl"
                    boxShadow={
                      radioValue === value
                        ? color5
                        : "none"
                    }
                    p={4}
                    _hover={{
                      cursor: "pointer",
                      boxShadow:
                        value !== radioValue &&
                        color5,
                    }}
                    css={{ "&>label": { cursor: "pointer" } }}
                  >
                    <Radio value={value}>
                      <Text fontSize="lg" fontWeight="bold">
                        {days}
                      </Text>
                      <Text>{fees}</Text>
                    </Radio>
                  </Stack>
                );
              })}
            </SimpleGrid>
          </RadioGroup>
          <Box
            border="1px solid"
            borderColor={blackAlpha400_or_whiteAlpha400}
            borderRadius="xl"
            p={4}
            mb={8}
          >
            <Text fontWeight="semibold" mb={2}>
              Amount to deposit
            </Text>
            <Text fontSize="sm" fontWeight="medium" mb={4}>
              Available fyUSDC token:&nbsp;
              <Text
                as="span"
                color={primary700_or_primary200}
              >
                0 fyUSDC
              </Text>
            </Text>
            <NumberInput
              display="flex"
              alignItems="center"
              value={inputValue}
              bg={whiteAlpha500_or_whiteAlpha50}
              min={0}
              max={20}
              onChange={(value) => setInputValue(parseInt(value))}
              onFocus={() => setShowNumberInputStepper(true)}
              onBlur={() => setShowNumberInputStepper(false)}
              onMouseEnter={() => setShowNumberInputStepper(true)}
              onMouseLeave={() => setShowNumberInputStepper(false)}
            >
              <NumberInputField />
              {showNumberInputStepper && (
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              )}
              <Button
                position="absolute"
                zIndex={5}
                right={showNumberInputStepper ? 8 : 2}
                colorScheme="primary"
                size="xs"
                ml={2}
                _focus={{ outline: "none" }}
                onClick={() => setInputValue(20)}
              >
                max
              </Button>
            </NumberInput>
          </Box>
          <Box px={{ base: 4, md: 16 }}>
            <Button
              colorScheme="primary"
              w="full"
              h={14}
              isDisabled={inputValue === 0 ? true : false}
            >
              Deposit
            </Button>
          </Box>
        </Box>
      </Flex>
    ) : null
  );
};