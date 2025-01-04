import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Role } from 'src/common/enums/role.enums';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,  // Inyectamos jwt
  ) {}

  //-------REGISTER-------------------------------------------------------------
  async register(registerAuthDto: RegisterAuthDto) {

    const newUser = await this.usersService.create(registerAuthDto);
    //console.log(newUser)
    delete registerAuthDto.password;

    if (!newUser) {
      throw new InternalServerErrorException('Error when performing the query');
    }
    //console.log({ 'New user': newUser });
    return 'Registered user';
  }


  //-------LOGIN-----------------------------------------------------------------------
  async login(loginAuthDto: LoginAuthDto) {
    let { email, password } = loginAuthDto;

    const userExist = await this.usersService.findByEmail(email);
    
    if (!userExist) {
      throw new BadRequestException(`Mail or password is incorrect`);
    }

    const role : Role = userExist.role;
    const name : string = userExist.name;
    const lastname : string = userExist.lastname;

    const isMatchPasswords = await bcrypt.compare(password, userExist.password);
    password = null;

    if (!isMatchPasswords) {  // Password incorrecta
      throw new BadRequestException(`Mail or password is incorrect`);
    }

    const payload = { email, role, name, lastname }; // Aca creamos la variable para indicarle que datos vamos a incluir en el token.

    const token = await this.jwtService.signAsync(payload) // Generamos el token con los datos que le pasemos

    return { token, email, role, name, lastname };
  }
}
