import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,  // Inyectamos jwt
  ) {}

  //-------REGISTER-------------------------------------------------------------
  async register(registerAuthDto: RegisterAuthDto) {
    let { email, password, confirmPassword } = registerAuthDto;

    if (password != confirmPassword) {
      throw new BadRequestException('Password does not match');
    }

    confirmPassword = null;
    delete registerAuthDto.confirmPassword;

    const userExist = await this.usersService.findByEmail(email);
    if (userExist) {
      throw new ConflictException(`The user already exists`);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    password = null;

    registerAuthDto.password = hashedPassword;
    const newUser = await this.usersService.create(registerAuthDto);
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

    const isMatchPasswords = await bcrypt.compare(password, userExist.password);

    if (!isMatchPasswords) {
      // Password incorrecta
      throw new BadRequestException(`Mail or password is incorrect`);
    }

    const payload = { email, role:userExist.role }; // Aca creamos la variable para indicarle que datos vamos a incluir en el token.

    const token = await this.jwtService.signAsync(payload) // Generamos el token con los datos que le pasemos

    return { token, email};
  }
}
