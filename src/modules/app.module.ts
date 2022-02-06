import { Module } from '@nestjs/common';
import { ContractModule } from './contract.module'
import {TypeOrmModule, TypeOrmModuleOptions} from "@nestjs/typeorm";
import {defaultConn} from "../models/conn/default";


@Module({
  imports: [
      ContractModule,
      TypeOrmModule.forRoot(defaultConn as TypeOrmModuleOptions)
  ],
})
export class AppModule {}
