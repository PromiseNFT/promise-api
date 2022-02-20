import { HttpException, Injectable } from '@nestjs/common';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Transaction } from 'typeorm';
import { Contract } from './entities/contract.entity';
import { ContractApi } from './api/contract.api';
import { ContractSign } from './entities/contract.sign.entity';
import { ContractTx } from './entities/contract.tx.entitiy';

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
    const accounts: Array<Map<string, string>> = [];
    for (let idx = 0; idx < head_count; idx++) {
      const account = await ContractApi.createAccount();
      // accounts.push( { 'account_addr': account.data.address, 'account_pub_key': account.data.publicKey } );
    }
    return accounts;
  }

  @Transaction()
  async _saveToDB(
    dto: UpdateContractDto,
    id: number,
    accounts: Array<Map<string, string>>,
  ) {
    if (id !== null) await this.contractSignEntity.delete({ id: id });

    dto.account_addr = accounts[0]['account_addr'];
    dto.account_pub_key = accounts[0]['account_pub_key'];

    if (id === null) {
      // dto.crt_dttm = Date.now();
      id = await (await this.contractEntity.insert(dto)).generatedMaps[0].id;
    } else {
      await this.contractEntity.update({ id: id }, dto);
    }

    for (let idx = 1; idx < dto.head_count + 1; idx++) {
      await this.contractSignEntity.insert({
        id: id,
        account_addr: accounts['account_addr'],
        account_pub_key: accounts['account_pub_key'],
      });
    }

    return id;
  }

  async create(createContractDto: CreateContractDto) {
    const accounts: Array<Map<string, string>> = await this._createKASAccount(
      createContractDto.head_count + 1,
    );

    // Put Multisig
    if (
      !ContractApi.putMultisigKlaytnAccount(
        accounts[0]['account_addr'],
        createContractDto.head_count,
        null,
      )
    )
      throw HttpException;

    // Save To DB ( + Sign DB )
    const id: number = await this._saveToDB(createContractDto, null, null);

    // Return Result
    return await this.contractEntity.findOne({ id: id });
  }

  async findAll(user_addr: string) {
    // TODO Extract Contract That User Signed
    return await this.contractEntity.find({ user_addr: user_addr });
  }

  async findOne(id: number) {
    // TODO Retrun With Left Join Data
    return await this.contractEntity.findOne({ id: id });
  }

  async update(id: number, updateContractDto: UpdateContractDto) {
    const accounts: Array<Map<string, string>> = await this._createKASAccount(
      updateContractDto.head_count + 1,
    );

    // Put Multisig
    if (
      !ContractApi.putMultisigKlaytnAccount(
        accounts[0]['account_addr'],
        updateContractDto.head_count,
        null,
      )
    )
      throw HttpException;

    // Save To DB ( + Sign DB )
    await this._saveToDB(updateContractDto, null, null);

    // Return Result
    return;
  }

  async remove(id: number, user_addr: string) {
    // Check Login Need & Tx Existence
    await this.contractEntity.delete({ id: id, user_addr: user_addr });
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
    return this.contractSignEntity.find({ id: id });
  }

  async createTx(id: number, user_addr: string) {
    // Api Call (Fee Delegation)
    // Api Sign
    // Save To DB
  }
}
