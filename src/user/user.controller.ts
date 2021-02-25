import {
  Controller,
  Get,
  HttpStatus,
  UseGuards,
  Query,
  Post,
  Body,
  Patch,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserService } from 'auth/user.service';
import { UserDto } from './dtos/user.dto';
import { JwtAuthGuard } from 'auth/guards/jwt-auth.guard';
import { RolesGuard } from 'auth/guards/roles.guard';
import { Roles } from 'auth/decorators/roles.decorator';
import { Role } from 'auth/enums/role.enum';
import { UserQueryParams } from 'user/dtos/user-query-params';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from 'auth/schemas/user.schema';
import { OnlySelfGuard } from 'auth/guards/only-self.guard';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all users (admin only).',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful request.',
    type: UserDto,
    isArray: true,
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden (non-admin users)',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  public getAllUsers(
    @Query() queryParams: UserQueryParams,
  ): Promise<UserDto[]> {
    return this.userService.query(queryParams);
  }

  @Post()
  @ApiOperation({
    summary: 'Create a user',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User has been successfully created.',
    type: User,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Payload validation has failed',
  })
  public createUser(@Body() dto: CreateUserDto): Promise<User> {
    return this.userService.register(dto);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a user',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update was successful.',
    type: User,
  })
  @ApiResponse({
    status: HttpStatus.NOT_MODIFIED,
    description: 'No modifications were made.',
  })
  @UseGuards(JwtAuthGuard, OnlySelfGuard())
  public patchUser(
    @Body() dto: Partial<UserDto>,
    @Param('id') id: string,
  ): Promise<User> {
    return this.userService.updateUser(id, dto);
  }
}
