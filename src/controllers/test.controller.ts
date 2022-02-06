import { Controller, Get } from '@nestjs/common';
import {TestRepository} from "../repositories/test.repository";

@Controller()
export class TestController {
    constructor(private readonly testRepository: TestRepository) {}

    @Get("/tests")
    getTests(): any {
        return this.testRepository.find()
    }
}
