import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants/jwt.constant'; // Importamos nuestra palabra secreta

@Module({
  imports: [
    UsersModule,
    JwtModule.register({ // Importamos el jwt
      global: true,       // Lo importamos de forma global.
      secret: jwtConstants.secret,  // Le indicamos cual es la palabra secreta.
      signOptions: { expiresIn: '1h' },  // Tiempo de expiración. d:dia m:minutor s:segundos.
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
