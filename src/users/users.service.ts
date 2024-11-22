import {
  Injectable,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose'; // Es para inyectar modelos de esquemas en mongoose
import { Model } from 'mongoose';
import { User } from './schemas/User.schema'; // Obtenemos la classe Task, Luego cuando lo llamamos accedemos a Task.name qeu seria
import * as bcrypt from 'bcrypt';
import { ResponseUserDto } from './dto/response-user.dto';
import { plainToInstance, TransformPlainToInstance } from 'class-transformer';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  // -----------FIND ALL---------------------------------------------------------------------------------
  async findAll() {
    // const users = await this.userModel.find();
    // return users;
    return await this.userModel.find();
  }
  
  // -----------FIND ALL WITHOUT PASSWORD-------------------------------------------------------------
  async findAllWithOutPassword() {
    const users = await this.userModel.find();
    return plainToInstance(ResponseUserDto, users.map(user => user.toObject()), {
      excludeExtraneousValues: true,
    });
  }

  // -----------FIND BY ID-------------------------------------------------------------------------------
  async findOne(id: string) {
    return await this.userModel.findById(id);
  }

  // -----------FIND BY ID WITHOUT PASSWORD------------------------------------------------------------
  async findByIdWithOutPassword(id: string) {
    return await this.userModel.findById(id).select('-password').exec();
  }

  // -----------FIND BY EMAIL-----------------------------------------------------------------------------
  async findByEmail(email: string): Promise<User | null> {// Creo que al usar Promise no es necesario ponerle el await a la consulta.
    return this.userModel.findOne({ email }).exec();
  }

  // -----------CREATE------------------------------------------------------------------------------------
  async create(createUserDto: CreateUserDto) {
    let { email, password, confirmPassword } = createUserDto;

    if (password != confirmPassword) {
      throw new BadRequestException('Password does not match');
    }

    confirmPassword = null;
    delete createUserDto.confirmPassword;

    const userExist = await this.findByEmail(email);
    if (userExist) {
      throw new ConflictException(`The user already exists`);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    password = null;

    createUserDto.password = hashedPassword;
    let newUser = await this.userModel.create(createUserDto);
    //console.log(newUser)
    
    const newUserResponse = plainToInstance(ResponseUserDto, newUser.toObject(), { // Paso por el metodo ResponseUserDto para retornar un objeto editado sin el password, se lo paso como objeto plano de javaScript
        excludeExtraneousValues: true, // Excluye propiedades no marcadas con @Expose
      },
    );
    //console.log(newUserResponse)
    return newUserResponse;
  }

  // async create(createUserDto: CreateUserDto) {
  //   // const newUser = new this.userModel(createUserDto);
  //   // const userCreated = await newUser.save();
  //   // return userCreated;
  //   return await this.userModel.create(createUserDto);
  // }

  // -----------UPDATE-------------------------------------------------------------------------------
  async update(id: string, updateUserDto: UpdateUserDto) {
    //const editedUser = new this.userModel(updateUserDto);
    //const userUpdated = await editedUser.save();
    //return usersUpdated;
    return await this.userModel.findByIdAndUpdate(id, updateUserDto, {
      new: true,
    }); // {new:true}  es para que me retorne el objeto ya editado
  }

  // -----------DELETE-------------------------------------------------------------------------------
  async remove(id: string) {
    return await this.userModel.findByIdAndDelete(id);
  }
}
