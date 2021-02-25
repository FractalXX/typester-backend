import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import {
  Controller,
  Post,
  HttpStatus,
  HttpCode,
  UseGuards,
  Request,
  Param,
  Put,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { TokenDto } from './dtos/token.dto';
import { BasicAuthDto } from './dtos/basic-auth.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post()
  @ApiOperation({
    summary: 'Login a user and return a JWT access token in the response.',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Login has been successful and a JWT token has been issued.',
    type: TokenDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'When credentials are invalid.',
  })
  @ApiBody({ type: BasicAuthDto })
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(LocalAuthGuard)
  public login(@Request() request: any): TokenDto {
    return this.authService.login(request.user);
  }

  @Put('activate/:token')
  @ApiOperation({ summary: 'Activate a user by activation token.' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Activation has been successful',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Activation token does not exist',
  })
  @ApiResponse({
    status: HttpStatus.GONE,
    description: 'Activation token has expired',
  })
  public async activate(@Param('token') token: string): Promise<void> {
    this.authService.activate(token);
  }
}
