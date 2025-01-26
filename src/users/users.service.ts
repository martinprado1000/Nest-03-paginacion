import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose'; // Es para inyectar modelos de esquemas en mongoose
import { Model } from 'mongoose';
import { User } from './schemas/user.schema'; // Obtenemos la classe Task, Luego cuando lo llamamos accedemos a Task.name qeu seria
import * as bcrypt from 'bcrypt';
import { ResponseUserDto } from './dto/response-user.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  // -----------FIND ALL---------------------------------------------------------------------------------
  async findAll() {
    // const users = await this.userModel.find();
    // return users;
    return await this.userModel.find(); 
  }

  // -----------FIND ALL RESPONSE-------------------------------------------------------------
  async findAllResponse() {
    const users = await this.userModel.find();
    return plainToInstance(ResponseUserDto, users.map(user => user.toObject()), {
      excludeExtraneousValues: true, // Excluye propiedades NO marcadas con @Expose en el response-user.dto
    });
  }

  // -----------FIND BY ID-------------------------------------------------------------------------------
  async findOne(id: string) {
    return await this.userModel.findById(id);
  }

  // -----------FIND BY ID RESPONSE------------------------------------------------------------
  async findByIdResponse(id: string) {
    //return await this.userModel.findById(id).select('-password').exec();
    const user = await this.userModel.findById(id);

    if (!user) throw new NotFoundException(`User with id ${id} not found`)

    const responsUser: ResponseUserDto = plainToInstance(ResponseUserDto, user.toObject(), { // Paso por el metodo ResponseUserDto para retornar un objeto editado sin el password, se lo paso como objeto plano de javaScript
      excludeExtraneousValues: true, // Excluye propiedades NO marcadas con @Expose
    },
  );
  return responsUser;
  }

  // -----------FIND BY EMAIL-----------------------------------------------------------------------------
  async findByEmail(email: string): Promise<User | null> {// Creo que al usar Promise no es necesario ponerle el await a la consulta.
    //return this.userModel.findOne({ email }).exec();
    return this.userModel.findOne({ email }); // { email: email }
  }

  // -----------CREATE------------------------------------------------------------------------------------
  async create(createUserDto: CreateUserDto): Promise<ResponseUserDto> {
    let { email, password, confirmPassword } = createUserDto;

    if (password != confirmPassword) throw new BadRequestException('Password does not match');

    confirmPassword = null;
    delete createUserDto.confirmPassword;

    const userExist = await this.findByEmail(email);
    if (userExist) throw new ConflictException(`The user already exists`);

    const hashedPassword = await bcrypt.hash(password, 10);

    password = null;

    createUserDto.password = hashedPassword;
    let newUser = await this.userModel.create(createUserDto);
    //console.log(newUser)
    
    const newUserResponse: ResponseUserDto = plainToInstance(ResponseUserDto, newUser.toObject(), { // Paso por el metodo ResponseUserDto para retornar un objeto editado sin el password, se lo paso como objeto plano de javaScript
        excludeExtraneousValues: true, // Excluye propiedades NO marcadas con @Expose
      },
    );
    console.log(newUserResponse)
    return newUserResponse;
  }

  // async create(createUserDto: CreateUserDto) {
  //   return await this.userModel.create(createUserDto);
  // }

  // -----------UPDATE-------------------------------------------------------------------------------
  async update(id: string, updateUserDto: UpdateUserDto) {
    const updatedUser = await this.userModel.findByIdAndUpdate(id, updateUserDto, {
      new: true,  // {new:true}  es para que me retorne el objeto ya editado
    });

    console.log(updatedUser);

    if (!updatedUser) throw new NotFoundException(`User with id ${id} not found`)

    const updatedUserResponse = plainToInstance(ResponseUserDto, updatedUser.toObject(), { // Paso por el metodo ResponseUserDto para retornar un objeto editado sin el password, se lo paso como objeto plano de javaScript
      excludeExtraneousValues: true, // Excluye propiedades NO marcadas con @Expose
    },
  );

  return updatedUserResponse;
  }

  //async update(id: string, updateUserDto: UpdateUserDto) {
    //const usersUpdated = await this.userModel.findByIdAndUpdate(id,updateUserDto,{new:true});
    //return usersUpdated;
  //}

  // -----------DELETE-------------------------------------------------------------------------------
  async remove(id: string) {
    return await this.userModel.findByIdAndDelete(id);
  }

  // -----------GENERETE SEED USERS-------------------------------------------------------------------------------
  async genereteSeedUsers(createUserDto:CreateUserDto) {
    const seedUsers = await this.create(createUserDto)
    return seedUsers;
  }
}
