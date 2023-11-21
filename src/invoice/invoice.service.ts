import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository, InjectEntityManager } from '@nestjs/typeorm';
import { Repository, EntityManager, FindOneOptions, DeepPartial } from 'typeorm';
import { InvoiceDto } from './dto/invoice.dto';
import { TransferDto } from './dto/transfer.dto';
import { Invoice } from './invoice.entity';
import { User } from '../user/user.entity';

@Injectable()
export class InvoiceService {
	constructor(
		@InjectRepository(Invoice)
		private readonly invoiceRepository: Repository<Invoice>,
		@InjectEntityManager()
		private readonly entityManager: EntityManager,
	) {}

	getUserIdIfHeaderExists(xUserId: number): number {
		if (!xUserId) {
			throw new NotFoundException('Header "X-User-Id" does not exist in the request');
		}

		return xUserId;
	}

	async create(dto: InvoiceDto, user: User): Promise<Invoice> {
		const invoice = await this.invoiceRepository.create({
			...dto,
			balance: 1000,
			user: user,
		});

		return this.invoiceRepository.save(invoice);
	}

	async findByIdAndUser(id: number, user: User): Promise<Invoice> {
		const invoice = await this.invoiceRepository.findOne({
			where: { id, user },
			relations: {
				user: true
			}
		});

		if (!invoice) {
			throw new NotFoundException(`Invoice with id ${id} (including user with id ${user.id}) not found`);
		}

		return invoice;
	}

	async findAll(user: User, page?: number, pageSize?: number): Promise<Invoice[]> {
		let pagination = {};
		if (page && !pageSize) {
			pageSize = 10;
			const skip = (page - 1) * pageSize;
			pagination = {skip, take: pageSize};
		} else if (!page && pageSize) {
			page = 1;
			const skip = (page - 1) * pageSize;
			pagination = {skip, take: pageSize};
		} else if (page && pageSize) {
			const skip = (page - 1) * pageSize;
			pagination = {skip, take: pageSize};
		}

		const invoices = this.invoiceRepository.find({
			select: {
				id: true,
				name: true,
				location: true,
				balance: true
			},
			where: { user },
			...pagination
		});

		if (!invoices) {
			throw new NotFoundException(`Invoices for user with id ${user.id} not found`);
		}

		return invoices;
	}

	async findByName(name: string, user: User): Promise<Invoice | null> {
		const invoice = await this.invoiceRepository.findOne({
			where: { name, user },
			relations: {
				user: true
			}
		});

		if (invoice && invoice.name && invoice.name === name) {
			throw new ForbiddenException(`Invoice with name ${name} already exists`);
		}

		return invoice || null;
	}

	async deleteById(id: number): Promise<void> {
		this.invoiceRepository.delete(id);
	}

	async updateNameById(id: number, name: string): Promise<void> {
		this.invoiceRepository.update(id, { name })
	}

	async transferCrowns(
		dto: TransferDto,
		user: User,
	): Promise<void> {
		return this.entityManager.transaction(async transactionalEntityManager => {
			const senderOptions: FindOneOptions<Invoice> = {
				where: {
					id: dto.senderInvoiceId,
					user: user,
				},
			};
			const receiverOptions: FindOneOptions<Invoice> = {
				where: {
					id: dto.receiverInvoiceId,
				},
			};
			const senderInvoice = await transactionalEntityManager.findOne(Invoice, senderOptions);
			const receiverInvoice = await transactionalEntityManager.findOne(Invoice, receiverOptions);

			if (!senderInvoice || !receiverInvoice) {
				throw new NotFoundException('Sender or receiver invoice not found');
			}

			senderInvoice.balance -= dto.amount;
			if (senderInvoice.balance <= 0) {
				throw new NotFoundException('Insufficient funds and the invoice cannot be equal to zero');
			}
			receiverInvoice.balance += dto.amount;

			await transactionalEntityManager.save(Invoice, [senderInvoice, receiverInvoice] as DeepPartial<Invoice>[]);
		});
	}

}