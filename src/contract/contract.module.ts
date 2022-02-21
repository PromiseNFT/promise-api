import { Module } from '@nestjs/common';
import { ContractService } from './contract.service';
import { ContractController } from './contract.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contract } from './entities/contract.entity';
import { ContractSign } from './entities/contract.sign.entity';
import { ContractTx } from './entities/contract.tx.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Contract, ContractSign, ContractTx])],
  controllers: [ContractController],
  providers: [ContractService],
})
export class ContractModule {}
