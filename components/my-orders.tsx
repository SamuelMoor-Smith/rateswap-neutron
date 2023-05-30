import React, { useEffect, useState } from 'react';
import { Box, Table, Thead, Tbody, Tr, Th, Td, Switch, useColorModeValue, IconButton } from '@chakra-ui/react';
import { OrderType } from './order-type';
import { CloseIcon } from '@chakra-ui/icons';
import { Wallet } from '@cosmos-kit/core';
import { CosmosService } from '../api/order-book-contract';
import { useChain } from '@cosmos-kit/react';
import { CHAIN_NAME } from '../pages/_app';

const mockData = {
    [OrderType.BUY]: [
        { price: 1, size: 120},
        { price: 0.96, size: 40},
        { price: 0.935, size: 50},
        { price: 0.81, size: 80},
        { price: 0.805, size: 90},
        { price: 0.88, size: 60},
        { price: 0.865, size: 40},
        { price: 0.85, size: 33},
        { price: 0.705, size: 20},
        { price: 0.7, size: 80},
        { price: 0.6, size: 70},
        { price: 0.51, size: 60},
        { price: 0.505, size: 40},
        { price: 0.5, size: 10},
    ],
    [OrderType.SELL]: [
        { price: 0.5, size: 10},
        { price: 0.505, size: 40},
        { price: 0.51, size: 60},
        { price: 0.6, size: 70},
        { price: 0.7, size: 80},
        { price: 0.705, size: 20},
        { price: 0.85, size: 33},
        { price: 0.865, size: 40},
        { price: 0.88, size: 60},
        { price: 0.805, size: 90},
        { price: 0.81, size: 80},
        { price: 0.935, size: 50},
        { price: 0.96, size: 40},
        { price: 1, size: 120},
    ],
};

export function MyOrders({ orderType }: { orderType: OrderType }) {
    const color = useColorModeValue(orderType === OrderType.BUY ? "green.500" : "red.500", orderType === OrderType.BUY ? "green.200" : "red.200");

    const handleCancelOrder = (orderIndex: number) => {
        // put your cancel order logic here
        console.log(`Order at index ${orderIndex} is cancelled`);
    };

    const { connect, openView, status, username, address, message, wallet } =
    useChain(CHAIN_NAME);

    const { getOrderBook, getMySellOrders } = CosmosService(wallet as Wallet);

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
            getMySellOrders().then((sellOrders) => {
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
    }, [getOrderBook, getMySellOrders, orderType]);

    return (
        <Box w="100%" bg="transparent">
            <Table variant="unstyled" size="sm">
                {orderType === OrderType.BUY && <Thead>
                    <Tr>
                        <Th color={color} fontWeight="bold" width="25%">Price (USDC)</Th>
                        <Th color={color} fontWeight="bold" width="25%">Size (fyUSDC)</Th>
                        <Th color={color} fontWeight="bold" width="25%">Total (USDC)</Th>
                        <Th width="25%"></Th>  {/* Added new header for cancel button */}
                    </Tr>
                </Thead>}
            </Table>
            <Box w="100%" bg="transparent" maxHeight="200px" overflowY="auto">
                <Table variant="unstyled" size="sm">
                    <Tbody>
                        {orderData[orderType].map((order, index) => (
                            <Tr key={index}>
                                <Td color={color} width="25%">{order.price}</Td>
                                <Td color={color} width="25%">{order.size}</Td>
                                <Td color={color} width="25%">{(order.price * order.size).toFixed(2)}</Td>
                                <Td width="25%">
                                    {/* Added cancel button with red X */}
                                    <IconButton 
                                        aria-label="Cancel Order"
                                        icon={<CloseIcon />} 
                                        colorScheme="red" 
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleCancelOrder(index)}
                                    />
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </Box>
            {orderType === OrderType.SELL && <Table variant="unstyled" size="sm">
                <Thead>
                    <Tr>
                        <Th color={color} fontWeight="bold" width="25%">Price (USDC)</Th>
                        <Th color={color} fontWeight="bold" width="25%">Size (fyUSDC)</Th>
                        <Th color={color} fontWeight="bold" width="25%">Total (USDC)</Th>
                        <Th width="25%"></Th>  {/* Added new header for cancel button */}
                    </Tr>
                </Thead>
            </Table>}
        </Box>
    );
}