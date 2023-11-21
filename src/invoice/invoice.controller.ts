import {
	Controller,
	Get,
	Post,
	Delete,
	Patch,
	Body,
	Param,
	NotFoundException,
	Headers,
	Query,
	HttpCode
} from '@nestjs/common';
import { InvoiceDto } from './dto/invoice.dto';
import { InvoiceService } from './invoice.service';
import { UserService } from '../user/user.service';
import {Invoice} from './invoice.entity';

@Controller('invoice')
export class InvoiceController {
	constructor(
		private readonly invoiceService: InvoiceService,
		private readonly userService: UserService
	) {}

	@Post()
	async create(
		@Headers('X-User-Id') xUserId: number,
		@Body() dto: Omit<InvoiceDto, 'balance'>
	): Promise<Invoice> {
		const userId = this.invoiceService.getUserIdIfHeaderExists(xUserId);
		const user = await this.userService.findById(userId);
		await this.invoiceService.findByName(dto.name, user);

		return await this.invoiceService.create(dto, user);
	}

	@Get()
	async getAll(
		@Headers('X-User-Id') xUserId: number,
		@Query('page') page?: number, // Номер страницы (необязательный query параметр)
		@Query('pageSize') pageSize?: number // Размер страницы (необязательный query параметр)
	): Promise<Invoice[]> {
		const userId = this.invoiceService.getUserIdIfHeaderExists(xUserId);
		const user = await this.userService.findById(userId);
		return await this.invoiceService.findAll(user, page, pageSize);
	}

	@Get(':id')
	async get(
		@Headers('X-User-Id') xUserId: number,
		@Param('id') id: number
	): Promise<Invoice> {
		const userId = this.invoiceService.getUserIdIfHeaderExists(xUserId);
		const user = await this.userService.findById(userId);
		return await this.invoiceService.findByIdAndUser(id, user);
	}

	@Delete(':id')
	async delete(
		@Headers('X-User-Id') xUserId: number,
		@Param('id') id: number
	): Promise<void> {
		const userId = this.invoiceService.getUserIdIfHeaderExists(xUserId);
		const user = await this.userService.findById(userId);
		await this.invoiceService.findByIdAndUser(id, user);
		await this.invoiceService.deleteById(id);
	}

	@HttpCode(200)
	@Patch(':id')
	async patch(
		@Headers('X-User-Id') xUserId: number,
		@Param('id') id: number,
		@Body() dto: Pick<InvoiceDto, 'name'>
	): Promise<void> {
		const userId = this.invoiceService.getUserIdIfHeaderExists(xUserId);
		const user = await this.userService.findById(userId);
		const invoice = await this.invoiceService.findByIdAndUser(id, user);

		if (invoice.name === dto.name) {
			throw new NotFoundException(`Invoice with name ${dto.name} already exists`);
		}

		await this.invoiceService.updateNameById(id, dto.name);
	}

}
