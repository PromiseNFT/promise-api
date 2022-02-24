import { HttpException, Injectable } from '@nestjs/common';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  async _createMultisigAccount(head_count: number) {
    // Make Multiple Accounts
    return await ContractApi.createMultisigKeyring(head_count);
  }

  // TODO Transaction Need
  async _saveToDB(
    dto: UpdateContractDto,
    id: number,
    account_pirvate_arr: Array<string>,
    account_addresse_arr: Array<string>
  ) {
    console.log('[Contract Service] ===> _saveToDB()');
    console.log(dto);
    console.log(id);
    console.log(account_pirvate_arr);
    console.log(account_addresse_arr);

    if (id !== null || id > 0) 
      await this.contractSignEntity.delete({ id: id });

    if (id === null || id < 0) {
      // dto.crt_dttm = Date.now();
      id = 
        (await this.contractEntity.insert( { user_addr: dto.user_addr, account_addr: account_addresse_arr[0], account_priv_key: account_pirvate_arr[0], title: dto.title, ctnt: dto.ctnt, date: dto.date, time: dto.time, location: dto.location, head_count: dto.head_count } )).generatedMaps[0].id;
    } else {
      await this.contractEntity.update({ id: id }, { account_addr: account_addresse_arr[0], account_priv_key: account_pirvate_arr[0], title: dto.title, ctnt: dto.ctnt, date: dto.date, time: dto.time, location: dto.location, head_count: dto.head_count });
    }

    for (let idx = 1; idx < dto.head_count + 1; idx++) {
      await this.contractSignEntity.insert({
        id: id,
        account_addr: account_addresse_arr[idx],
        account_priv_key: account_pirvate_arr[idx]
      });
    }

    return id;
  }

  async create(createContractDto: CreateContractDto) {
    console.log('[Contract Service] ===> Before Create Account');
    const [account_pirvate_arr, account_addresse_arr] = await this._createMultisigAccount(
      createContractDto.head_count,
    );
    console.log('[Contract Service] ===> After Create Account');
    console.log(account_pirvate_arr);
    console.log(account_addresse_arr);

    // Save To DB ( + Sign DB )
    console.log('[Contract Service] ===> Before _saveToDB()');
    console.log(account_pirvate_arr);
    console.log(account_addresse_arr);
    const id: number = await this._saveToDB(createContractDto, -1, account_pirvate_arr, account_addresse_arr);

    // Return Result
    return await this.findOne(id);
  }

  async findAll(user_addr: string) {
    // TODO Extract Contract That User Signed
    return await this.contractEntity.find({ 
      relations: ['signs'],
      where: [
        { user_addr: user_addr }, 
      ]
    });
    // return await this.contractEntity.find( {user_addr: user_addr} );
  }

  async findOne(id: number) {
    // TODO Retrun With Left Join Data
    // return await this.contractEntity.findOne(id, { relations: ['signs', 'tx'] });
    //return await this.contractEntity.findOne( {id: id} );
    return await this.contractEntity.findOne(id, { relations: ['signs', 'tx'] });
  }

  async update(id: number, updateContractDto: UpdateContractDto) {
    const [account_pirvate_arr, account_addresse_arr] = await this._createMultisigAccount(
      updateContractDto.head_count,
    );

    // Save To DB ( + Sign DB )
    await this._saveToDB(updateContractDto, id, account_pirvate_arr, account_addresse_arr);

    // Return Result
    return await this.findOne(id);
  }

  async remove(id: number, user_addr: string) {
    // Check Login Need & Tx Existence
    return await this.contractEntity.delete({ id: id, user_addr: user_addr });
  }

  async createSign(id: number, user_addr: string) {
    // Check Sign Duplication
    const result = await this.contractSignEntity.findOne({ id: id, user_addr: user_addr });
    console.log(JSON.stringify(result))
    if (result != null)
      throw HttpException;

    // Get Account Address
    const account_priv_key: string = 
      (await this.contractSignEntity.findOne({ id: id, user_addr: null })).account_priv_key;
    console.log(account_priv_key);
    // Sign DB
    await this.contractSignEntity.update(
      { id: id, account_priv_key: account_priv_key },
      { sign_dttm: new Date().toISOString(), user_addr: user_addr },
    );
    // Return Result
    return await this.contractSignEntity.find({ id: id });
  }

  async createTx(id: number, user_addr: string) {
    const db_data = await this.findOne(id);

    console.log(db_data);

    const token_id = '0x' + String(uuidv4()).replace(/-/g, '');
    let meta_data_map = {
      id: db_data.id,
      crt_dttm: db_data.crt_dttm,
      user_addr: db_data.user_addr,
      title: db_data.title,
      ctnt: db_data.ctnt,
      date: db_data.date,
      time: db_data.time,
      location: db_data.location,
      head_count: db_data.head_count,
      signs: []
    };//JSON.stringify(db_data);
    for (let idx = 0; idx < db_data.head_count; idx++) {
      meta_data_map.signs.push( { 
        sign_dttm: db_data.signs[idx].sign_dttm,
        user_addr: db_data.signs[idx].user_addr
      } );
    }

    let multisigKeys = [];

    // Multisig Pub Key List
    for (let idx = 0; idx < db_data.head_count; idx++) {
      multisigKeys.push(db_data.signs[idx].account_priv_key);
    }

    const meta_data = JSON.stringify(meta_data_map);

    // Api Call (Fee Delegation)
    console.log(meta_data);
    console.log(token_id);
    const result = await ContractApi.postTx(token_id, meta_data, db_data.account_addr, db_data.account_priv_key, db_data.user_addr, multisigKeys);
    const transactionHash = result.transactionHash;
     // Save To DB
    await this.contractTxEntity.insert( {id: id, tx_dttm: new Date().toISOString(), tx_hash: transactionHash, tx_id: 'NOT_USED', token_id: token_id, meta_data: meta_data} );
    return await this.contractTxEntity.findOne( { id: id });
  }
}
