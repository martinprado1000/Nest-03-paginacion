import { Module } from '@nestjs/common';
// npm i @nestjs/mongoose mongoose
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
//import { TaskModule } from './task/task.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/Nest-02-plantilla'),  // Importamos La base y le ponemos como nombre nest-00
    UsersModule,
    AuthModule
    //TaskModule,
  ],
})
export class AppModule {}