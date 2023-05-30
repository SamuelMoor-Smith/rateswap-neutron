import { CosmWasmClient, SigningCosmWasmClient, ExecuteResult } from "@cosmjs/cosmwasm-stargate";
import { ChainContext, Wallet } from "@cosmos-kit/core";
import { Chain } from "@chain-registry/types"
import { useChain, useChainWallet } from "@cosmos-kit/react";
import * as client from "../contracts/Contracts/fyUSDC/ts/Sg721.client"
import * as types from "../contracts/Contracts/fyUSDC/ts/Sg721.types"
import { fyUSDC_CONTRACT_ADDRESS, ORDER_BOOK_CONTRACT_ADDRESS, TESTNET_RPC } from "./constants";
import { CHAIN_NAME } from "../pages/_app";
import { GasPrice, calculateFee } from '@cosmjs/stargate'

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

        // console.log(chain);

        // async function getSigningCosmWasmClient() {
        //     const offlineSigner = walletManager.getOfflineSigner();
        //     return await SigningCosmWasmClient.connectWithSigner(TESTNET_RPC, offlineSigner);
        // }

        async function getFyUSDCQueryClient() {
            const CW_CLIENT = await getCosmWasmClient()
            if (!Q_CLIENT) {
                Q_CLIENT = new client.Sg721QueryClient(CW_CLIENT, fyUSDC_CONTRACT_ADDRESS)
            }
            return Q_CLIENT;
        }

        async function getFyUSDCCLient() {
            const SCW_CLIENT = await getSigningCosmWasmClient()
            if (!X_CLIENT) {
                X_CLIENT = new client.Sg721Client(SCW_CLIENT, address!, fyUSDC_CONTRACT_ADDRESS)
            }
            return X_CLIENT;
        }

        async function checkBalance(address: string) {
            const Q_CLIENT = await getFyUSDCQueryClient();
            let balance = await Q_CLIENT.balance({"address": address});
            console.log(balance);
            return balance;
        }

        async function placeBuyOrder(amount: string, quantity: string, price: string) {
            const X_CLIENT = await getFyUSDCCLient();

            const msg_string = `{"create_bid":{"quantity":"${quantity}","price":"${price}","orderer":"${address!}"}}`;
            const msg = Buffer.from(msg_string).toString('base64');

            let buyOrder = await X_CLIENT.send({
                "amount": amount, 
                "contract": ORDER_BOOK_CONTRACT_ADDRESS, 
                "msg": msg}, calculateFee(500000, GasPrice.fromString("0.01untrn")));
            console.log(buyOrder);
            return buyOrder;
        }

        async function placeSellOrder(amount: string, quantity: string, price: string) {
            const X_CLIENT = await getFyUSDCCLient();

            const msg_string = `{"create_ask":{"quantity":"${quantity}","price":"${price}","orderer":"${address!}"}}`;
            const msg = Buffer.from(msg_string).toString('base64');

            let buyOrder = await X_CLIENT.send({
                "amount": amount, 
                "contract": ORDER_BOOK_CONTRACT_ADDRESS, 
                "msg": msg}, calculateFee(500000, GasPrice.fromString("0.01untrn")));
            console.log(buyOrder);
            return buyOrder;
        }

        return { placeBuyOrder, placeSellOrder, checkBalance };
    } else {
        return {};
    }
}

// export async function placeBuyOrder() {
//     const CW_CLIENT = await getCosmWasmClient()


// }
