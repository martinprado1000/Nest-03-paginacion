import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';  // Es para inyectar modelos de esquemas en mongoose
import { Model } from 'mongoose';
import { User } from './schemas/User.schema'; // Obtenemos la classe Task, Luego cuando lo llamamos accedemos a Task.name qeu seria


@Injectable()
export class UsersService {

    constructor(@InjectModel(User.name) private userModel: Model<User>) {} 

  async findAll() {
    // const users = await this.userModel.find();
    // return users;
    return await this.userModel.find();
  }

  async findOne(id: string) {
    return await this.userModel.findById(id);
  }

  async findByEmail(email: string): Promise<User | null> {  // Creo que al usar Promise no es necesario ponerle el await a la consulta.
    return this.userModel.findOne({ email }).exec();
  }

  async create(createUserDto: CreateUserDto) {
    // const newUser = new this.userModel(createUserDto);
    // const userCreated = await newUser.save();
    // return userCreated;
    return await this.userModel.create(createUserDto);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    //const editedUser = new this.userModel(updateUserDto);
    //const userUpdated = await editedUser.save();
    //return usersUpdated;
    return await this.userModel.findByIdAndUpdate(id,updateUserDto,{new:true}); // {new:true}  es para que me retorne el objeto ya editado
  }

  async remove(id: string) {
    return await this.userModel.findByIdAndDelete(id);
  }
  
}
