import { Injectable } from '@nestjs/common';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contract } from './entities/contract.entity';

@Injectable()
export class ContractService {
  constructor(
    @InjectRepository(Contract) private contractEntity: Repository<Contract>,
  ) {
    this.contractEntity = contractEntity;
  }

  async create(createContractDto: CreateContractDto) {
    await this.contractEntity.save(createContractDto);
  }

  findAll() {
    return `This action returns all contract`;
  }

  findOne(id: number) {
    return this.contractEntity.findOne({ id: id });
  }

  // update(id: number, updateContractDto: UpdateContractDto) {
  //   return `This action updates a #${id} contract`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} contract`;
  // }
}
