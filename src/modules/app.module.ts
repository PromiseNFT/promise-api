import { Module } from '@nestjs/common';
import { ContractModule } from './contract.module'


@Module({
  imports: [ContractModule],
})
export class AppModule {}
