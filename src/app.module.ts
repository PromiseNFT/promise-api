import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { defaultDBConn } from "./connections/default";
import { ContractModule } from './contract/contract.module';


@Module({
  imports: [
      TypeOrmModule.forRoot(defaultDBConn as TypeOrmModuleOptions),
      ContractModule,
  ],
})
export class AppModule {}
