import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  mixin,
} from '@nestjs/common';
import { Role } from 'auth/enums/role.enum';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { UserService } from '../user.service';

export const OnlySelfGuard = (idParamName = 'id') => {
  @Injectable()
  class OnlySelfGuardMixin implements CanActivate {
    constructor(private userService: UserService, private logger: Logger) {}

    canActivate(context: ExecutionContext): Observable<boolean> {
      const request = context.switchToHttp().getRequest();
      const { user } = request;
      if (typeof user === 'undefined') {
        return of(false);
      }

      const id = request.params[idParamName];
      return this.userService.hasRoles(user.userId, [Role.ADMIN]).pipe(
        map(hasRoles => (user && hasRoles) || user.userId === id),
        tap(result => {
          if (result === false) {
            this.logger.log(
              `User [${user.userId}] tried to access a resource that belongs to user [${id}].`,
            );
          }
        }),
      );
    }
  }

  const onlySelfGuard = mixin(OnlySelfGuardMixin);
  return onlySelfGuard;
};
