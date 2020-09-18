import { Controller, Get, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserService } from 'src/auth/user.service';
import { UserDto } from './dtos/user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';

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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  // TODO add pagination
  public getAllUsers(): Promise<UserDto[]> {
    return this.userService.findAll();
  }
}
