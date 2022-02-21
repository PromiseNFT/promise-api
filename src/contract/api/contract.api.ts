import axios from 'axios';
import Caver from 'caver-js';
import { caverAPIConn, feePayerAddress, nftContractAddress } from 'src/connections/default';

export class ContractApi {
  static caver = new Caver(
    new Caver.providers.HttpProvider(
      'https://node-api.klaytnapi.com/v1/klaytn',
      caverAPIConn,
    ),
  );

  static async createAccount() {
    const result = await axios.post(
      `https://wallet-api.klaytnapi.com/v2/account`,
      null,
      caverAPIConn,
    );
    return result;
  }

  static async putMultisigKlaytnAccount(
    address: string,
    threshold: number,
    key_arr: Array<string>
  ) {
    // const result = await axios.put(`https://wallet-api.klaytnapi.com/v2/tx/fd-user/account`); // Fee Payer
    //const result = await axios.put(`https://wallet-api.klaytnapi.com/v2/account/${address}/multisig`);
    let weightedKeys = [];
    for (let idx = 1; idx < key_arr.length; idx++) {
      weightedKeys.push( {
        weight: 1,
        publicKey: key_arr[idx]
      } );
    }

    const result = await axios({
      method: 'put', 
      url: `https://wallet-api.klaytnapi.com/v2/tx/fd-user/account`, 
      headers: caverAPIConn,
      data: {
        from: address,
        feePayer: feePayerAddress,
        nonce: 0, 
        gas: 0,
        submit: true,
        accountKey: {
          keyType: 4,
          key: {
            threshold: threshold, 
            weightedKeys: weightedKeys
          }
        }
      }
    });

    return result.status < 300 && result.status >= 200;
  }

  static async postTx(token_id: string, user_addr: string, meta_data: string) {
    const input = this.caver.klay.abi.encodeFunctionCall({
        name: 'mintWithTokenURI',
        type: 'function',
        inputs: [{
            type: 'address',
            name: 'to'
        },{
            type: 'uint256',
            name: 'tokenId'
        },{
            type: 'tokenURI',
            name: 'tokenURI'
        }]
    }, [user_addr, token_id, meta_data]);

    const result = await axios({
      url: `https://wallet-api.klaytnapi.com/v2/tx/fd-user/contract/execute`,
      headers: caverAPIConn,
      data: {
        from: user_addr,
        value: '0x0',
        to: nftContractAddress,
        input: input,
        none: 0,
        gas: 0,
        submit: true,
        feePayer: feePayerAddress
      }
    });

    if (result.status < 300 && result.status >= 200)
      return result.data;
    else
      return null;
  }

  static async signTxId(address: string, txId: string) {
    const result = await axios.post(
      `https://wallet-api.klaytnapi.com/v2/multisig/account/${address}/tx/${txId}/sign`,
    );
    if (result.status < 300 && result.status >= 200)
      return result.data;
    else
      return null;
  }
}
