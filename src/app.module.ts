import { join } from 'path';
import { MiddlewareConsumer, Module, NestModule, Request } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { LoggerModule } from './logger/logger.module';
import { CorrelationIdMiddleware } from './middlewares/correlation-id.middleware';
import { WinstonModule } from 'nest-winston';
import 'winston-mongodb';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { envLoader } from './envLoader';
import { envSchema } from 'src/envSchema';
import { mongooseConfigFactory } from './appConfig/mongoose.config';
import { winstonConfigFactory } from './appConfig/winston.config';
import { SeedModule } from './seed/seed.module';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [
    // npm i --save @nestjs/config  .Es para configurar las variables de entorno
    // npm i --save joi             .Es para validar las variables de entorno
    ConfigModule.forRoot({  // .Obtiene variables de entorno. Por default las obtien de .env en la raiz
      load: [envLoader],    // Le indicamos de que archivo levantar las variables de entorno. Lo hago asi para poder estructurar mejor los datos.
      validationSchema: envSchema,
    }),

    //MongooseModule.forRoot('mongodb://localhost:27017/Nest-02-plantilla'), 
    MongooseModule.forRootAsync({
      imports: [ConfigModule],    // IMPORTA ConfigModule para poder usar el configService que configuramos en el main
      inject: [ConfigService],    // Inyecta el ConfigService
      useFactory: mongooseConfigFactory,
    }),

    // Configuración de Winston
    WinstonModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: winstonConfigFactory,
    }),

    ServeStaticModule.forRoot({  // Indicamos la ruto de nuestras archivos publicos
      rootPath: join(__dirname,'..','public'), 
    }), 

    LoggerModule,
    UsersModule,
    AuthModule,
    SeedModule,
  ],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorrelationIdMiddleware).forRoutes('*');
  }
}