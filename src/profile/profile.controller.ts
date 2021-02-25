import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'auth/guards/jwt-auth.guard';
import { OnlySelfGuard } from 'auth/guards/only-self.guard';
import CreateProfileDto from './dtos/create-profile.dto';
import { ProfileService } from './profile.service';
import Profile from './schemas/profile.schema';

@ApiTags('profile')
@ApiBearerAuth('jwt')
@Controller('users/:userId/profiles')
@UseGuards(JwtAuthGuard, OnlySelfGuard('userId'))
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Post()
  @ApiOperation({
    description: 'Creates a new profile for the user.',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Profile successfully created.',
  })
  public createProfile(
    @Body() dto: CreateProfileDto,
    @Param('userId') userId: string,
  ): Promise<Profile> {
    return this.profileService.createProfile(userId, dto);
  }

  @Get()
  @ApiOperation({
    description: `Gets a list of the user's profiles`,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: Profile,
    isArray: true,
  })
  public getProfiles(@Param('userId') userId: string): Promise<Profile[]> {
    return this.profileService.getUserProfiles(userId);
  }

  @Get(':id')
  @ApiOperation({
    description: 'Returns a single profile',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: Profile,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No profile was found with the given id.',
  })
  public getProfileById(
    @Param('id') id: string,
    @Param('userId') userId: string,
  ): Promise<Profile> {
    return this.profileService.findUserProfileById(id, userId);
  }
}
