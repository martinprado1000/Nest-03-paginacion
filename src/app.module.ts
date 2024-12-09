import { MiddlewareConsumer, Module, NestModule, Request } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { LoggerModule } from './logger/logger.module';
import { CorrelationIdMiddleware } from './middlewares/correlation-id.middleware';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import 'winston-mongodb';

@Module({
  imports: [
    // Conexión a MongoDB para la aplicación
    MongooseModule.forRoot('mongodb://localhost:27017/Nest-02-plantilla'),

    // Configuración de Winston con la conexión existentee
    WinstonModule.forRootAsync({
      useFactory: () => {
        return{
          transports:[
            new winston.transports.Console({
              level: 'debug', // Si esto no lo configuro el valor default es 'info'.
              format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.ms(),
                winston.format.colorize(),
                winston.format.printf(({ level, message, timestamp, context, trace }) => {
                  const correlationId = CorrelationIdMiddleware.getCorrelationId();
                  return `[${level}] ${timestamp} [Cid: ${correlationId || 'no-correlation-id'}] ${context || ''}: ${message}. Detail:${trace || 'no-detail'}`;
                }),
              ),
            }),
            new winston.transports.MongoDB({
              level: 'info', // Este es el valor default, lo podrías omitir.
              db: 'mongodb://localhost:27017/Nest-02-plantilla1', // URL de la base de datos
              collection: 'logs', // Colección donde se guardan los logs
              format: winston.format.combine(
                winston.format.json(),
                winston.format((info) => {
                  const correlationId = CorrelationIdMiddleware.getCorrelationId();
                  info.correlationId = correlationId || 'no-correlation-id';
                  return info;
                })(),
              ),
            })
          ]
        }
      },
    }),

    LoggerModule,
    UsersModule,
    AuthModule,
  ],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorrelationIdMiddleware).forRoutes('*');
  }
}