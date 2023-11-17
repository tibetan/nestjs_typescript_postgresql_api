import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { InvoiceModule } from './invoice/invoice.module';
import { getPostgresConfig } from './config/postgres.config';

@Module({
  imports: [
		ConfigModule.forRoot({
			envFilePath: '.env',
		}),
    TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getPostgresConfig,
    }),
    UserModule,
    InvoiceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
