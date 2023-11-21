import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, Index, JoinColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { ColumnNumericTransformer } from './column_numeric.transformer';

@Entity()
@Index(['name', 'user'], { unique: true })
export class Invoice {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column()
	location: string;

	@Column({
		type: 'numeric',
		precision: 10,
		scale: 2,
		default: 1000.00,
		transformer: new ColumnNumericTransformer()
	})
	balance: number;

	@ManyToOne(() => User, (user: { invoice: Invoice; }) => user.invoice)
	@JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
	user: User;
}
