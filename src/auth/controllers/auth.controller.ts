import { Controller, Post, Request, Body, ConflictException, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { RegisterDto } from 'dtos/auth/register.dto';
import { LocalAuthGuard } from '../guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  public login(@Request() request: any): Promise<{ token: string }> {
    return this.authService.login(request.user);
  }

  @Post('register')
  public register(@Body() registerDto: RegisterDto): void {
    if (!this.authService.register(registerDto)) {
      throw new ConflictException();
    }
  }
}
