import {EntityRepository, Repository} from "typeorm";
import {ReceiptEntity} from "../entities/receipt.entity";

@EntityRepository(ReceiptEntity)
export class ReceiptRepository extends Repository<ReceiptEntity> {}
