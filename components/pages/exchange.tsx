import { Box, Divider, Flex, Heading, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import { OrderBook } from '../order-book';
import { UseCustomColors } from "../custom-colors";
import PlaceBids from '../place-bids';
import { OrderType } from '../order-type';
import { useState } from 'react';
import { MyOrders } from '../my-orders';

export default function Exchange() {
    
    const tabName = ["Buy", "Sell", "Cancel"];
    const [tabIndex, setTabIndex] = useState(0);

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
            <Heading size="lg">Order Book</Heading>
        </Flex>
        <OrderBook orderType={OrderType.BUY} />
        <Divider />
        <OrderBook orderType={OrderType.SELL} />
        <Tabs
            isFitted={true}
            colorScheme="primary"
            onChange={(index) => setTabIndex(index)}
            mt={6}
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
              <TabPanel>
                <PlaceBids orderType={OrderType.BUY} />
              </TabPanel>
              <TabPanel>
                <PlaceBids orderType={OrderType.SELL} />
              </TabPanel>
              <TabPanel>
                <Heading size="md" mb={5}>Your Orders</Heading>
                <MyOrders orderType={OrderType.BUY} />
                <Divider />
                <MyOrders orderType={OrderType.SELL} />
              </TabPanel>
            </TabPanels>
          </Tabs>
      </Box>
    </Flex>
  );
}
