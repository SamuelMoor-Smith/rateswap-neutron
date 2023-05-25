import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Text,
  Stack,
  useColorModeValue,
  Flex,
  IconButton,
  CircularProgress,
  CircularProgressLabel,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  NumberInput,
  Button,
  NumberInputField,
  Checkbox,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Tooltip,
  Alert,
  AlertIcon,
  AlertTitle,
  SimpleGrid,
} from "@chakra-ui/react";
import { ImCross } from "react-icons/im";
import { IoIosArrowDown, IoMdInformationCircle } from "react-icons/io";
import { assets } from "chain-registry";

interface dataType {
  label: string;
  value: string;
  percent: number;
  availableCurrency: number;
  show: boolean;
}
interface inputType {
  id: string;
  value: string;
}
interface singleType {
  selectedIndex: number;
  isSingle: boolean;
}
interface popType {
  optionsIndex: dataType[];
  isOpen: boolean;
}

const AddLiquidity = ({
  data,
  tokenInputValue,
  single,
  openPop,
  setTokenInputValue,
  setSingle,
  setOpenPop,
}: {
  data: dataType[];
  setData: (value: dataType[]) => void;
  tokenInputValue: inputType[];
  setTokenInputValue: (value: inputType[]) => void;
  single: singleType;
  setSingle: (value: singleType) => void;
  openPop: popType;
  setOpenPop: (value: popType) => void;
}) => {
  return (
    <>
      <Text fontSize="sm" fontWeight="semibold" pt={2}>
        LP token balance:&nbsp;
        <Text as="span" color={useColorModeValue("primary.500", "primary.300")}>
          0 GAMM-600
        </Text>
      </Text>
      <Stack spacing={2} mb={6}>
        {data.map(({ label, value, percent, availableCurrency, show }, i) => {
          return (
            show && (
              <Box position="relative">
                <Popover returnFocusOnClose={false} isOpen={openPop.isOpen}>
                  <PopoverTrigger>
                    <Button w={0} h={0} minW={0} p={0} />
                  </PopoverTrigger>
                  <PopoverContent
                    position="absolute"
                    top={{ base: 24, sm: "6.7rem" }}
                    left={0}
                    borderTopStyle="dashed"
                    borderRadius={
                      openPop.isOpen ? "0 0 0.375rem 0.375rem" : "md"
                    }
                    bg={useColorModeValue("#f5f5f5", "whiteAlpha.50")}
                    w="full"
                    maxW={{ base: 60, sm: "sm" }}
                    minW={{ base: 60, sm: "sm" }}
                    _focus={{ outline: "none" }}
                  >
                    <PopoverBody>
                      {openPop.optionsIndex.map(
                        ({ label: optionLabel, percent }) => (
                          <Button
                            variant="ghost"
                            w="full"
                            h="fit-content"
                            justifyContent="flex-start"
                            flexWrap="wrap"
                            fontSize="2xl"
                            fontWeight="bold"
                            wordBreak="break-word"
                            px={{ base: 2, sm: 4 }}
                            py={4}
                            onClick={() => {
                              data.map(({ label }, i) => {
                                if (optionLabel === label) {
                                  setSingle({
                                    selectedIndex: i,
                                    isSingle: true,
                                  });
                                  setOpenPop({
                                    optionsIndex: openPop.optionsIndex,
                                    isOpen: false,
                                  });
                                }
                              });
                            }}
                          >
                            <CircularProgress
                              value={percent}
                              color={useColorModeValue(
                                "primary.500",
                                "primary.300"
                              )}
                              size="full"
                              w={12}
                              mr={{ base: 3, sm: 4 }}
                            >
                              <CircularProgressLabel>
                                {percent}
                              </CircularProgressLabel>
                            </CircularProgress>
                            {optionLabel}
                          </Button>
                        )
                      )}
                    </PopoverBody>
                  </PopoverContent>
                </Popover>
                <Flex
                  key={value}
                  border="1px solid"
                  borderColor={useColorModeValue(
                    "blackAlpha.100",
                    "whiteAlpha.100"
                  )}
                  borderRadius={openPop.isOpen ? "1rem 1rem 1rem 0" : "2xl"}
                  align="center"
                  flexDirection={{ base: "column", sm: "row" }}
                  wrap="wrap"
                  p={4}
                >
                  <Flex
                    flex={1}
                    align="center"
                    mb={{ base: 4, sm: 0 }}
                    mr={{ base: 0, sm: 4 }}
                    py={2}
                  >
                    <CircularProgress
                      value={percent}
                      color={useColorModeValue("primary.500", "primary.300")}
                      size={14}
                      mr={4}
                    >
                      <CircularProgressLabel>{percent}</CircularProgressLabel>
                    </CircularProgress>
                    <Flex
                      position="relative"
                      align="center"
                      _hover={{ cursor: single.isSingle && "pointer" }}
                      onClick={() =>
                        setOpenPop({
                          optionsIndex: data.filter((_, index) => index !== i),
                          isOpen: !openPop.isOpen,
                        })
                      }
                    >
                      <Text
                        fontWeight="bold"
                        fontSize={{ base: "2xl", sm: "3xl" }}
                      >
                        {label}
                      </Text>
                      {single.isSingle && (
                        <IconButton
                          variant="unstyled"
                          icon={<IoIosArrowDown />}
                          aria-label="singleButton"
                          _focus={{ outline: "none" }}
                          padding={4}
                        />
                      )}
                    </Flex>
                  </Flex>
                  <Box flex={1}>
                    <Stack
                      isInline={true}
                      w="full"
                      justify={{ base: "center", sm: "end" }}
                      align="center"
                      wrap="wrap"
                      spacing={2}
                      mb={2}
                    >
                      <Text fontWeight="medium" textAlign="center">
                        Available&nbsp;
                        <Text
                          as="span"
                          color={useColorModeValue(
                            "primary.500",
                            "primary.300"
                          )}
                        >
                          {availableCurrency}&nbsp;
                        </Text>
                        {label}
                      </Text>
                      <Button
                        alignSelf="end"
                        colorScheme="primary"
                        size="xs"
                        _focus={{ outline: "none" }}
                        onClick={() => {
                          const getVal = tokenInputValue.map(
                            ({ id, value: defaultVal }) => {
                              if (id === label) {
                                return {
                                  id: id,
                                  value: availableCurrency.toString(),
                                };
                              }
                              return { id: id, value: defaultVal };
                            }
                          );
                          setTokenInputValue(getVal);
                        }}
                      >
                        MAX
                      </Button>
                    </Stack>
                    <NumberInput
                      alignItems="center"
                      value={tokenInputValue[i].value}
                      bg={useColorModeValue("whiteAlpha.500", "whiteAlpha.50")}
                      min={0}
                      max={availableCurrency}
                      onChange={(val) => {
                        const getVal = tokenInputValue.map(
                          ({ id, value: defaultVal }) => {
                            if (id === label) {
                              return {
                                id: id,
                                value: val,
                              };
                            }
                            return { id: id, value: defaultVal };
                          }
                        );
                        setTokenInputValue(getVal);
                      }}
                    >
                      <NumberInputField textAlign="end" pr={4} />
                    </NumberInput>
                  </Box>
                </Flex>
              </Box>
            )
          );
        })}
      </Stack>
      <Flex
        position="relative"
        justify="end"
        align="center"
        fontSize="xl"
        mb={6}
      >
        <Checkbox
          isChecked={single.isSingle}
          onChange={(e) => {
            setSingle({
              selectedIndex: single.selectedIndex,
              isSingle: e.target.checked,
            });
            setOpenPop({ optionsIndex: openPop.optionsIndex, isOpen: false });
          }}
          size="lg"
        >
          Single Asset LP&nbsp;
        </Checkbox>
        <Tooltip
          label="Single Asset LP allows you to provide liquidity using one asset. However, this will impact the pool price of the asset you’re providing liquidity with."
          placement="top-end"
          bg={useColorModeValue("blackAlpha.900", "whiteAlpha.900")}
          borderRadius="lg"
          border="1px solid"
          borderColor={useColorModeValue("blackAlpha.100", "whiteAlpha.100")}
        >
          <Box position="relative">
            <IoMdInformationCircle />
          </Box>
        </Tooltip>
      </Flex>
      <Flex
        flexDirection={{ base: "column", sm: "row" }}
        justify="space-between"
        textAlign={{ base: "end", sm: "start" }}
        bg={useColorModeValue("blackAlpha.50", "whiteAlpha.50")}
        borderRadius="lg"
        border="1px solid"
        borderColor={useColorModeValue("blackAlpha.100", "whiteAlpha.100")}
        p={4}
        mb={6}
      >
        <Text fontWeight="semibold">Price impact</Text>
        <Text>-</Text>
      </Flex>
      <Flex justify="center" mb={6}>
        <Alert status="error" borderRadius="md" w="fit-content">
          <AlertIcon />
          <AlertTitle>Amount is zero</AlertTitle>
        </Alert>
      </Flex>
      <Box px={{ sm: 12 }}>
        <Button
          isDisabled={
            tokenInputValue.filter(({ value }) => value !== "0").length > 0
              ? false
              : true
          }
          w="full"
          size="lg"
          h={{ base: 12, sm: 14 }}
          colorScheme="primary"
        >
          Add Liquidity
        </Button>
      </Box>
    </>
  );
};

const RemoveLiquidity = ({
  removeValue,
  setRemoveValue,
}: {
  removeValue: number;
  setRemoveValue: (value: number) => void;
}) => {
  const gaps = [25, 50, 75, 100];
  return (
    <Box>
      <Text
        fontSize={{ base: "5xl", sm: "7xl" }}
        fontWeight="bold"
        textAlign="center"
        py={10}
      >
        {removeValue}%
      </Text>
      <Slider
        min={0}
        max={100}
        step={0.1}
        size="lg"
        colorScheme="primary"
        defaultValue={removeValue}
        value={removeValue}
        onChange={(val) => setRemoveValue(val)}
        mb={16}
      >
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb w={{ base: 5, sm: 7 }} h={{ base: 5, sm: 7 }} />
      </Slider>
      <SimpleGrid columns={{ sm: 4 }} spacing={4} mb={20}>
        {gaps.map((v) => (
          <Button variant="outline" onClick={() => setRemoveValue(v)}>
            {v}%
          </Button>
        ))}
      </SimpleGrid>
      <Box px={{ sm: 12 }}>
        <Button
          isDisabled={removeValue > 0 ? false : true}
          w="full"
          size="lg"
          h={{ base: 12, sm: 14 }}
          colorScheme="primary"
        >
          Remove Liquidity
        </Button>
      </Box>
    </Box>
  );
};

const ManageLiquidity = () => {
  const [showModel, setShowModel] = useState(true);
  const [data, setData] = useState<dataType[]>([]);
  const [tokenInputValue, setTokenInputValue] = useState<inputType[]>([]);
  const [tabIndex, setTabIndex] = useState(0);
  const [single, setSingle] = useState<singleType>({
    selectedIndex: 0,
    isSingle: false,
  });
  const [openPop, setOpenPop] = useState<popType>({
    optionsIndex: [],
    isOpen: false,
  });
  const [removeValue, setRemoveValue] = useState(35);

  const tabName = ["Add Liquidity", "Remove Liquidity"];

  useEffect(() => {
    setTimeout(() => setShowModel(true), 2500);
  }, [showModel]);

  useEffect(() => {
    const getShuffledArr = (arr: any[]) => {
      for (let i = arr.length - 1; i > 0; i--) {
        const rand = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[rand]] = [arr[rand], arr[i]];
      }
      return arr;
    };
    const randGenerator = (n: number, sum: number) => {
      const arrReturn = [];
      let fSumTmp = sum;
      let iAcc = 0;
      for (let i = 0; i < n; i++) {
        let iTmp = Math.floor(Math.random() * (fSumTmp / 2));
        arrReturn.push(iTmp);
        fSumTmp -= iTmp;
        iAcc += iTmp;
      }
      arrReturn.push(sum - iAcc);
      return arrReturn;
    };
    const assetList = getShuffledArr(
      assets
        .map(({ assets }) => assets.values())
        .map((iterator) => {
          for (const value of iterator) {
            return {
              label: value.name,
              value: value.name,
              percent: null,
              availableCurrency: Math.floor(Math.random() * 100),
              show: true,
            };
          }
        })
    ).slice(0, 2);
    const getPercentArr = randGenerator(1, 100);
    const defaultData = assetList.map((data, i) => ({
      ...data,
      percent: getPercentArr[i],
    }));
    const defaultInput = assetList.map(({ label }) => ({
      id: label,
      value: "0",
    }));
    setTokenInputValue(defaultInput);
    setData(defaultData);
  }, []);

  useEffect(() => {
    if (single.isSingle) {
      setData((pre) => {
        const getNewArr = pre.map((v, i) => {
          if (single.selectedIndex !== i) return { ...v, show: false };
          return { ...v, show: true };
        });
        return getNewArr;
      });
    }

    if (!single.isSingle)
      setData((pre) => pre.map((v) => ({ ...v, show: true })));
  }, [single]);

  return (
    showModel ? (
      <Flex align="center" justify="center" p={{ base: 4, sm: 8 }}>
        <Box
          bg={useColorModeValue("blackAlpha.50", "whiteAlpha.50")}
          borderRadius="2xl"
          maxW={{ base: "full", md: "4xl" }}
          w="full"
          p={6}
        >
          <Flex justify="space-between" align="center" mb={8}>
            <Heading size="lg">Manage Liquidity</Heading>
            <IconButton
              variant="ghost"
              icon={<ImCross />}
              aria-label="close"
              color={useColorModeValue("blackAlpha.600", "whiteAlpha.600")}
              onClick={() => setShowModel(false)}
            />
          </Flex>
          <Tabs
            isFitted={true}
            colorScheme="primary"
            onChange={(index) => setTabIndex(index)}
            mb={6}
          >
            <TabList mb="1em">
              {tabName.map((name, index) => (
                <Tab
                  key={index}
                  _hover={{ color: index !== tabIndex && "primary.300" }}
                  _focus={{ outline: "none" }}
                >
                  {name}
                </Tab>
              ))}
            </TabList>
            <TabPanels>
              <TabPanel p={0}>
                <AddLiquidity
                  data={data}
                  setData={setData}
                  tokenInputValue={tokenInputValue}
                  setTokenInputValue={setTokenInputValue}
                  single={single}
                  setSingle={setSingle}
                  openPop={openPop}
                  setOpenPop={setOpenPop}
                />
              </TabPanel>
              <TabPanel>
                <RemoveLiquidity
                  removeValue={removeValue}
                  setRemoveValue={setRemoveValue}
                />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Flex>
    ) : null
  );
};

export default function Dashboard () {
  return <ManageLiquidity />;
}