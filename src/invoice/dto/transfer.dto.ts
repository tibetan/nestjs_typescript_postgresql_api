import { IsNumber, IsNotEmpty } from 'class-validator';

export class TransferDto {
	@IsNotEmpty()
	@IsNumber()
	senderInvoiceId: number;   // id счета, с которого переводятся кроны

	@IsNotEmpty()
	@IsNumber()
	receiverInvoiceId: number; // id счета, на который переводятся кроны

	@IsNumber()
	amount: number;            // сумма перевода
}
