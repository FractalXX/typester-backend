import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserService } from '../user.service';
import { Observable, of } from 'rxjs';
import { Role } from '../enums/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userService: UserService,
  ) { }

  canActivate(context: ExecutionContext): Observable<boolean> {
    const roles = this.reflector.get<Role[]>('roles', context.getHandler());
    if (!roles) {
      return of(true);
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    return this.userService.hasRoles(user.userId, roles);
  }
}
