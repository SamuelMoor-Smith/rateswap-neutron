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
    ],
    [OrderType.SELL]: [
    ],
};

export function MyOrders({ orderType }: { orderType: OrderType }) {
    const color = useColorModeValue(orderType === OrderType.BUY ? "green.500" : "red.500", orderType === OrderType.BUY ? "green.200" : "red.200");

    const { connect, openView, status, username, address, message, wallet } =
    useChain(CHAIN_NAME);

    const { getOrderBook, getMySellOrders, cancelSellOrder } = CosmosService(wallet as Wallet);

    interface OrderData {
        id?: string,
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
                let sellOrderData: { [key: number]: {
                    id: string,
                    amount: number
                } } = {};
    
                sellOrders.forEach((order) => {
                    const price = parseFloat(order.price);
                    const size = parseFloat(order.quantity);
    
                    if (sellOrderData[price]) {
                        sellOrderData[price].amount += size;
                    } else {
                        sellOrderData[price] = {id: order.id, amount: size};
                    }
                });
    
                let formattedSellOrderData = Object.entries(sellOrderData).map(([price, {id, amount}]) => ({
                    price: parseFloat(price),
                    id: id,
                    size: amount,
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
                                        onClick={() => {
                                            console.log("Order cancelled")
                                            if (order.id && cancelSellOrder) {
                                                return cancelSellOrder(order.id, order.price.toString())
                                            } else {
                                                return null;
                                            }
                                        }
                                    }
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