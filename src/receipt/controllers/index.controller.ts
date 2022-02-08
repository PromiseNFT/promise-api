import { Controller, Get } from '@nestjs/common';
import { ProductService } from '../providers/product.service';
import { ProductRepository } from '../repositories/product.repository'

@Controller()
export class IndexController {
    constructor(
        private readonly productRepository: ProductRepository,
        private readonly productService: ProductService,
    ) {
    }

    @Get()
    getHello(): any {
        return this.productService.getHello()

    }


}
