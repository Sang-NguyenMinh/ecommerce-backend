import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserReviewService } from './user-review.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import {
  CreateUserReviewDto,
  UpdateUserReviewDto,
} from './dto/user-review.dto';

@ApiBearerAuth()
@Controller('user-review')
export class UserReviewController {
  constructor(private readonly userReviewService: UserReviewService) {}

  @Post()
  create(@Body() createUserReviewDto: CreateUserReviewDto) {
    return this.userReviewService.create(createUserReviewDto);
  }

  @Get()
  findAll() {
    return this.userReviewService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userReviewService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserReviewDto: UpdateUserReviewDto,
  ) {
    return this.userReviewService.update(updateUserReviewDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userReviewService.remove(id);
  }
}
