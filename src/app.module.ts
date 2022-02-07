import { Module } from '@nestjs/common';
import {TypeOrmModule, TypeOrmModuleOptions} from "@nestjs/typeorm";
import {defaultConn} from "./connections/default";
import {ReceiptModule} from "./receipt/receipt.module";


@Module({
  imports: [
      TypeOrmModule.forRoot(defaultConn as TypeOrmModuleOptions),
      ReceiptModule,
  ],
})
export class AppModule {}
