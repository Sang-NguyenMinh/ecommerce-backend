import { Module } from '@nestjs/common';
import { AuthsController } from './auths.controller';
import { AuthService } from './auths.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './passport/local.strategy';
import { JwtStrategy } from './passport/jwt.strategy';
import { BcryptService } from 'src/shared/bcrypt.service';
import { UserModule } from 'src/core/user/user.module';

@Module({
  imports: [
    UserModule,
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_ACCESS_TOKEN_EXPIRED'),
        },
      }),
      inject: [ConfigService],
    }),
    PassportModule,
  ],
  controllers: [AuthsController],
  providers: [AuthService, BcryptService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthsModule {}
