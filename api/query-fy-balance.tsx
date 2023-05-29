import { CosmWasmClient, SigningCosmWasmClient, ExecuteResult } from "@cosmjs/cosmwasm-stargate";

import * as client from "../contracts/Contracts/fyUSDC/ts/Sg721.client"
import * as types from "../contracts/Contracts/fyUSDC/ts/Sg721.types"

// Query the blockchain
export async function getBlockchainHeight() {
    const CONTRACT_ADDRESS = "neutron12a0fhvqz930uugp9c94n8vsphhp7h0lzqvktjd6hnc5xhhmqufgskhmluw"
    const CW_CLIENT = await CosmWasmClient.connect("https://rpc-palvus.pion-1.ntrn.tech:443")     
    const blockHeight = await CW_CLIENT.getHeight();
    const Q_CLIENT = new client.Sg721QueryClient(CW_CLIENT, "neutron12a0fhvqz930uugp9c94n8vsphhp7h0lzqvktjd6hnc5xhhmqufgskhmluw")
    console.log("Current block height:", blockHeight);
    console.log(await Q_CLIENT.balance({"address": "neutron14ccagr85w8gn67j6thq0u8taqc3fz2szptx73t"}))
    console.log(await Q_CLIENT.balance({"address": "neutron1wmxm49yf8rwdkyv4wmphj8eskzpre0fut8qwt8"}))
}