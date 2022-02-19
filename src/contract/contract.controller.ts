import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ContractService } from './contract.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { Express } from 'express';

@Controller('contract')
export class ContractController {
  constructor(private readonly contractService: ContractService) {}

  @Post()
  @UseInterceptors(FileInterceptor('attached_image'))
  create(@UploadedFile() attached_image: Express.Multer.File, @Body() createContractDto: CreateContractDto) {
    return this.contractService.create(createContractDto);
  }

  @Get()
  findAll() {
    return this.contractService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.contractService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateContractDto: UpdateContractDto) {
    return this.contractService.update(+id, updateContractDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.contractService.remove(+id);
  }

  @Patch('sign/:id')
  signContract(@Param('id') id: number) {
    return 'file'; // Add Header ?
  }

  @Get('attachd-image/:id')
  findAttachedImage(@Param('id') id: number) {
    return 'file';
  }

  @Get('tx-image/:id')
  findTxImage(@Param('id') id: number) {
    return 'file';
  }

  @Post('tx/:id')
  createTx(@Param('id') id: number) {

  }
}
