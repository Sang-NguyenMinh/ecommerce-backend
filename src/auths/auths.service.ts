import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { BcryptService } from 'src/shared/bcrypt.service';
import { ChangePasswordAuthDto, CodeAuthDto } from './dto/auths.dto';
import { UserService } from 'src/core/user/user.service';
import { CreateUserDto } from 'src/core/user/dto/users.dto';
import { ConfigService } from '@nestjs/config';
import { IToken } from 'src/config/types';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private readonly bcryptService: BcryptService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findByPhoneOrEmail(username);

    if (!user) return null;

    const isValidPassword = await this.bcryptService.comparePassword(
      password,
      user.password,
    );
    if (!isValidPassword) return null;

    return user;
  }

  // async login(user: any) {
  //   const payload = { email: user?.email, userId: user._id, role: user?.role };
  //   return {
  //     accessToken: this.jwtService.sign(payload, { expiresIn: '10d' }),
  //   };
  // }

  async login(user: any) {
    const payload = { email: user?.email, userId: user._id, role: user?.role };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '10d',
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '30d',
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
    });

    const result: IToken = {
      type: 'Bearer',
      accessToken,
      refreshToken,
    };

    return result;
  }

  async loginWithGoogle(user: any) {
    const payload = { username: user.email, sub: user._id, role: user.role };
    return {
      user: {
        email: user.email,
        _id: user._id,
        role: user.role,
      },
      accessToken: this.jwtService.sign(payload),
    };
  }

  async googleLogin(req: any, res: any) {
    if (!req.user) {
      return res.status(401).json({ message: '' });
    }

    const loginResult = await this.loginWithGoogle(req.user);

    return res.json(loginResult);
  }

  handleRegister = async (createUserDto: CreateUserDto) => {
    return await this.userService.handleRegister(createUserDto);
  };

  checkCode = async (data: CodeAuthDto) => {
    return await this.userService.handleActive(data);
  };

  retryActive = async (email: string) => {
    return await this.userService.retryActive(email);
  };

  retryPassword = async (data: string) => {
    return await this.userService.retryPassword(data);
  };

  changePassword = async (data: ChangePasswordAuthDto) => {
    return await this.userService.changePassword(data);
  };
}
