import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './invoice.service';
import { UserService } from '../user/user.service';
import { Invoice } from './invoice.entity';
import { User } from '../user/user.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Invoice, User])],
	controllers: [InvoiceController],
	providers: [InvoiceService, UserService],
})
export class InvoiceModule {}
