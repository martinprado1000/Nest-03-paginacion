import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/common/enums/role.enums';

export const ROLES_KEY = 'roles';

// Este es el decorador al que le pasamos los roles que van a estar permitodos en la ruta del cual lo llamamos.
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);