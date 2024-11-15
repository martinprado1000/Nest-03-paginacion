import {
  Controller,
  Body,
  Get,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { AuthGuard } from './guard/auth.guard';
import { RequestAuthDto } from './dto/request-auth.dto';
import { Roles } from './decorators/roles.decorator'; // Cree este decorador para luego pasarle el tipo de rol que permite el mismo
import { Role } from 'src/users/enums/role.enums';
import { RolesGuard } from './guard/roles.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() RegisterAuthDto: RegisterAuthDto) {
    return this.authService.register(RegisterAuthDto);
  }

  @Post('login')
  login(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.login(loginAuthDto);
  }

  @Get('profile')
  @Roles(Role.ADMIN, Role.SUPERADMIN) // A nuestro decorador le indicamos el o los roles que estan permitidos acceder a este endpoint.
  @UseGuards(AuthGuard, RolesGuard) 
            //AuthGuard: comprueba que existe el token y que sea correcto, de lo contrario devuelve Unauthorized.
            //RolesGuard: Este el el Guard personalizado que hace la comprobacion de los roles.
  profile(@Request() req: { user: RequestAuthDto }) { // Como en el guard le inyecta al request la data que vino en el token, puedo obtener aca esos datos. Lo inyecté en el request.user
    console.log(req.user);
    return 'profile';
  }
}
