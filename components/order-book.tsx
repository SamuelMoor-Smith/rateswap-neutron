import React, { useEffect, useState } from 'react';
import { Box, Table, Thead, Tbody, Tr, Th, Td, Switch, useColorModeValue } from '@chakra-ui/react';
import { OrderType } from './order-type';
import { Wallet } from '@cosmos-kit/core';
import { useChain } from '@cosmos-kit/react';
import { CosmosService } from '../api/order-book-contract';
import { CHAIN_NAME } from '../pages/_app';
import { Decimal, Uint128 } from '../contracts/Contracts/order_book_for_ts/ts/Sg721.types';

const mockData = {
    [OrderType.BUY]: [
        { price: 0.05, size: 120},
        { price: 0.135, size: 40},
        { price: 0.17, size: 50},
        { price: 0.28, size: 80},
        { price: 0.3, size: 90},
        { price: 0.465, size: 60},
        { price: 0.5, size: 40},
    ],
    [OrderType.SELL]: [
    ],
};

export function OrderBook({ orderType }: { orderType: OrderType }) {
    const color = useColorModeValue(orderType === OrderType.BUY ? "green.500" : "red.500", orderType === OrderType.BUY ? "green.200" : "red.200");

    const { connect, openView, status, username, address, message, wallet } =
    useChain(CHAIN_NAME);

    const { getOrderBook, getAllSellOrders } = CosmosService(wallet as Wallet);

    interface OrderData {
        price: number;
        size: number;
      }
      
    const initialOrderData: Record<OrderType, OrderData[]> = {
        [OrderType.BUY]: mockData[OrderType.BUY],
        [OrderType.SELL]: mockData[OrderType.SELL],
    };
    
    const [orderData, setOrderData] = useState(initialOrderData);

    useEffect(() => {
        if (getOrderBook && orderType === OrderType.SELL) {
            getAllSellOrders().then((sellOrders) => {
                let sellOrderData: { [key: number]: number } = {};
    
                sellOrders.forEach((order) => {
                    const price = parseFloat(order.price);
                    const size = parseFloat(order.quantity);
    
                    if (sellOrderData[price]) {
                        sellOrderData[price] += size;
                    } else {
                        sellOrderData[price] = size;
                    }
                });
    
                let formattedSellOrderData = Object.entries(sellOrderData).map(([price, size]) => ({
                    price: parseFloat(price),
                    size: size,
                }));
    
                // Sort the array from low to high by the 'price' property
                formattedSellOrderData.sort((a, b) => a.price - b.price);
    
                setOrderData(prevState => ({...prevState, [OrderType.SELL]: formattedSellOrderData}));
            });
        }
    }, [getOrderBook, getAllSellOrders, orderType]);
    

    return (
        <Box w="100%" bg="transparent">
            <Table variant="unstyled" size="sm">
                {orderType === OrderType.BUY && 
                <Thead>
                    <Tr>
                        <Th color={color} fontWeight="bold" width="33%">Price (USDC)</Th>
                        <Th color={color} fontWeight="bold" width="33%">Size (fyUSDC)</Th>
                        <Th color={color} fontWeight="bold" width="33%">Total (USDC)</Th>
                    </Tr>
                </Thead>}
            </Table>
            <Box w="100%" bg="transparent" maxHeight="200px" overflowY="auto">
                <Table variant="unstyled" size="sm">
                    <Tbody>
                        {orderData[orderType].map((order, index) => (
                            <Tr key={index}>
                                <Td color={color} width="33%">{order.price}</Td>
                                <Td color={color} width="33%">{order.size}</Td>
                                <Td color={color} width="33%">{(order.price * order.size).toFixed(2)}</Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </Box>
            {orderType === OrderType.SELL && <Table variant="unstyled" size="sm">
                <Thead>
                    <Tr>
                        <Th color={color} fontWeight="bold" width="33%">Price (USDC)</Th>
                        <Th color={color} fontWeight="bold" width="33%">Size (fyUSDC)</Th>
                        <Th color={color} fontWeight="bold" width="33%">Total (USDC)</Th>
                    </Tr>
                </Thead>
            </Table>}
        </Box>
    );
}