import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { Invoice } from '../invoice/invoice.entity';

export const getPostgresConfig = async (configService: ConfigService): Promise<TypeOrmModuleOptions> => {
	return {
		type: 'postgres',
		host: configService.get('POSTGRES_HOST'),
		port: configService.get('POSTGRES_PORT'),
		username: configService.get('POSTGRES_USERNAME'),
		password: configService.get('POSTGRES_PASSWORD'),
		database: configService.get('POSTGRES_DATABASE'),
		entities: [User, Invoice],
		synchronize: true,
		autoLoadEntities: true,
		logging: true,
	};
};
