import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/users/enums/role.enums';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [  // La ejecucion de este metodo es lo que obtiene los valores que le pasamos en el decorador personalizado que creamos.
      context.getHandler(),
      context.getClass(),
    ]);
    console.log(requiredRoles) // Estos con los roles obtenidos del decorador personalizado, que son los roles que tienen acceso al endpoint del cual se llamo.
    if (!requiredRoles) { // Si el endpoint no requiere de ningun rol permito el acceso
      return true;
    }
    const { user } = context.switchToHttp().getRequest(); // Obtengo el usuario logueado, desde el request obtengo los datos
    //console.log(user.role);  // Este es el rol del usuario logueado
    return requiredRoles.some((role) => user.role?.includes(role));  // Si cumple la condición retorna true que es lo necesario para que permita acceder.
  }
}
