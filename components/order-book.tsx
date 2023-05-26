import React from 'react';
import { Box, Table, Thead, Tbody, Tr, Th, Td, Switch, useColorModeValue } from '@chakra-ui/react';
import { OrderType } from './order-type';

const mockData = {
    [OrderType.BUY]: [
        { price: 50000, size: 0.5, total: 25000 },
        { price: 51000, size: 0.4, total: 20400 },
        { price: 52000, size: 0.6, total: 31200 },
        { price: 50000, size: 0.5, total: 25000 },
        { price: 51000, size: 0.4, total: 20400 },
        { price: 52000, size: 0.6, total: 31200 },
        { price: 50000, size: 0.5, total: 25000 },
        { price: 51000, size: 0.4, total: 20400 },
        { price: 52000, size: 0.6, total: 31200 },
        { price: 50000, size: 0.5, total: 25000 },
        { price: 51000, size: 0.4, total: 20400 },
        { price: 52000, size: 0.6, total: 31200 },
        { price: 50000, size: 0.5, total: 25000 },
        { price: 51000, size: 0.4, total: 20400 },
        { price: 52000, size: 0.6, total: 31200 },
        { price: 50000, size: 0.5, total: 25000 },
        { price: 51000, size: 0.4, total: 20400 },
        { price: 52000, size: 0.6, total: 31200 },
        { price: 50000, size: 0.5, total: 25000 },
        { price: 51000, size: 0.4, total: 20400 },
        { price: 52000, size: 0.6, total: 31200 },
        { price: 50000, size: 0.5, total: 25000 },
        { price: 51000, size: 0.4, total: 20400 },
        { price: 52000, size: 0.6, total: 31200 },
    ],
    [OrderType.SELL]: [
        { price: 53000, size: 0.3, total: 15900 },
        { price: 54000, size: 0.7, total: 37800 },
        { price: 55000, size: 0.8, total: 44000 },
        { price: 50000, size: 0.5, total: 25000 },
        { price: 51000, size: 0.4, total: 20400 },
        { price: 52000, size: 0.6, total: 31200 },
        { price: 50000, size: 0.5, total: 25000 },
        { price: 51000, size: 0.4, total: 20400 },
        { price: 52000, size: 0.6, total: 31200 },
        { price: 50000, size: 0.5, total: 25000 },
        { price: 51000, size: 0.4, total: 20400 },
        { price: 52000, size: 0.6, total: 31200 },
        { price: 50000, size: 0.5, total: 25000 },
        { price: 51000, size: 0.4, total: 20400 },
        { price: 52000, size: 0.6, total: 31200 },
        { price: 50000, size: 0.5, total: 25000 },
        { price: 51000, size: 0.4, total: 20400 },
        { price: 52000, size: 0.6, total: 31200 },
        { price: 50000, size: 0.5, total: 25000 },
        { price: 51000, size: 0.4, total: 20400 },
        { price: 52000, size: 0.6, total: 31200 },
    ],
};

export function OrderBook({ orderType }: { orderType: OrderType }) {
    const color = useColorModeValue(orderType === OrderType.BUY ? "green.500" : "red.500", orderType === OrderType.BUY ? "green.200" : "red.200");

    return (
        <Box w="100%" bg="transparent" maxHeight="400px" overflowY="auto">
            <Table variant="unstyled" size="sm">
                <Thead>
                    <Tr>
                        <Th color={color} fontWeight="bold">Price (USDT)</Th>
                        <Th color={color} fontWeight="bold">Size (BTC)</Th>
                        <Th color={color} fontWeight="bold">Total (USDT)</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {mockData[orderType].map((order, index) => (
                        <Tr key={index}>
                            <Td color={color}>{order.price}</Td>
                            <Td color={color}>{order.size}</Td>
                            <Td color={color}>{order.total}</Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </Box>
    );
}