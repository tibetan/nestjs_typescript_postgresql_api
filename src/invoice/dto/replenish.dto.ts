import { IsNumber, IsString, IsNotEmpty } from 'class-validator';

export class ReplenishDto {
	@IsNotEmpty()
	@IsString()
	password: string;

	@IsNotEmpty()
	@IsNumber()
	invoiceId: number;
}
