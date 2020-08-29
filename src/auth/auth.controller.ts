import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import {
  Controller,
  Post,
  HttpStatus,
  HttpCode,
  UseGuards,
  Body,
  ConflictException,
  Request,
  UnauthorizedException,
  Param,
  NotFoundException,
  GoneException,
  Put,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { TokenDto } from './dtos/token.dto';
import { BasicAuthDto } from './dtos/basic-auth.dto';
import { RegisterDto } from './dtos/register.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { ActivationResult } from './enums/activation-result.enum';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('login')
  @ApiOperation({
    summary: 'Login a user and return a JWT access token in the response.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Login has been successful.',
    type: TokenDto,
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  @ApiBody({ type: BasicAuthDto })
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  public login(@Request() request: any): TokenDto {
    const { user } = request;
    if (!user.isActive) {
      throw new UnauthorizedException();
    }

    return this.authService.getToken(user);
  }

  @Post('register')
  @ApiOperation({ summary: 'Register a new user.' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Registration has been successful.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'User already exists.',
  })
  @HttpCode(HttpStatus.OK)
  public async register(@Body() registerDto: RegisterDto): Promise<void> {
    if (!(await this.authService.register(registerDto))) {
      throw new ConflictException();
    }
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
    const result = await this.authService.activate(token);
    if (result === ActivationResult.TOKEN_NOT_FOUND) {
      throw new NotFoundException();
    } else if (result === ActivationResult.TOKEN_EXPIRED) {
      throw new GoneException();
    }
  }
}
