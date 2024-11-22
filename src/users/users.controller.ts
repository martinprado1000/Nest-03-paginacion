import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ConflictException,
  NotFoundException,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserPipe } from './pipes/user/user.pipe';
import { Auth } from 'src/auth/decorators/user.decorator';
import { Role } from 'src/common/enums/role.enums';
import { RequestAuthDto } from 'src/auth/dto/request-auth.dto';
import { ActivateUser } from 'src/common/decorators/activeUser.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    try {
      return this.usersService.findAllWithOutPassword();
    } catch (error) {
      console.log(`${error}`);
      throw new ConflictException(`${error}`);
    }
  }

  @Get(':id')
  async findByIdWithOutPassword(@Param('id', UserPipe) id: string) { // UserPipe: con el pipe chequeo si el id es un id valido de Mongoose
    try {
      const user = await this.usersService.findByIdWithOutPassword(id);
      if (!user) {
        throw new NotFoundException(`User not found`);
      }
      return user;
    } catch (error) {
      console.log(`${error}`);
      throw new ConflictException(`${error}`);
    }
  }

  @Auth(Role.ADMIN, Role.SUPERADMIN) // Indico que roles estan permitidos en esta ruta.
  @Post()
  async create(
    @ActivateUser() user: RequestAuthDto, // @ActivateUser() user: RequestAuthDto,, con estodecorador obtengo el usuario en esta en el request. El usuario en el request se inyecta en el login
    @Body() createUserDto: CreateUserDto,
  ) {
    try {
      //console.log('Active user:', user);
      return await this.usersService.create(createUserDto);
    } catch (error) {
      console.log(`${error}`);
      throw new ConflictException(`${error}`);
    }
  }

  @Auth(Role.ADMIN, Role.SUPERADMIN)
  @Patch(':id')
  async update(
    @Param('id', UserPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    try {
      const user = await this.usersService.update(id, updateUserDto);
      if (!user) {
        throw new NotFoundException(`User not found`);
      }
      return user;
    } catch (error) {
      console.log(`${error}`);
      throw new ConflictException(`${error}`);
    }
  }

  @Auth(Role.ADMIN, Role.SUPERADMIN)
  @Delete(':id')
  @HttpCode(204) // Si retorno un codigo 204 por mas que haga un return no retorna nada.
  async remove(@Param('id', UserPipe) id: string) {
    try {
      const user = await this.usersService.remove(id);
      if (!user) {
        throw new NotFoundException(`User not found`);
      }
      return user;
    } catch (error) {
      console.log(`${error}`);
      throw new ConflictException(`${error}`);
    }
  }
}
