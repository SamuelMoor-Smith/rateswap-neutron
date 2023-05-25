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

export const LockTokens = () => {
  const plans = [
    { days: "a day", value: "1day", fees: "20.24%" },
    { days: "7 days", value: "7days", fees: "32.39%" },
    { days: "14 days", value: "14days", fees: "40.49%" },
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
          bg={useColorModeValue("blackAlpha.50", "whiteAlpha.50")}
          borderRadius="2xl"
          maxW={{ base: "full", md: "2xl" }}
          w="full"
          p={6}
        >
          <Flex justify="space-between" align="center" mb={8}>
            <Heading size="lg">Bond LP tokens</Heading>
            <IconButton
              variant="ghost"
              icon={<ImCross />}
              aria-label="close"
              color={useColorModeValue("blackAlpha.600", "whiteAlpha.600")}
              onClick={() => setShow(false)}
            />
          </Flex>
          <Text fontWeight="semibold" mb={8}>
            Unbonding period
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
                    borderColor={useColorModeValue(
                      radioValue === value ? "orange.300" : "blackAlpha.400",
                      radioValue === value ? "orange.300" : "whiteAlpha.400"
                    )}
                    borderRadius="xl"
                    boxShadow={
                      radioValue === value
                        ? useColorModeValue(
                            "0 4px 6px -1px rgba(0,0,0,0.06), 0 2px 4px -1px rgba(0,0,0,0.06);",
                            "0 4px 10px -3px rgba(255,255,255,0.2)"
                          )
                        : "none"
                    }
                    p={4}
                    _hover={{
                      cursor: "pointer",
                      boxShadow:
                        value !== radioValue &&
                        useColorModeValue(
                          "0 4px 6px -1px rgba(0,0,0,0.06), 0 2px 4px -1px rgba(0,0,0,0.06);",
                          "0 4px 10px -3px rgba(255,255,255,0.2)"
                        ),
                    }}
                    css={{ "&>label": { cursor: "pointer" } }}
                  >
                    <Radio value={value}>
                      <Text fontSize="2xl" fontWeight="bold">
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
            borderColor={useColorModeValue("blackAlpha.400", "whiteAlpha.400")}
            borderRadius="xl"
            p={4}
            mb={8}
          >
            <Text fontWeight="semibold" mb={2}>
              Amount to bound
            </Text>
            <Text fontSize="sm" fontWeight="medium" mb={4}>
              Available LP token:&nbsp;
              <Text
                as="span"
                color={useColorModeValue("primary.700", "primary.200")}
              >
                0 GAMM-600
              </Text>
            </Text>
            <NumberInput
              display="flex"
              alignItems="center"
              value={inputValue}
              bg={useColorModeValue("whiteAlpha.500", "whiteAlpha.50")}
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
              Bond
            </Button>
          </Box>
        </Box>
      </Flex>
    ) : null
  );
};