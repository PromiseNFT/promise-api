import axios from 'axios';
import Caver from 'caver-js';
import { caverAPIConn, axiosAPiHeaders, feePayerAddress, feePayerPrivateKey, nftContractAddress, GAS_LIMIT } from 'src/connections/default';

export class ContractApi {
  static caver = new Caver(
    new Caver.providers.HttpProvider(
      'https://node-api.klaytnapi.com/v1/klaytn',
      caverAPIConn,
    ),
  );

  static async createMultisigKeyring(size: number) : Promise<[string, string, string[]]> {
    const createKeyring = this.caver.wallet.keyring.generate();
    const senderKeyring = this.caver.wallet.keyring.create(createKeyring.address, createKeyring.key.privateKey);   
    let feePayerKeyring;
    try {
      feePayerKeyring = this.caver.wallet.keyring.create(feePayerAddress, feePayerPrivateKey);   
      this.caver.wallet.add(feePayerKeyring);  
    } catch (e) {
      this.caver.wallet.remove(feePayerAddress); 
      feePayerKeyring = this.caver.wallet.keyring.create(feePayerAddress, feePayerPrivateKey);   
      this.caver.wallet.add(feePayerKeyring);  
    } 
    
    this.caver.wallet.add(senderKeyring);    
    
    const keyring = this.caver.wallet.keyring.generateMultipleKeys(size);
    const newKeyring = this.caver.wallet.keyring.create(senderKeyring.address, keyring);
    const account = newKeyring.toAccount({ threshold: size, weights: Array.from({ length: size }, () => 1) });

    const feeDelegatedAccountUpdate = this.caver.transaction.feeDelegatedAccountUpdate.create({
        from: senderKeyring.address,
        account: account,
        gas: GAS_LIMIT,
        feePayer: feePayerKeyring.address
    });

    await this.caver.wallet.signAsFeePayer(feePayerAddress, feeDelegatedAccountUpdate);
    await this.caver.wallet.sign(senderKeyring.address, feeDelegatedAccountUpdate);    

    // todo Write transaction id in the database
    const receipt = await this.caver.rpc.klay.sendRawTransaction(feeDelegatedAccountUpdate);    
    console.log(receipt.transactionHash);
    
    // todo Check the status of the multisig wallet.
    const accountKey = await this.caver.rpc.klay.getAccountKey(senderKeyring.address);    
    if (accountKey.keyType == 4) {
      console.log('Multisig wallet');
    }
    
    let accountAddress = senderKeyring.address;    
    let accountPrivateKey = createKeyring.key.privateKey;  
    let accountMultisigKeys: Array<string> = [];

    for (let idx = 0; idx < size; idx++)
      accountMultisigKeys.push(newKeyring.keys[idx].privateKey);

    // Remove From In Memory Wallet
    this.caver.wallet.remove(senderKeyring.address);    

    return [accountAddress, accountPrivateKey, accountMultisigKeys];
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
  
    const senderKeyring = this.caver.wallet.keyring.create(address, privateKey);
    //const feePayerKeyring = await this.caver.wallet.keyring.create(feePayerAddress, feePayerPrivateKey);
    let feePayerKeyring;
    try {
      feePayerKeyring = this.caver.wallet.keyring.create(feePayerAddress, feePayerPrivateKey);   
      this.caver.wallet.add(feePayerKeyring);  
    } catch (e) {
      this.caver.wallet.remove(feePayerAddress); 
      feePayerKeyring = this.caver.wallet.keyring.create(feePayerAddress, feePayerPrivateKey); 
      this.caver.wallet.add(feePayerKeyring);    
    }

    this.caver.wallet.remove(address);
    this.caver.wallet.add(senderKeyring);    
    
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
        gas: GAS_LIMIT,        
    });

    console.log("[ContractApi - postTx] ===> Check 1111");

    // todo refactoring
    // Get Multisig Key    
    const multipleKeyring = this.caver.wallet.keyring.create(senderKeyring.address, multisigKeys);
    console.log("[ContractApi - postTx] ===> Check 2222");
    this.caver.wallet.updateKeyring(multipleKeyring);
    console.log("[ContractApi - postTx] ===> Check 3333");
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
    this.caver.wallet.remove(address);    

    return receipt;         
  }
}
