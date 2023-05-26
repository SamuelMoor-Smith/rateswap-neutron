import { Box, useColorModeValue, Flex, Text, Image } from "@chakra-ui/react";
import { OptionBase } from "chakra-react-select";

interface DataType extends OptionBase {
    label: string;
    display: string;
    value: string;
    imgSrc: string;
    available: string;
}

interface AvailableCoinProps {
    selectIsOpen: boolean;
    selectedItem: DataType;
    text: string;
}

export const AvailableCoin = ({ selectIsOpen, selectedItem, text }: AvailableCoinProps) => {
    return (
        <Box
            as="div"
            display="flex"
            zIndex={2500}
            justifyContent="start"
            alignItems="center"
            h="fit-content"
            p={4}
            w="full"
            borderRadius="xl"
            boxShadow={selectIsOpen ? "base" : "none"}
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
                <Image src={selectedItem.imgSrc} />
              </Box>
              <Box flex={1} textAlign="start" mx={{ base: 2, md: 4 }}>
                <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="bold">
                  {selectedItem.label}
                </Text>
                <Flex flexDirection={{ base: "column", md: "row" }}>
                  <Text fontSize={{ base: "lg", md: "xl" }}>
                    {selectedItem.available}&ensp;
                  </Text>
                  <Text
                    fontSize={{ base: "sm", md: "xl" }}
                    color={useColorModeValue(
                      "blackAlpha.600",
                      "whiteAlpha.600"
                    )}
                  >
                    {text}
                  </Text>
                </Flex>
              </Box>
            </Box>
    );
}