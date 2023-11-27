import {
	Controller,
	Post,
	Body,
	Headers,
	HttpCode,
	UsePipes,
	ValidationPipe
} from '@nestjs/common';
import { TransferDto } from './dto/transfer.dto';
import { ReplenishDto } from './dto/replenish.dto';
import { InvoiceService } from './invoice.service';
import { UserService } from '../user/user.service';

@Controller('transfer')
export class TransferController {
	constructor(
		private readonly invoiceService: InvoiceService,
		private readonly userService: UserService
	) {}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post()
	async transfer(
		@Headers('X-User-Id') xUserId: number,
		@Body() dto: TransferDto
	): Promise<void> {
		const userId = this.invoiceService.getUserIdIfHeaderExists(xUserId);
		const user = await this.userService.findById(userId);
		await this.invoiceService.transferCrowns(dto, user);
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('replenish')
	async replenish(@Body() dto: ReplenishDto): Promise<void> {
		const invoice = await this.invoiceService.findInvoiceForReplenish(dto);

		// ToDo. Здесь запрос прошел валидацию и можно ждать ответ от другого сервиса по оплате.
		//  И когда оплата реальными деньгами подтвердится, счет нужно будет пополнить на 5000 крон
		//  согласно условию задания таким образом:
		await this.invoiceService.replenish(invoice);
	}

}
