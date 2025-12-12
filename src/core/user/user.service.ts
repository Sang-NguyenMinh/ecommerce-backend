import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { FilterQuery, Model } from 'mongoose';
import { BcryptService } from 'src/shared/bcrypt.service';
import { MailerService } from '@nestjs-modules/mailer';
import { CreateUserDto, UpdateUserDto } from './dto/users.dto';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import { ChangePasswordAuthDto, CodeAuthDto } from 'src/auths/dto/auths.dto';
import { CustomOptions } from 'src/config/types';
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,

    private readonly bcryptService: BcryptService,
    private readonly mailerService: MailerService,
  ) {}

  async findOne(
    conditions: FilterQuery<UserDocument> = {},
    options: CustomOptions<UserDocument> = {},
  ) {
    const user = await this.userModel
      .findOne({ ...conditions }, options.fields)
      .lean();
    console.log(user);
    return user;
  }
  async create(createUserDto: CreateUserDto) {
    createUserDto.password = await this.bcryptService.hashPassword(
      createUserDto.password,
    );
    const createdUser = new this.userModel(createUserDto);
    createdUser.save();

    return {
      _id: createdUser._id,
    };
  }

  async update(userId: string, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      updateUserDto.password = await this.bcryptService.hashPassword(
        updateUserDto.password,
      );
    }
    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      updateUserDto,
      { new: true, omitUndefined: true },
    );
    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }
    return updatedUser;
  }

  async findByPhoneOrEmail(keyword: string) {
    return await this.userModel.findOne({
      $or: [{ email: keyword }, { phone: keyword }],
    });
  }

  async handleRegister(createUserDto: CreateUserDto) {
    const isExistEmail = !!(await this.userModel.exists({
      email: createUserDto.email,
    }));
    if (isExistEmail) {
      throw new BadRequestException(
        `Email ${createUserDto.email} already exists, please use another email.`,
      );
    }

    const isExistPhone = !!(await this.userModel.exists({
      phone: createUserDto.phone,
    }));
    if (isExistPhone) {
      throw new BadRequestException(
        `Phone ${createUserDto.phone} already exists, please use another email.`,
      );
    }

    createUserDto.password = await this.bcryptService.hashPassword(
      createUserDto.password,
    );
    const codeId = uuidv4();

    try {
      const user = await this.userModel.create({
        ...createUserDto,
        codeId: codeId,
        codeExpired: dayjs().add(5, 'minutes'),
      });

      try {
        await this.mailerService.sendMail({
          to: user.email,
          subject: 'Activate your account at Sport book',
          template: 'register',
          context: {
            name: user.email ?? user.username,
            activationCode: codeId,
          },
        });
      } catch (emailError) {
        console.error('Error sending activation email:', emailError);
        throw new InternalServerErrorException(
          'An error occurred while sending activation email.',
        );
      }

      return {
        success: true,
        message: 'User registered successfully',
        userId: user._id,
        email: user.email,
      };
    } catch (error) {
      console.error('Error creating user:', error);
      throw new InternalServerErrorException(
        'An error occurred while creating the user.',
      );
    }
  }

  async handleActive(data: CodeAuthDto) {
    const user = await this.userModel.findOne({
      _id: data._id,
    });
    if (!user) {
      throw new BadRequestException('Invalid or expired code');
    }

    const isBeforeCheck = dayjs().isBefore(user.codeExpired);

    if (isBeforeCheck) {
      await this.userModel.updateOne(
        { _id: data._id },
        {
          isActive: true,
        },
      );
      return { active: isBeforeCheck };
    } else {
      throw new BadRequestException('Invalid or expired code');
    }
  }

  async retryActive(email: string) {
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new BadRequestException('Account does not exist');
    }
    if (user.isActive) {
      throw new BadRequestException('Account has been activated');
    }

    const codeId = uuidv4();

    await user.updateOne({
      codeId: codeId,
      codeExpired: dayjs().add(5, 'minutes'),
    });

    this.mailerService.sendMail({
      to: user.email,
      subject: 'Activate your account at E-commerce',
      template: 'register',
      context: {
        name: user.email ?? user?.username,
        activationCode: codeId,
      },
    });
    return {
      _id: user._id,
      status: 'success',
    };
  }

  async retryPassword(email: string) {
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new BadRequestException('Account does not exist');
    }

    const codeId = uuidv4();

    await user.updateOne({
      codeId: codeId,
      codeExpired: dayjs().add(5, 'minutes'),
    });

    this.mailerService.sendMail({
      to: user.email,
      subject: 'Change your password account at E-commerce',
      template: 'register',
      context: {
        name: user.email ?? user?.username,
        resetPasswordLink: 'facebook.com',
      },
    });
    return { _id: user._id, email: user.email };
  }

  async changePassword(data: ChangePasswordAuthDto) {
    const user = await this.userModel.findOne({ email: data.email });

    if (!user) {
      throw new BadRequestException('Account does not exist');
    }

    try {
      const newPassword = await this.bcryptService.hashPassword(data.password);
      await user.updateOne({ password: newPassword });
    } catch (error) {
      throw new InternalServerErrorException(
        'Something wrong when update password',
      );
    }
  }
}
