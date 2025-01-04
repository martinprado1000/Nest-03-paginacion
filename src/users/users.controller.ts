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
  LoggerService,
  UseGuards,
  UsePipes,
  Inject,
} from '@nestjs/common';
import { UsersService } from './users.service';
//import { CreateUserDto } from './dto/create-user.dto';
//import { UpdateUserDto } from './dto/update-user.dto';
//import { ResponseUserDto } from './dto/response-user.dto';
// Cree un punto de entrada en la carpeta dto (index.ts) para poder hacer la importacion solo en una linea como a continuacion:
import { CreateUserDto, UpdateUserDto, ResponseUserDto } from './dto';
import { Auth } from 'src/auth/decorators/user.decorator';
import { Role } from 'src/common/enums/role.enums';
import { RequestAuthDto } from 'src/auth/dto/request-auth.dto';
import { ActivateUser } from 'src/common/decorators/activeUser.decorator';
import { idMongoPipe } from 'src/common/pipes/idMongo.pipe';
import { CustomLoggerService } from 'src/logger/logger.service';
import { Request } from 'express';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly logger: CustomLoggerService,
  ) {}

  @Get()
  findAll(@ActivateUser() activateUser: RequestAuthDto) {
    try {
      this.logger.error('This is an error', UsersController.name, "Error detail");
      this.logger.warn('This is a warning', UsersController.name);
      this.logger.log('This is an info log', UsersController.name);
      this.logger.debug('This is a debug',  UsersController.name);
      this.logger.verbose('This is a verbose',  UsersController.name);
      return this.usersService.findAllResponse();
    } catch (error) {
      this.logger.error('This is an error', UsersController.name, "Error detail");
      throw new ConflictException(`${error}`);
    }
  }

  @Get(':id')
  async findById(@Param('id', idMongoPipe) id: string) {
    try {
      const user = await this.usersService.findByIdResponse(id);
      if (!user) throw new NotFoundException(`User not found`);
      return user;
    } catch (error) {
      console.log(`${error}`);
      throw new ConflictException(`${error}`);
    }
  }

  @Auth(Role.ADMIN, Role.SUPERADMIN) // Indico que roles estan permitidos en esta ruta.
  @Post()
  async create(
    @ActivateUser() activateUser: RequestAuthDto, // @ActivateUser() user: RequestAuthDto,, con este decorador obtengo el usuario en esta en el request. El usuario en el request se inyecta en el login
    @Body() createUserDto: CreateUserDto,
  ) {
    try {
      console.log('Active user:', activateUser);
      return await this.usersService.create(createUserDto);
    } catch (error) {
      console.log(`${error}`);
      throw new ConflictException(`${error}`);
    }
  }

  @Auth(Role.ADMIN, Role.SUPERADMIN)
  @Patch(':id')
  async update(
    @ActivateUser() ActivateUser: RequestAuthDto,
    @Param('id', idMongoPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    try {
      const user: ResponseUserDto = await this.usersService.update(
        id,
        updateUserDto,
      );
      if (!user) throw new NotFoundException(`User not found`);
      return user;
    } catch (error) {
      console.log(`${error}`);
      throw new ConflictException(`${error}`);
    }
  }

  @Auth(Role.ADMIN, Role.SUPERADMIN)
  @Delete(':id')
  @HttpCode(204) // Si retorno un codigo 204 por mas que haga un return no retorna nada.
  async remove(
    @ActivateUser() ActivateUser: RequestAuthDto,
    @Param('id', idMongoPipe) id: string,
  ) {
    try {
      //console.log(ActivateUser)
      const user = await this.usersService.remove(id);
      if (!user) throw new NotFoundException(`User not found`);
      return user;
    } catch (error) {
      console.log(`${error}`);
      throw new ConflictException(`${error}`);
    }
  }
}
 