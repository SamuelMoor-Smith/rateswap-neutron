import React, { useState } from 'react';
import { Box, Input, InputGroup, InputRightAddon, Button, Text, useColorModeValue, Stack } from '@chakra-ui/react';
import { OrderType } from './order-type';
import { CHAIN_NAME } from '../pages/_app';
import { CosmosService } from '../api/fyUSDC-contract';
import { useChain } from '@cosmos-kit/react';
import { Wallet } from '@cosmos-kit/core';

function PlaceBids({ orderType }: { orderType: OrderType }) {
    const [limit, setLimit] = useState('');
    const [amount, setAmount] = useState('');

    const { connect, openView, status, username, address, message, wallet } =
    useChain(CHAIN_NAME);

    const { placeBuyOrder, placeSellOrder } = CosmosService(wallet as Wallet);
    
    const handleLimitChange = (event: { target: { value: React.SetStateAction<string>; }; }) => setLimit(event.target.value);
    const handleAmountChange = (event: { target: { value: React.SetStateAction<string>; }; }) => setAmount(event.target.value);
    
    const total = Number(limit) * Number(amount);
    
    const color = useColorModeValue(orderType === OrderType.BUY ? "green.500" : "red.500", orderType === OrderType.BUY ? "green.200" : "red.200");
    const colorScheme = orderType === OrderType.BUY ? "green" : "red";

    return (
        <Box w="100%" p={10}>
            <InputGroup>
                <Input placeholder="Limit" value={limit} onChange={handleLimitChange} />
                <InputRightAddon width="10em" justifyContent="right">
                <Stack isInline={true} position="absolute" zIndex={5}>
                    <Button
                        colorScheme="primary"
                        size="xs"
                        ml={2}
                        _focus={{ outline: "none" }}
                        // onClick={() => setInputValue(selectedItem.available)}
                    >
                        MAX
                    </Button>
                    <Button
                        colorScheme="primary"
                        size="xs"
                        ml={2}
                        _focus={{ outline: "none" }}
                        // onClick={() =>
                        // setInputValue(
                        //     (parseFloat(selectedItem.available) / 2).toString()
                        // )
                        // }
                    >
                        1/2
                    </Button>
                    <Text width="2.5em" justifyContent="right">USDC</Text>
                    </Stack>
                </InputRightAddon>
            </InputGroup>

            <InputGroup mt={5}>
                <Input placeholder="Amount" value={amount} onChange={handleAmountChange} />
                <InputRightAddon width="10em" justifyContent="right">
                <Stack isInline={true} position="absolute" zIndex={5}>
                    <Button
                        colorScheme="primary"
                        size="xs"
                        ml={2}
                        _focus={{ outline: "none" }}
                        // onClick={() => setInputValue(selectedItem.available)}
                    >
                        MAX
                    </Button>
                    <Button
                        colorScheme="primary"
                        size="xs"
                        ml={2}
                        _focus={{ outline: "none" }}
                        // onClick={() =>
                        // setInputValue(
                        //     (parseFloat(selectedItem.available) / 2).toString()
                        // )
                        // }
                    >
                        1/2
                    </Button>
                    <Text width="2.5em" justifyContent="right">fyUSDC</Text>
                    </Stack>
                    </InputRightAddon>
            </InputGroup>

            <Box mt={5}>
                <Text color={color}>Trade: {isNaN(total) ? 0 : `${amount} fyUSDC for ${total.toFixed(2)} USDC`}</Text>
            </Box>

            <Button
              colorScheme={colorScheme}
              w="full"
              h={14}
              mt={5}
              onClick={() => {
                orderType === OrderType.BUY ? 
                    placeBuyOrder!(amount.toString(), amount.toString(), limit.toString()) :
                    placeSellOrder!(amount.toString(), amount.toString(), limit.toString())
                }
              }
            >
              {orderType === OrderType.BUY ? 'Place Buy Order' : 'Place Sell Order'}
            </Button>
        </Box>
    );
}

export default PlaceBids;
