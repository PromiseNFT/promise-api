import axios from 'axios';

export class ContractApiService {
    async postKlaytnAccount() {
        const result = await axios.post('https://wallet-api.klaytnapi.com/v2/account');
        console.log(result.data);
        return result;
    }

    async putMultisigKlaytnAccount(address: string, threshold: number, weightedKeys: Array<string>) {
        const result = await axios.put(`https://wallet-api.klaytnapi.com/v2/account/${address}/multisig`);
        return result;
    }

    async postTx() {
        
    }

    async signTxId(address: string, txId: string) {
        const result = await axios.post(`https://wallet-api.klaytnapi.com/v2/account/${address}/tx/${txId}/sign`);
        console.log(result.data);
        return result;
    }
}