import axios from 'axios';
import Caver from 'caver-js';
import { caverAPIConn, axiosAPiHeaders, feePayerAddress, nftContractAddress } from 'src/connections/default';

export class ContractApi {
  static caver = new Caver(
    new Caver.providers.HttpProvider(
      'https://node-api.klaytnapi.com/v1/klaytn',
      caverAPIConn,
    ),
  );

  static async creteKeyings(size: number) {
    const createKeyring = await this.caver.wallet.keyring.generate();
    console.log(JSON.stringify(createKeyring.address));
    console.log(JSON.stringify(createKeyring.key.privateKey));
    const senderKeyring = await this.caver.wallet.keyring.create(createKeyring.address, createKeyring.key.privateKey);
    await this.caver.wallet.add(senderKeyring);
    const keyring = await this.caver.wallet.keyring.generateMultipleKeys(size);
    const newKeyring = await this.caver.wallet.keyring.create(senderKeyring.address, keyring);
    const account = await newKeyring.toAccount({ threshold: size, weights: Array.from({length: size}, () => 1) });

    const feeDelegatedAccountUpdate = this.caver.transaction.feeDelegatedAccountUpdate.create({
        from: senderKeyring.address,
        account: account,
        gas: 0,
        feePayer: feePayerAddress
    });
    
    await this.caver.wallet.sign(senderKeyring.address, feeDelegatedAccountUpdate);
    await this.caver.wallet.signAsFeePayer(feePayerAddress, feeDelegatedAccountUpdate);
    const receipt = await this.caver.rpc.klay.sendRawTransaction(feeDelegatedAccountUpdate);
    const accountKey = await this.caver.rpc.klay.getAccountKey(senderKeyring.address);
    console.log(`Result of account key update to AccountKeyWeightedMultiSig`);
    console.log(`Account address: ${senderKeyring.address}`);
    console.log(`accountKey =>`);
    console.log(accountKey);

    // Update keyring with new private key in in-memory wallet
    this.caver.wallet.updateKeyring(newKeyring);
    console.log(JSON.stringify(account));
    return account;
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
            type: 'string',
            name: 'tokenURI'
        }]
    }, [user_addr, token_id, meta_data]);
    console.log(input);

    const result = await axios({
      method: 'post',
      url: `https://wallet-api.klaytnapi.com/v2/tx/fd-user/contract/execute`,
      headers: axiosAPiHeaders,
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
    console.log('[Caver API] - post Tx');
    console.log(result.data);

    if (result.status < 300 && result.status >= 200)
      return result.data;
    else
      return null;
  }

  static async signTxId(address: string, txId: string) {
    const result = await axios.post(
      `https://wallet-api.klaytnapi.com/v2/multisig/account/${address}/tx/${txId}/sign`,
      null,
      { headers: axiosAPiHeaders },
    );
    if (result.status < 300 && result.status >= 200)
      return result.data;
    else
      return null;
  }
}
