import axios from 'axios';
import Caver from 'caver-js';
import { caverAPIConn, axiosAPiHeaders, feePayerAddress, feePayerPrivateKey, nftContractAddress } from 'src/connections/default';

export class ContractApi {
  static caver = new Caver(
    new Caver.providers.HttpProvider(
      'https://node-api.klaytnapi.com/v1/klaytn',
      caverAPIConn,
    ),
  );

  static async createMultisigKeyring(size: number) {
    const createKeyring = await this.caver.wallet.keyring.generate();
    console.log(JSON.stringify(createKeyring.address));
    console.log(JSON.stringify(createKeyring.key.privateKey));
    const senderKeyring = await this.caver.wallet.keyring.create(createKeyring.address, createKeyring.key.privateKey);
    await this.caver.wallet.add(senderKeyring);
    // Add Fee Payer Account To Wallet
    const feePayerKeyring = await this.caver.wallet.keyring.create(feePayerAddress, feePayerPrivateKey);
    await this.caver.wallet.remove(feePayerAddress);
    await this.caver.wallet.add(feePayerKeyring);
    
    console.log(JSON.stringify(senderKeyring));
    const keyring = await this.caver.wallet.keyring.generateMultipleKeys(size);
    const newKeyring = await this.caver.wallet.keyring.create(senderKeyring.address, keyring);
    const account = await newKeyring.toAccount({ threshold: size, weights: Array.from({length: size}, () => 1) });

    const feeDelegatedAccountUpdate = this.caver.transaction.feeDelegatedAccountUpdate.create({
        from: senderKeyring.address,
        account: account,
        gas: 10000000,
        feePayer: feePayerAddress
    });
    console.log(`[creteKeyings] ===> feeDelegatedAccountUpdate Created`);
    
    await this.caver.wallet.signAsFeePayer(feePayerAddress, feeDelegatedAccountUpdate);
    console.log(`[creteKeyings] ===> signAsFeePayer : feeDelegatedAccountUpdate`);

    await this.caver.wallet.sign(senderKeyring.address, feeDelegatedAccountUpdate);
    console.log(`[creteKeyings] ===> sign : feeDelegatedAccountUpdate`);

    const receipt = await this.caver.rpc.klay.sendRawTransaction(feeDelegatedAccountUpdate);
    const accountKey = await this.caver.rpc.klay.getAccountKey(senderKeyring.address);
    console.log(`Result of account key update to AccountKeyWeightedMultiSig`);
    console.log(`Account address: ${senderKeyring.address}`);
    console.log(`accountKey =>`);
    console.log(accountKey);

    // Update keyring with new private key in in-memory wallet
    await this.caver.wallet.updateKeyring(newKeyring);
    console.log(`account =>`);
    console.log(JSON.stringify(account));
    console.log(`newKeyring =>`);
    console.log(JSON.stringify(newKeyring));

    let account_pirvate_arr: Array<string> = [];
    let account_addresse_arr: Array<string> = [];

    account_addresse_arr.push(account.address);
    for (let idx = 0; idx < size; idx++)
      account_addresse_arr.push(newKeyring.address);
    account_pirvate_arr.push(createKeyring.key.privateKey);
    for (let idx = 0; idx < size; idx++)
      account_pirvate_arr.push(newKeyring.keys[idx].privateKey);

    // Remove From In Memory
    await this.caver.wallet.remove(feePayerAddress);
    for (let idx = 0; idx < size + 1; idx++)
      await this.caver.wallet.remove(account_addresse_arr[idx]);

    return [account_pirvate_arr, account_addresse_arr];
  }

  static async postTx(token_id: string, meta_data: string, address: string, privateKey: string, user_addr: string, multisigKeys: string[]) {
    // Add To Wallet

    console.log("token_id : " + token_id);
    console.log("meta_data : " + meta_data);
    console.log("address : " + address);
    console.log("privateKey : " + privateKey);
    console.log("user_addr : " + user_addr);
    
    /*
    token_id : 0x9ae75d441e8a460686f91bcb2f838293
    meta_data : {"id":"1","crt_dttm":"2022-02-23T15:38:15.000Z","user_addr":"0x2058a750ea824841e991ef386c3aD63D088303B5","title":"Title Example String","ctnt":"Content Example String","date":"2022-02-23","time":"","location":"Location Example String","head_count":5,"signs":[{"sign_dttm":"2022-02-23T16:03:20.000Z","user_addr":"1"},{"sign_dttm":"2022-02-23T16:03:32.000Z","user_addr":"2"},{"sign_dttm":"2022-02-23T16:03:37.000Z","user_addr":"3"},{"sign_dttm":"2022-02-23T16:03:41.000Z","user_addr":"4"},{"sign_dttm":"2022-02-23T16:03:44.000Z","user_addr":"5"}]}
    address : 0xf77dbd2479177f318365e25ae33767ca86b9bb6a
    privateKey : 0xc26499c48888f2e55ee7d147592d851a6a0173ededbc269943d01ec02d173bc7
    user_addr : 0x2058a750ea824841e991ef386c3aD63D088303B5
    */
  
    const senderKeyring = await this.caver.wallet.keyring.create(address, privateKey);
    //const feePayerKeyring = await this.caver.wallet.keyring.create(feePayerAddress, feePayerPrivateKey);
    const feePayerKeyring = await this.caver.wallet.newKeyring(feePayerAddress, feePayerPrivateKey);

    await this.caver.wallet.remove(address);
    await this.caver.wallet.add(senderKeyring);    
    
    // (1) Create Transaction (User Transaction) 
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

    const senderTransaction = this.caver.transaction.feeDelegatedSmartContractExecution.create({
        from: address,
        to: nftContractAddress ,
        feePayer: feePayerKeyring.address,
        input: input,
        gas: 1000000,        
    });

    console.log("Check 1111");

    // todo refactoring
    // Get Multisig Key    
    const multipleKeyring = this.caver.wallet.keyring.create(senderKeyring.address, multisigKeys);
    console.log("Check 2222");
    this.caver.wallet.updateKeyring(multipleKeyring);
    console.log("Check 3333");
    // end

    // (2) Create rawTransaction 
    await this.caver.wallet.signAsFeePayer(feePayerKeyring.address, senderTransaction);
    console.log(`[postTx] ===> signAsFeePayer : feeDelegatedSmartContractExecution`);

    await this.caver.wallet.sign(address, senderTransaction);
    console.log(`[postTx] ===> sign : feeDelegatedSmartContractExecution`);

    const receipt = await this.caver.rpc.klay.sendRawTransaction(senderTransaction);
    console.log(`\receipt ==========> `)
    console.log(receipt)

    // Remove From Wallet
    await this.caver.wallet.remove(address);    

    return receipt;         
  }
}
