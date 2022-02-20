import axios from 'axios';
import Caver from 'caver-js';
import { caverAPIConn, FeePayerAddress } from 'src/connections/default';

export class ContractApi {
    static caver = new Caver(new Caver.providers.HttpProvider("https://node-api.klaytnapi.com/v1/klaytn", null));

    static async createAccout() {
        const result = await axios.post(`https://wallet-api.klaytnapi.com/v2/account`, null, caverAPIConn);
        return result;
    }

    static async putMultisigKlaytnAccount(address: string, threshold: number, weightedKeys: Array<string>) {
        // const result = await axios.put(`https://wallet-api.klaytnapi.com/v2/tx/fd-user/account`); // Fee Payer
        //const result = await axios.put(`https://wallet-api.klaytnapi.com/v2/account/${address}/multisig`);
        const result = new this.caver.transaction.feeDelegatedAccountUpdate({
            from: address,
            feePayer: FeePayerAddress,
        });
        return true;
    }

    static async postTx() {
        // Caver Code Add Need.
        // With Fee Delegation
    }

    static async signTxId(address: string, txId: string) {
        const result = await axios.post(`https://wallet-api.klaytnapi.com/v2/account/${address}/tx/${txId}/sign`);
        return result.status < 300 && result.status >= 200;
    }
}