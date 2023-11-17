import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, Index } from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
@Index(['name', 'user'], { unique: true })
export class Invoice {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column()
	location: string;

	@Column({ type: 'numeric', precision: 10, scale: 2, default: 0.00 })
	balance: number;

	@ManyToOne(() => User, (user: { invoice: any; }) => user.invoice)
	user: User;

}
