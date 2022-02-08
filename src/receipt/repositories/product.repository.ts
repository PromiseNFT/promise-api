import { EntityRepository, Repository } from "typeorm";
import { Product } from "../entities/product.entity";

@EntityRepository(Product)
export class ProductRepository extends Repository<Product> {
    public getProduct() {
        return this.findOne({where: { id: 100 }})
    }
}
