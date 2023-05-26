import React, { useState, useEffect, useRef } from "react";
import { UseCustomColors } from "../custom-colors";
import {
  Box,
  Text,
  Stack,
  Flex,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalFooter,
  useDisclosure,
  Image,
  Icon,
  Divider,
  Button,
  useBreakpointValue,
  NumberInput,
  NumberInputField,
  SystemStyleObject,
  Skeleton,
  Collapse,
  useOutsideClick,
  Grid,
  GridItem,
  Center,
  Heading,
} from "@chakra-ui/react";
import {
  AsyncSelect,
  OptionProps,
  chakraComponents,
  OptionBase,
  GroupBase,
} from "chakra-react-select";
import { RiLinkM } from "react-icons/ri";
import { FiChevronDown, FiX } from "react-icons/fi";
import { assets } from "chain-registry";
import { Rate } from "../rate";
import { AvailableCoin } from "../available-coin";

interface walletType {
  id: string;
  logo: string;
  title: string;
  address: string;
}

interface dataType extends OptionBase {
  label: string;
  display: string;
  value: string;
  imgSrc: string;
  available: string;
}

const SkeletonOptions = () => {
  return (
    <>
      <Flex justify="space-between" align="center" mb={{ base: 2, sm: 4 }}>
        <Flex align="center">
          <Skeleton
            w={{ base: 10, sm: 16 }}
            h={{ base: 10, sm: 16 }}
            mr={{ base: 2, sm: 4 }}
          />
          <Skeleton w={{ base: 24, sm: 48 }} h={{ base: 6, sm: 8 }} />
        </Flex>
        <Skeleton w={{ base: 24, sm: 48 }} h={{ base: 6, sm: 8 }} />
      </Flex>
      <Flex justify="space-between" align="center" mb={{ base: 2, sm: 4 }}>
        <Flex align="center">
          <Skeleton
            w={{ base: 10, sm: 16 }}
            h={{ base: 10, sm: 16 }}
            mr={{ base: 2, sm: 4 }}
          />
          <Skeleton w={{ base: 24, sm: 48 }} h={{ base: 6, sm: 8 }} />
        </Flex>
        <Skeleton w={{ base: 24, sm: 48 }} h={{ base: 6, sm: 8 }} />
      </Flex>
      <Flex justify="space-between" align="center">
        <Flex align="center">
          <Skeleton
            w={{ base: 10, sm: 16 }}
            h={{ base: 10, sm: 16 }}
            mr={{ base: 2, sm: 4 }}
          />
          <Skeleton w={{ base: 24, sm: 48 }} h={{ base: 6, sm: 8 }} />
        </Flex>
        <Skeleton w={{ base: 24, sm: 48 }} h={{ base: 6, sm: 8 }} />
      </Flex>
    </>
  );
};

const SelectOptions = ({
  data,
  selectedItem,
  setSelectedItem,
}: {
  data: dataType[];
  selectedItem: dataType;
  setSelectedItem: (value: dataType) => void;
}) => {
  const menuHeight = useBreakpointValue({ base: 60, md: 56 });
  const customStyles = {
    menu: (provided: SystemStyleObject) => ({
      ...provided,
      maxH: menuHeight,
      h: "full",
      position: "relative",
      mt: 4,
      mb: 0,
    }),
    menuList: (provided: SystemStyleObject) => ({
      ...provided,
      maxH: menuHeight,
      bg: "transparent",
      border: "none",
      borderRadius: "none",
      py: 0,
      pr: { base: 2, sm: 4 },
      // For Firefox
      scrollbarWidth: "auto",
      scrollbarColor: useColorModeValue(
        "rgba(0,0,0,0.3) rgba(0,0,0,0.2)",
        "rgba(255,255,255,0.2) rgba(255,255,255,0.1)"
      ),
      // For Chrome and other browsers except Firefox
      "&::-webkit-scrollbar": {
        width: "18px",
        background: useColorModeValue(
          "rgba(160,160,160,0.1)",
          "rgba(255,255,255,0.1)"
        ),
        borderRadius: "4px",
      },
      "&::-webkit-scrollbar-thumb": {
        background: useColorModeValue(
          "rgba(0,0,0,0.1)",
          "rgba(255,255,255,0.1)"
        ),
        borderRadius: "4px",
      },
    }),
    option: (provided: SystemStyleObject, state: { isSelected: boolean }) => ({
      ...provided,
      borderRadius: "lg",
      bg: state.isSelected
        ? useColorModeValue("primary.100", "primary.500")
        : "transparent",
      color: "inherit",
      _hover: {
        bg: state.isSelected
          ? useColorModeValue("primary.100", "primary.500")
          : useColorModeValue("blackAlpha.200", "whiteAlpha.200"),
      },
      _disabled: {
        _hover: { bg: "transparent" },
      },
    }),
  };
  const IndicatorSeparator = () => {
    return null;
  };
  const DropdownIndicator = () => {
    return null;
  };
  const CustomOption = ({
    children,
    ...props
  }: OptionProps<dataType, true, GroupBase<dataType>>) => {
    return (
      <chakraComponents.Option {...props}>
        <Grid
          id={props.data.value}
          templateColumns={{ base: "auto 1fr", md: "auto 1fr auto" }}
          justifyContent="center"
          alignItems="center"
          rowGap={{ base: 1.5, md: 0 }}
          columnGap={{ base: 2, md: 4 }}
          w="full"
        >
          <GridItem
            minW={{ base: 12, md: 14 }}
            minH={{ base: 12, md: 14 }}
            maxW={{ base: 12, md: 14 }}
            maxH={{ base: 12, md: 14 }}
            rowSpan={2}
            w="full"
            h="full"
          >
            <Image src={props.data.imgSrc} />
          </GridItem>
          <GridItem>
            <Text
              fontSize={{ base: "lg", sm: "2xl" }}
              fontWeight="bold"
              textAlign={{ md: "start" }}
            >
              {children}
            </Text>
            <Text
              fontSize={{ base: "sm", md: "lg" }}
              fontWeight="semibold"
              textAlign={{ md: "start" }}
              color={useColorModeValue("blackAlpha.500", "whiteAlpha.500")}
            >
              {props.data.display}
            </Text>
          </GridItem>
          <GridItem
            fontWeight="semibold"
            textAlign={{ base: "start", md: "end" }}
          >
            <Text
              fontSize={{ base: "lg", md: "xl" }}
              py={{ md: 0.5 }}
              wordBreak="break-word"
            >
              {props.data.available}
            </Text>
            <Text
              fontSize={{ base: "sm", md: "lg" }}
              color={useColorModeValue("blackAlpha.500", "whiteAlpha.500")}
            >
              available
            </Text>
          </GridItem>
        </Grid>
      </chakraComponents.Option>
    );
  };

  return (
    <AsyncSelect
      placeholder="Search"
      chakraStyles={customStyles}
      isClearable={false}
      blurInputOnSelect={true}
      controlShouldRenderValue={false}
      menuIsOpen={true}
      loadingMessage={() => <SkeletonOptions />}
      defaultOptions={data}
      value={selectedItem}
      loadOptions={(inputValue, callback) => {
        setTimeout(() => {
          const values = data.filter((option) =>
            option.label.toLowerCase().includes(inputValue.toLowerCase())
          );
          callback(values);
        }, 1000);
      }}
      onChange={(selectedOption) => {
        let value = {};
        value = { ...selectedOption };
        setSelectedItem(value as dataType);
      }}
      components={{
        DropdownIndicator,
        IndicatorSeparator,
        Option: CustomOption,
      }}
    />
  );
};

const WithdrawTokens = ({
  showIcon,
  isOpen,
  onClose,
}: {
  showIcon: boolean;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [wallets, setWallets] = useState<walletType[]>([
    {
      id: "from",
      logo: "https://raw.githubusercontent.com/cosmos/chain-registry/master/osmosis/images/osmo.png",
      title: "Osmosis",
      address: "address wasn't identified yet",
    },
    {
      id: "to",
      logo: "https://raw.githubusercontent.com/cosmos/chain-registry/master/juno/images/juno.png",
      title: "JunoSwap",
      address: "address wasn't identified yet",
    },
  ]);
  const [inputValue, setInputValue] = useState<string>("0");
  const [data, setData] = useState<dataType[]>([]);
  const [selectedItem, setSelectedItem] = useState<dataType>({
    label: "Cosmos Hub ATOM",
    display: "ATOM",
    value: "Cosmos Hub Atom",
    imgSrc: "https://raw.githubusercontent.com/cosmos/chain-registry/master/cosmoshub/images/atom.png",
    available: "23138917",
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const optionsMenuRef = useRef<HTMLDivElement | null>(null);

  const {
    isOpen: selectIsOpen,
    onToggle: onSelectToggle,
    onClose: onSelectClose,
  } = useDisclosure();
  const buttonDirection = useBreakpointValue({
    base: false,
    md: true,
  });

  useEffect(() => {
    onSelectClose();
  }, [selectedItem]);

  useEffect(() => {
    if (submitLoading) {
      setTimeout(() => {
        setSubmitLoading(false);
      }, 1000);
      setTimeout(() => {
        onClose();
      }, 500);
    }
  }, [submitLoading]);

  useOutsideClick({
    ref: optionsMenuRef,
    handler: () => onSelectClose(),
  });

  const { white_or_black, orange300_or_orange300, gray_or_white, gray50_or_whiteAlpha200, gray100_or_gray700, gray100_or_whiteAlpha300, primary100_or_primary500, primary500_or_primary300, primary700_or_primary200, blackAlpha50_or_whiteAlpha50, blackAlpha100_or_whiteAlpha100, blackAlpha200_or_whiteAlpha200, blackAlpha200_or_whiteAlpha400, blackAlpha300_or_whiteAlpha300, blackAlpha300_or_whiteAlpha600, blackAlpha400_or_whiteAlpha400, blackAlpha400_or_whiteAlpha500, blackAlpha400_or_whiteAlpha600, blackAlpha500_or_whiteAlpha600, blackAlpha600_or_whiteAlpha600, blackAlpha700_or_whiteAlpha700, blackAlpha800_or_whiteAlpha800, blackAlpha800_or_whiteAlpha900, whiteAlpha500_or_whiteAlpha50, blackAlpha900_or_whiteAlpha900, color1, color2, color3, color4, color5 } = UseCustomColors();

  return (
        <Flex align="center" justify="center" p={6}>
          <Box
            bg={blackAlpha50_or_whiteAlpha50}
            borderRadius="2xl"
            maxW={{ base: "full", md: "2xl" }}
            w="full"
            p={6}
          >
        <Flex justify="space-between" align="center" mb={8}>
            <Heading size="lg">Mint</Heading>
        </Flex>
        <Box position="relative">
          <Box ref={optionsMenuRef}>
            <AvailableCoin selectIsOpen={selectIsOpen} selectedItem={selectedItem} text={"deposited"}/>
            <Box
              position="absolute"
              zIndex={2000}
              bg={useColorModeValue("gray.100", "gray.700")}
              boxShadow={
                selectIsOpen
                  ? "0 12px 20px -8px rgba(105, 88, 164, 0.5)"
                  : "none"
              }
              borderRadius="0 0 0.75rem 0.75rem"
              mt={-4}
              left={0}
              right={0}
              px={{ base: 4, md: 6 }}
            >
              <Collapse in={selectIsOpen} animateOpacity>
                <Box pt={8} pb={4}>
                  <SelectOptions
                    data={data}
                    selectedItem={selectedItem}
                    setSelectedItem={setSelectedItem}
                  />
                </Box>
              </Collapse>
            </Box>
          </Box>
        </Box>
        <Box mx={-6} my={6}>
          <Divider />
        </Box>
        <Rate
            fromItem={{label: 'fyUSDC', value: "2.3"}}
            toItem={{label: 'USDC', value: "3.4"}}
            tokenInputValue={"47.34432"}
        />
        <Box mx={-6} my={6}>
          <Divider />
        </Box>
        <Box>
          <Text
            fontSize="lg"
            fontWeight="semibold"
            color={useColorModeValue("blackAlpha.700", "whiteAlpha.700")}
            mb={4}
          >
            Amount to Borrow
          </Text>
          <NumberInput
            size="lg"
            display="flex"
            alignItems="center"
            defaultValue={0}
            value={inputValue}
            bg={useColorModeValue("whiteAlpha.500", "whiteAlpha.50")}
            min={0}
            max={parseFloat(selectedItem.available)}
            onChange={(value) => setInputValue(value)}
          >
            <NumberInputField
              fontWeight="semibold"
              letterSpacing="wide"
              textAlign="end"
            />
            <Stack isInline={true} position="absolute" zIndex={5} left={4}>
              <Button
                colorScheme="primary"
                size="xs"
                ml={2}
                _focus={{ outline: "none" }}
                onClick={() => setInputValue(selectedItem.available)}
              >
                MAX
              </Button>
              <Button
                colorScheme="primary"
                size="xs"
                ml={2}
                _focus={{ outline: "none" }}
                onClick={() =>
                  setInputValue(
                    (parseFloat(selectedItem.available) / 2).toString()
                  )
                }
              >
                1/2
              </Button>
            </Stack>
          </NumberInput>
          </Box>
          <Box mx={-6} my={6}>
            <Divider />
          </Box>
          <Box px={{ base: 4, md: 16 }}>
            <Button
              colorScheme="primary"
              w="full"
              h={14}
              isDisabled={inputValue === "0" ? true : false}
            >
              Mint
            </Button>
          </Box>
        </Box>
      </Flex>
  );
};

export default function Mint () {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box position="relative" w="full" h="800px" mx="auto">
      <WithdrawTokens showIcon={true} isOpen={true} onClose={onClose} />
    </Box>
  );
}