import {EntityRepository, Repository} from "typeorm";
import {Receipt} from "../entities/receipt.entity";

@EntityRepository(Receipt)
export class ReceiptRepository extends Repository<Receipt> {}
