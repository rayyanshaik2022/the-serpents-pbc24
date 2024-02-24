import {
    Account,
    Aptos,
    AptosConfig,
    parseTypeTag,
    Network,
    AccountAddress,
    U64,
    Ed25519PrivateKey
} from "@aptos-labs/ts-sdk";

import * as fs from "fs";

export const APTOS_COIN = "0x1::aptos_coin::AptosCoin";
export const COIN_STORE = `0x1::coin::CoinStore<${APTOS_COIN}>`;

const config = new AptosConfig({ network: Network.DEVNET });
export const aptos = new Aptos(config);

const serverPK = fs.readFileSync("./server_pk.pem", { encoding: "utf-8"});
export const serverAccount = getAccountByPrivate(serverPK);

export function getAccountByPrivate(pk) {
    return Account.fromPrivateKey({
        privateKey: new Ed25519PrivateKey(pk)
    })
}

export async function getBalance(account) {
    let balance = await aptos.getAccountResource({
        accountAddress: account.accountAddress,
        resourceType: COIN_STORE,
    });

    return Number(balance.coin.value);
}

export async function checkGasPrice(senderAddress, recipientAddress, transferAmount) {
    const estimate = await aptos.getGasPriceEstimation();
    return estimate;
}


export async function buildTransaction(senderAddress, recipientAddress, transferAmount) {
    return await aptos.transferCoinTransaction({
        sender: senderAddress,
        recipient: recipientAddress,
        amount: new U64(transferAmount),
        coinType: APTOS_COIN
    });
}

export async function executeTransaction(sender, transaction) {
    const committed = await aptos.signAndSubmitTransaction({
        signer: sender,
        transaction: transaction
    });

    return await aptos.waitForTransaction({
        transactionHash: committed.hash
    });
}

const alice = Account.generate({scheme: 0});

const txn = await buildTransaction(
    serverAccount.accountAddress,
    alice.accountAddress,
    1
);

console.log(txn.rawTransaction.payload);

const c = await executeTransaction(serverAccount, txn);

console.log(c.gas_used);
