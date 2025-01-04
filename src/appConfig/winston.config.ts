import { ConfigService } from '@nestjs/config';
import { WinstonModuleOptions } from 'nest-winston';
import { CorrelationIdMiddleware } from 'src/middlewares/correlation-id.middleware';
import * as winston from 'winston';
import 'winston-mongodb';

export const winstonConfigFactory = (configService: ConfigService): WinstonModuleOptions => {
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
        db: configService.get<string>('database.uri'), // URL de la base de datos
        //db: 'mongodb://localhost:27017/Nest-02-plantilla',
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
}