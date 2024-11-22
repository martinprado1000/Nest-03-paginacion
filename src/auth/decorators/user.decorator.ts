import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { Role } from 'src/common/enums/role.enums';
import { AuthGuard } from '../guard/auth.guard';
import { RolesGuard } from '../guard/roles.guard';

// Este decorador que creamos es para unir mas de un decorador, en este caso estariamos uniendo:
// @Roles(Role.ADMIN, Role.SUPERADMIN) 
// @UseGuards(AuthGuard, RolesGuard) 
export function Auth(...roles: Role[]) {
  return applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(AuthGuard, RolesGuard),
    //ApiBearerAuth(),
    //ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}