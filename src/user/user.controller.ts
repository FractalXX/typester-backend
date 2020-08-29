import { Controller, Get, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserService } from 'src/auth/user.service';
import { UserDto } from './dtos/user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) { }

  @Get()
  @ApiOperation({
    summary: 'Get all users (admin only).',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful request.'
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden (non-admin users)'
  })
  @UseGuards(JwtAuthGuard)
  // TODO add pagination and role check
  public getAllUsers(): Promise<UserDto[]> {
    return this.userService.findAll();
  }
}
