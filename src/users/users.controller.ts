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
  } from '@nestjs/common';
  import { UsersService } from './users.service';
  import { CreateUserDto } from './dto/create-user.dto';
  import { UpdateUserDto } from './dto/update-user.dto';
  import { UserPipe } from './pipes/user/user.pipe';

@Controller('users')
export class UsersController {

    constructor(private readonly usersService: UsersService) {}

    @Get()
    findAll() {
      return this.usersService.findAll();
    }
  
    @Get(':id')
    async findOne(@Param('id',UserPipe) id: string) {  // UserPipe: con el pipe chequeo si el id es un id valido de Mongoose
      const user = await this.usersService.findOne(id);
      if (!user) {
        throw new NotFoundException(`User not found`);
      }
      return user;
    }
  
    @Post()
    async create(@Body() createUserDto: CreateUserDto) {
      try {
        return await this.usersService.create(createUserDto);
      } catch (error) {
        if (error.code === 11000) { // 11000  Es el codigo de error que me retorna mongoose si esta duplicada una propiedad unique
          console.log(`The user already exists: ${error} `);
          throw new ConflictException(`The user already exists`);
        } else {
          console.log(`Error querying database: ${error}`);
          throw new ConflictException(`Error querying database`);
        }
      }
    }
  
    @Patch(':id')
    async update(@Param('id',UserPipe) id: string, @Body() updateUserDto: UpdateUserDto) {
      const user = await this.usersService.update(id, updateUserDto);
      if (!user) {
        throw new NotFoundException(`User not found`);
      }
      return user;
    }
  
    @Delete(':id')
    @HttpCode(204) // Si retorno un 204 por mas que haga un return no retorna nada
    async remove(@Param('id',UserPipe) id: string) {
      const user = await this.usersService.remove(id);
      if (!user) {
        throw new NotFoundException(`User not found`);
      }
      return user;
    }

}
