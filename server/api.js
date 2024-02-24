import {
    serverAccount,
    getAccountByPrivate,
    buildTransaction,
    executeTransaction
} from "./crypto.mjs";
export const userMap = {};

const ENTRY_COST = 500;

export async function loginEndpoint(req, res) {
    const data = JSON.parse(req.body);

    userMap[data.id] = getAccountByPrivate(data.address);
}

export async function getEntryCostEndpoint(req, res) {
    res.send(JSON.stringify({
        entryCost: ENTRY_COST,
        gasCost: 994
    }));
}

export async function payEntryEndpoint(req, res) {
    const data = JSON.parse(req.body);

    const account = userMap[data.id];
    const txn = await buildTransaction(
        account.accountAddress,
        serverAccount.accountAddress,
        ENTRY_COST
    );

    const commit = await executeTransaction(account, txn);

    res.send(JSON.stringify({
        paymentSuccess: commit.success
    }));
}

export async function getWithdrawalTotalEndpoint(req, res) {
    const data = JSON.parse(req.body);
    const account = userMap[data.id];

    const withdrawAmount = 0; // TODO get user's game balance

    res.send(JSON.stringify({
        entryCost: withdrawAmount,
        gasCost: 994
    }));
}

export async function executeWithdrawalEndpoint(req, res) {
    const data = JSON.parse(req.body);
    const account = userMap[data.id];

    const withdrawAmount = 0; // TODO get user's game balance

    const txn = await buildTransaction(
        serverAccount.accountAddress,
        account.accountAddress,
        withdrawAmount
    );

    const commit = await executeTransaction(serverAccount, txn);

    res.send(JSON.stringify({
        paymentSuccess: commit.success
    }));
}