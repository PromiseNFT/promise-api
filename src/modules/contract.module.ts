import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {TestRepository} from "../repositories/test.repository";
import {TestController} from "../controllers/test.controller";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            TestRepository
        ])
    ],
    controllers: [TestController],
})
export class ContractModule {}
