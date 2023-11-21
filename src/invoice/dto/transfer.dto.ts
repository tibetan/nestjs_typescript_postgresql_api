export class TransferDto {
	senderInvoiceId: number;   // id счета, с которого переводятся кроны
	receiverInvoiceId: number; // id счета, на который переводятся кроны
	amount: number             // сумма перевода
}