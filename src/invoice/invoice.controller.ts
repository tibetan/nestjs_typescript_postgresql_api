import { Controller, Get, Post, Delete, Patch, Body, Param } from '@nestjs/common';
import {InvoiceDto} from './dto/invoice.dto';

@Controller('invoice')
export class InvoiceController {

	@Post()
	async create(@Body() dto: Omit<InvoiceDto, 'balance'>) {

	}

	@Get(':id')
	async get(@Param('id') id: number) {

	}

	@Delete(':id')
	async delete(@Param('id') id: number) {

	}

	// @Patch(':id')
	// async patch(@Param('id') id: number, @Body() dto: InvoiceModel) {

	// }
}
