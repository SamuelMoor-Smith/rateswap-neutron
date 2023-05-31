import { CosmWasmClient, SigningCosmWasmClient, ExecuteResult } from "@cosmjs/cosmwasm-stargate";
import { ChainContext, Wallet } from "@cosmos-kit/core";
import { Chain } from "@chain-registry/types"
import { useChain, useChainWallet } from "@cosmos-kit/react";
import * as client from "../contracts/Contracts/order_book_for_ts/ts/Sg721.client"
import * as types from "../contracts/Contracts/order_book_for_ts/ts/Sg721.types"
import { fyUSDC_CONTRACT_ADDRESS, ORDER_BOOK_CONTRACT_ADDRESS, TESTNET_RPC } from "./constants";
import { CHAIN_NAME } from "../pages/_app";
import { GasPrice, calculateFee } from '@cosmjs/stargate'
import { Uint128 } from "../contracts/Contracts/fyUSDC/ts/Sg721.types";

let Q_CLIENT: client.Sg721QueryClient | null = null;
let X_CLIENT: client.Sg721Client | null = null;

export const CosmosService = (wallet: Wallet | undefined) => {
    if (wallet) {
        const chain = useChain(CHAIN_NAME);
        const walletManager = useChainWallet(CHAIN_NAME, wallet.name);
        const {
            estimateFee,
            getCosmWasmClient,
            getSigningCosmWasmClient,
            address,
        } = walletManager;

        async function getFyUSDCQueryClient() {
            const CW_CLIENT = await getCosmWasmClient()
            if (!Q_CLIENT) {
                Q_CLIENT = new client.Sg721QueryClient(CW_CLIENT, ORDER_BOOK_CONTRACT_ADDRESS)
            }
            return Q_CLIENT;
        }

        async function getOrderBookCLient() {
            const SCW_CLIENT = await getSigningCosmWasmClient()
            if (!X_CLIENT) {
                X_CLIENT = new client.Sg721Client(SCW_CLIENT, address!, ORDER_BOOK_CONTRACT_ADDRESS)
            }
            return X_CLIENT;
        }

        async function getOrderBook() {
            const Q_CLIENT = await getFyUSDCQueryClient();
            let orderBook = await Q_CLIENT.getOrderbook()
            // console.log(orderBook);
            return orderBook;
        }

        async function getAllBuyOrders() {
            const orderBook = await getOrderBook();
            let allBuyOrders = [];
            
            for (let bucket of orderBook.order_bucket) {
                for(let bid of bucket.bids) {
                    allBuyOrders.push(bid);
                }
            }
            
            return allBuyOrders;
        }

        async function getAllSellOrders() {
            const orderBook = await getOrderBook();
            let allSellOrders = [];
            
            for (let bucket of orderBook.order_bucket) {
                for(let ask of bucket.asks) {
                    allSellOrders.push(ask);
                }
            }
            
            return allSellOrders;
        }

        async function getMyBuyOrders() {
            const orderBook = await getOrderBook();
            let myBuyOrders = [];
            
            for (let bucket of orderBook.order_bucket) {
                for(let bid of bucket.bids) {
                    if (bid.orderer === address) {
                        myBuyOrders.push(bid);
                    }
                }
            }
            
            return myBuyOrders;
        }
        
        async function getMySellOrders() {
            const orderBook = await getOrderBook();
            let mySellOrders = [];
            
            for (let bucket of orderBook.order_bucket) {
                for(let ask of bucket.asks) {
                    if (ask.orderer === address) {
                        mySellOrders.push(ask);
                    }
                }
            }
            
            return mySellOrders;
        }

        async function cancelSellOrder(id: string, price: string) {
            const X_CLIENT = await getOrderBookCLient();

            let cancelAsk = await X_CLIENT.cancelAsk({
                "orderId": id,
                "price": price
            }, calculateFee(500000, GasPrice.fromString("0.01untrn")));
            console.log(cancelAsk);
            return cancelAsk;
        }
        
        

        return { getOrderBook, getAllBuyOrders, getAllSellOrders, getMyBuyOrders, getMySellOrders, cancelSellOrder };
    } else {
        return {};
    }
}

// export async function placeBuyOrder() {
//     const CW_CLIENT = await getCosmWasmClient()


// }
