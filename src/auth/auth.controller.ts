import {
  Controller,
  Body,
  Get,
  Post,
  ConflictException,
  //UseGuards,
  //Request,
} from '@nestjs/common';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
//import { AuthGuard } from './guard/auth.guard';
//import { Roles } from './decorators/roles.decorator'; // Cree este decorador para luego pasarle el tipo de rol que permite el mismo
//import { RolesGuard } from './guard/roles.guard';
import { RequestAuthDto } from './dto/request-auth.dto';
import { Role } from 'src/common/enums/role.enums';
import { Auth } from './decorators/user.decorator';
import { ActivateUser } from 'src/common/decorators/activeUser.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() RegisterAuthDto: RegisterAuthDto) {
    try {
      return this.authService.register(RegisterAuthDto);
    } catch (error) {
      console.log(`${error}`);
      throw new ConflictException(`${error}`);
    }
  }

  @Post('login')
  login(@Body() loginAuthDto: LoginAuthDto) {
    try {
      return this.authService.login(loginAuthDto);
    } catch (error) {
      console.log(`${error}`);
      throw new ConflictException(`${error}`);
    }
  }

  @Get('profile')
  // @Roles(Role.ADMIN, Role.SUPERADMIN) // A nuestro decorador le indicamos el o los roles que estan permitidos acceder a este endpoint.
  // @UseGuards(AuthGuard, RolesGuard)
          //AuthGuard: comprueba que existe el token y que sea correcto, de lo contrario devuelve Unauthorized.
          //RolesGuard: Este el el Guard personalizado que hace la comprobacion de los roles.
  @Auth(Role.ADMIN, Role.SUPERADMIN) // Este decorador que creamos reemplaza los 2 de arriba porque estan incluidos ahí. Osea que este decorador ya comprueba que tenga el token valido y que el rol este permitido en esta ruta. 
  //profile(@Request() req: { user: RequestAuthDto }) {
    profile(@ActivateUser() user: RequestAuthDto ) { // @ActivateUser() Con esta guard personalizado reemplazamos lo anterior e inyectamos el req la data del usuario.
    // Este guard ya le inyecta al request la data que vino en el token, puedo obtener aca esos datos. Lo inyecté en el request.user
    console.log(user);
    return user;
  }
}
