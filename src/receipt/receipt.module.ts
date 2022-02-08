import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductRepository } from "./repositories/product.repository";
import { ReceiptRepository } from "./repositories/receipt.repository";
import { ProductService } from "./providers/product.service";
import {IndexController} from "./controllers/index.controller";


@Module({
    imports: [
        TypeOrmModule.forFeature([
            ProductRepository,
            ReceiptRepository,
        ])
    ],
    controllers: [IndexController],
    providers: [
        ProductService,
    ]
})
export class ReceiptModule {}
