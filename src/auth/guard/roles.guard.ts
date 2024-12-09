import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/common/enums/role.enums';
import { ROLES_KEY } from '../decorators/roles.decorator';

//----  Este Guard personalizado hace la comprobacion de los roles. -----
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [  // La ejecucion de este metodo es lo que obtiene los valores que le pasamos en el decorador personalizado que creamos. ROLES_KEY es el nombre key que le pusimos a la metadata. 
      context.getHandler(), // Este extrae los metadatos cargados en la peticion actual.
      context.getClass(),   // Este extrae los metadatos cargados en toda esta clase.
    ]);
    //console.log(requiredRoles) // Estos son los roles obtenidos del decorador personalizado, que son los roles que tienen acceso al endpoint del cual se llamo.
    if (!requiredRoles) { // Si el endpoint no requiere de ningun rol permito el acceso
      return true;
    }
    const { user } = context.switchToHttp().getRequest(); // Obtengo el usuario logueado, desde el request obtengo los datos
    //console.log(user.role);  // Este es el rol del usuario logueado
    return requiredRoles.some((role) => user.role?.includes(role));  // Si cumple la condición retorna true que es lo necesario para que permita acceder.
  }
}
