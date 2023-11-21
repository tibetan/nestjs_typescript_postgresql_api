import {
	Controller,
	Post,
	Body,
	Headers,
} from '@nestjs/common';
import { TransferDto } from './dto/transfer.dto';
import { InvoiceService } from './invoice.service';
import { UserService } from '../user/user.service';

@Controller('transfer')
export class TransferController {
	constructor(
		private readonly invoiceService: InvoiceService,
		private readonly userService: UserService
	) {}

	@Post()
	async transfer(
		@Headers('X-User-Id') xUserId: number,
		@Body() dto: TransferDto
	): Promise<void> {
		const userId = this.invoiceService.getUserIdIfHeaderExists(xUserId);
		const user = await this.userService.findById(userId);
		await this.invoiceService.transferCrowns(dto, user);
	}

}
