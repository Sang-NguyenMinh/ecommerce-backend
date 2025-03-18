import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auths.service';
import { AuthGuard } from '@nestjs/passport';
import { Public } from 'src/decorators/customize';
import { MailerService } from '@nestjs-modules/mailer';
import { CreateUserDto } from 'src/core/user/dto/users.dto';
import { ChangePasswordAuthDto, CodeAuthDto } from './dto/auths.dto';
import { UserService } from 'src/core/user/user.service';
import { ApiBody } from '@nestjs/swagger';

@Controller('auth')
export class AuthsController {
  constructor(
    private readonly authsService: AuthService,
    private readonly mailerService: MailerService,
    private readonly userService: UserService,
  ) {}

  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string', example: 'nmsang.dev@gmail.com' },
        password: { type: 'string', example: 'Admin@123' },
      },
      required: ['username', 'password'],
    },
  })
  @UseGuards(AuthGuard('local'))
  @Public()
  @Post('login')
  async login(@Request() req) {
    return this.authsService.login(req.user);
  }

  @Post('register')
  @Public()
  register(@Body() createUserDto: CreateUserDto) {
    console.log(createUserDto);
    return this.userService.handleRegister(createUserDto);
  }

  @Post('check-code')
  @Public()
  checkCode(@Body() codeAuthDto: CodeAuthDto) {
    return this.authsService.checkCode(codeAuthDto);
  }

  @Post('retry-active')
  @Public()
  retryActive(@Body('email') email: string) {
    return this.authsService.retryActive(email);
  }

  @Post('retry-password')
  @Public()
  retryPassword(@Body('email') email: string) {
    return this.authsService.retryPassword(email);
  }

  @Post('change-password')
  @Public()
  changePassword(@Body() data: ChangePasswordAuthDto) {
    return this.authsService.changePassword(data);
  }
}
