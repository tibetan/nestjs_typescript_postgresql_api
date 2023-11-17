import { Controller, Post, Get, Body } from '@nestjs/common';
import {UserDto} from './dto/user.dto';

@Controller('user')
export class UserController {

	@Post('create')
	create(@Body() dto: UserDto) {

	}
}
