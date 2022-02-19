import { Injectable } from '@nestjs/common';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Transaction } from 'typeorm';
import { Contract } from './entities/contract.entity';
import { ContractApiService } from './api/contract.api';

@Injectable()
export class ContractService {
  constructor(
    @InjectRepository(Contract) private contractEntity: Repository<Contract>,
  ) {
    this.contractEntity = contractEntity;
  }

  async _createKASAccount(head_count: number) {
    // Make Account
    let account = ContractApiService.createAccout();
    // Make Signers' accounts
    for (let idx: number = 0; idx < head_count; idx++) {
        let sign_accout = ContractApiService.createAccout();
    }
  }

  @Transaction()
  async _saveToDB() {

  }

  
  async create(createContractDto: CreateContractDto) {
    this._createKASAccount(createContractDto.head_count);

    // Put Multisig

    // Save To DB ( + Sign DB )
    // await this.contractEntity.save(createContractDto);
    this._saveToDB();

    // Return Result
  }

  findAll() {
    return 'TODO';
  }

  findOne(id: number) {
    return this.contractEntity.findOne({ id: id });
  }

  update(id: number, updateContractDto: UpdateContractDto) {
    // await this.contractEntity.update(updateContractDto);

    // delete accounts
    // create accounts
    // 
  }

  async remove(id: number) {
    // Check Login Need ...
    await this.contractEntity.delete({ id: id });
  }
}
