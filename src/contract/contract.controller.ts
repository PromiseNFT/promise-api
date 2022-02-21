import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Headers,
} from '@nestjs/common';
import { ContractService } from './contract.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';

@Controller('contract')
export class ContractController {
  constructor(private readonly contractService: ContractService) {}

  @Post()
  create(
    @Headers('User-Addr') user_addr: string,
    @Body() createContractDto: CreateContractDto,
  ) {
    createContractDto.user_addr = user_addr;
    createContractDto.crt_dttm = new Date(Date.now());
    return this.contractService.create(createContractDto);
  }

  @Get()
  findAll(@Headers('User-Addr') user_addr: string) {
    return this.contractService.findAll(user_addr);
  }

  @Get(':id')
  findOne(@Headers('User-Addr') user_addr: string, @Param('id') id: number) {
    return this.contractService.findOne(+id);
  }

  @Put(':id')
  update(
    @Headers('User-Addr') user_addr: string,
    @Param('id') id: number,
    @Body() updateContractDto: UpdateContractDto,
  ) {
    updateContractDto.user_addr = user_addr;
    return this.contractService.update(+id, updateContractDto);
  }

  @Delete(':id')
  remove(@Headers('User-Addr') user_addr: string, @Param('id') id: number) {
    return this.contractService.remove(+id, user_addr);
  }

  @Post('sign/:id')
  signContract(
    @Headers('User-Addr') user_addr: string,
    @Param('id') id: number,
  ) {
    return this.contractService.createSign(+id, user_addr);
  }

  @Post('tx/:id')
  createTx(@Headers('User-Addr') user_addr: string, @Param('id') id: number) {
    return this.contractService.createTx(+id, user_addr);
  }

  // LATER
  // @Get('attachd-image/:id')
  // findAttachedImage(@Param('id') id: number) {
  //   // LATER
  //   return 'file';
  // }

  // @Get('tx-image/:id')
  // findTxImage(@Param('id') id: number) {
  //   // LATER
  //   return 'file';
  // }
}
