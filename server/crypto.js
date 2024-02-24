const {
    Account,
    Aptos,
    AptosConfig,
    parseTypeTag,
    Network,
    AccountAddress,
    U64,
    Ed25519PrivateKey
} = require("@aptos-labs/ts-sdk");

const fs = require("fs");

export const APTOS_COIN = "0x1::aptos_coin::AptosCoin";
export const COIN_STORE = `0x1::coin::CoinStore<${APTOS_COIN}>`;

const config = new AptosConfig({ network: Network.DEVNET });
export const sdk = new Aptos(config);

const serverPK = fs.readFileSync("./server/server_pk.pem");
export const serverAccount = getAccount(serverPK);

export function getAccount(pk) {
    return Account.fromPrivateKey({
        privateKey: new Ed25519PrivateKey(pk)
    })
}

export async function getBalance(account) {
    let balance = await sdk.getAccountResource({
        accountAddress: account.accountAddress,
        resourceType: COIN_STORE,
    });

    return Number(balance.coin.value);
}

export async function buildTransaction(senderAddress, recipientAddress, transferAmount) {
    return await sdk.transaction.build.simple({
        sender: senderAddress,
        data: {
            function: "0x1::coin::transfer",
            typeArguments: [parseTypeTag(APTOS_COIN)],
            functionArguments: [AccountAddress.from(recipientAddress), new U64(transferAmount)],
        },
    });
}

export async function executeTransaction(sender, transaction) {
    const committed = await sdk.signAndSubmitTransaction({
        signer: sender,
        transaction: transaction
    });

    return await sdk.waitForTransaction({
        transactionHash: committed.hash
    });
}
