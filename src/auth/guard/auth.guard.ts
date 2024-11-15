import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from '../constants/jwt.constant';

// ---- Este guard es para extraer el token del header y comprobar que sea correcto ------------------
@Injectable()
export class AuthGuard implements CanActivate {

  constructor( private readonly jwtService : JwtService ){} // Aca inyecto el servicio de jwt que cree

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    
    // Aca veo el token que viene en el headers
    //console.log(request.headers.authorization)

    const token = this.extractTokenFromHeader(request); // Extrae el token del header
    if (!token) { // Si no hay token retorna no autorizado
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync( // Hace la comparación con la palabra secreta
        token,
        {
          secret: jwtConstants.secret  // Aca hago la comparativa de
        }
      );
      
      request['user'] = payload;  // Esta linea podemos inyectar en el request los datos que vinieron en el token, en este caso el emai.
    
    } catch {
      throw new UnauthorizedException();
    }

    return true;

  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
