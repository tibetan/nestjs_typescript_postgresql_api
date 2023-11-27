import { IsString, IsNotEmpty } from "class-validator";

export class InvoiceDto {
	@IsNotEmpty()
	@IsString()
	name: string;

	@IsString()
	location: string;
}
