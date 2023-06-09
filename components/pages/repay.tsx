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
    label: "USD Coin",
    display: "USDC",
    value: "USD Coin",
    imgSrc: "https://raw.githubusercontent.com/cosmos/chain-registry/master/axelar/images/usdc.svg",
    available: "231",
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
            <Heading size="lg">Repay</Heading>
        </Flex>
        <Box position="relative">
          <Box ref={optionsMenuRef}>
            <AvailableCoin selectIsOpen={selectIsOpen} selectedItem={selectedItem} text={"due"}/>
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
            Amount to Repay
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
              Repay
            </Button>
          </Box>
        </Box>
      </Flex>
  );
};

export default function Repay () {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box position="relative" w="full" h="800px" mx="auto">
      <WithdrawTokens showIcon={true} isOpen={true} onClose={onClose} />
    </Box>
  );
}