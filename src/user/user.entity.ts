import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Invoice } from '../invoice/invoice.entity';

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	email: string;

	@OneToMany(() => Invoice, (invoice: { user: User; }) => invoice.user)
	invoices: Invoice[];

}
