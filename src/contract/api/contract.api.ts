import axios from 'axios';

export class ContractApiService {
    static async createAccout() {
        const result = await axios.post(`https://wallet-api.klaytnapi.com/v2/account`);
        return result;
    }

    static async postKlaytnAccount() {
        const result = await axios.post('https://wallet-api.klaytnapi.com/v2/account');
        console.log(result.data);
        return result;
    }

    static async putMultisigKlaytnAccount(address: string, threshold: number, weightedKeys: Array<string>) {
        const result = await axios.put(`https://wallet-api.klaytnapi.com/v2/tx/fd-user/account`); // Fee Payer
        //const result = await axios.put(`https://wallet-api.klaytnapi.com/v2/account/${address}/multisig`);
        return result;
    }

    static async postTx() {
        // Caver Code Add Need.
    }

    static async signTxId(address: string, txId: string) {
        const result = await axios.post(`https://wallet-api.klaytnapi.com/v2/account/${address}/tx/${txId}/sign`);
        console.log(result.data);
        return result;
    }
}