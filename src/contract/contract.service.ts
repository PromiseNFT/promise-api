import { HttpException, Injectable } from '@nestjs/common';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Transaction } from 'typeorm';
import { Contract } from './entities/contract.entity';
import { ContractApi } from './api/contract.api';
import { ContractSign } from './entities/contract.sign.entity';
import { ContractTx } from './entities/contract.tx.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ContractService {
  constructor(
    @InjectRepository(Contract) private contractEntity: Repository<Contract>,
    @InjectRepository(ContractSign)
    private contractSignEntity: Repository<ContractSign>,
    @InjectRepository(ContractTx)
    private contractTxEntity: Repository<ContractTx>,
  ) {
    this.contractEntity = contractEntity;
    this.contractSignEntity = contractSignEntity;
    this.contractTxEntity = contractTxEntity;
  }

  async _createKASAccount(head_count: number) {
    // Make Multiple Accounts
    let account_key_arr: Array<string> = [];
    let account_addresse_arr: Array<string> = [];
    for (let idx = 0; idx < head_count + 1; idx++) {
      const account = await ContractApi.createAccount();
      account_addresse_arr.push(account.data.address);
      account_key_arr.push(account.data.publicKey);
    }
    return [account_key_arr, account_addresse_arr];
  }

  @Transaction()
  async _saveToDB(
    dto: UpdateContractDto,
    id: number,
    account_key_arr: Array<string>,
    account_addresse_arr: Array<string>
  ) {
    if (id !== null) await this.contractSignEntity.delete({ id: id });

    dto.account_addr = account_addresse_arr[0];
    dto.account_pub_key = account_key_arr[0];

    if (id === null) {
      // dto.crt_dttm = Date.now();
      id = (await this.contractEntity.insert(dto)).generatedMaps[0].id;
    } else {
      await this.contractEntity.update({ id: id }, dto);
    }

    for (let idx = 1; idx < dto.head_count + 1; idx++) {
      await this.contractSignEntity.insert({
        id: id,
        account_addr: account_addresse_arr[idx],
        account_pub_key: account_key_arr[idx],
      });
    }

    return id;
  }

  async create(createContractDto: CreateContractDto) {
    const [account_key_arr, account_addresse_arr] = await this._createKASAccount(
      createContractDto.head_count,
    );
    console.log('[Contract Service] ===> After Create Account');
    // Put Multisig
    if (
      !await ContractApi.putMultisigKlaytnAccount(
        account_addresse_arr[0],
        createContractDto.head_count,
        account_key_arr
      )
    )
      throw HttpException;

    // Save To DB ( + Sign DB )
    const id: number = await this._saveToDB(createContractDto, null, account_key_arr, account_addresse_arr);

    // Return Result
    return await this.findOne(id);
  }

  async findAll(user_addr: string) {
    // TODO Extract Contract That User Signed
    return await this.contractEntity.find({ 
      relations: ['signs'],
      where: [
        { user_addr: user_addr },
        { signs: {
          user_addr: user_addr,
        } }
      ]
    });
  }

  async findOne(id: number) {
    // TODO Retrun With Left Join Data
    return await this.contractEntity.findOne(id, { relations: ['signs', 'tx'] });
  }

  async update(id: number, updateContractDto: UpdateContractDto) {
    const [account_key_arr, account_addresse_arr] = await this._createKASAccount(
      updateContractDto.head_count,
    );

    // Put Multisig
    if (
      !await ContractApi.putMultisigKlaytnAccount(
        account_addresse_arr[0],
        updateContractDto.head_count,
        account_key_arr
      )
    )
      throw HttpException;

    // Save To DB ( + Sign DB )
    await this._saveToDB(updateContractDto, id, account_key_arr, account_addresse_arr);

    // Return Result
    return await this.findOne(id);
  }

  async remove(id: number, user_addr: string) {
    // Check Login Need & Tx Existence
    return await this.contractEntity.delete({ id: id, user_addr: user_addr });
  }

  async createSign(id: number, user_addr: string) {
    // Get Account Address
    const account_addr: string = (
      await this.contractSignEntity.findOne({ id: id, user_addr: null })
    ).account_addr;
    // Sign DB
    this.contractSignEntity.update(
      { id: id, account_addr: account_addr },
      { sign_dttm: Date.now(), user_addr: user_addr },
    );
    // Return Result
    return await this.contractSignEntity.find({ id: id });
  }

  async createTx(id: number, user_addr: string) {
    const db_data = await this.findOne(id);
    const toekn_id = '0x' + String(uuidv4()).replace('-', '');
    const meta_data: string = String(db_data);

    // Api Call (Fee Delegation)
    const tx_rslt = await ContractApi.postTx(toekn_id, db_data.user_addr, meta_data);
    if (tx_rslt === null)
      throw HttpException;
    
    let transactionHash = '';
    for (let idx = 0; idx < db_data.head_count; idx++) {
      // Api Sign
      const signRslt = await ContractApi.signTxId(db_data.user_addr, tx_rslt.transactionId);
      if (signRslt === null)
        throw HttpException;      
      if (idx + 1 == db_data.head_count)
        transactionHash = signRslt.transactionHash;
    }

    // Save To DB
    await this.contractTxEntity.insert( {id: id, tx_dttm: Date.now(), tx_hash: transactionHash, tx_id: tx_rslt.transactionId, token_id: toekn_id, meta_data: meta_data} );

    return await this.contractTxEntity.findOne( { id: id });
  }
}
