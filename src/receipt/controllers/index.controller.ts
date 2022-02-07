import { Controller, Get } from '@nestjs/common';

@Controller()
export class IndexController {

    @Get()
    getHello(): string {
        console.log(process.env.KAS_ACCESS_KEY_ID)
        return "Hello world"
    }
}
