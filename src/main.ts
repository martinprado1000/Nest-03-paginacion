import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from "@nestjs/common";
import { AllExceptionsFilter } from './allExceptionsFilter';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    //logger: false,
    //logger: new CustomLoggerService(),
  });

  //app.useGlobalFilters(new AllExceptionsFilter());

  // app.setGlobalPrefix('api')  // A todas las rutas le agrega este prefijo antes
  
  // app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER)); // Aca le indico que use el Logger de winston. Lo importo de nest-winston:  import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

  app.enableCors();

  app.useGlobalPipes(new ValidationPipe({
    whitelist:true,  // Esta linea lo que hace es que si me mandan datos de mas que no los reciba.
    forbidNonWhitelisted: true, // Retorna el error si nos envian datos de mas.
    transform:true,      //convertir automáticamente los datos recibidos (por ejemplo, de un req.body) al tipo definido en el DTO.
    transformOptions:{   //conversión implícita de tipos sin necesidad de usar el decorador @Type() de class-transformer.
      enableImplicitConversion: true,
    }
  }));    
  // Esto hace que cada vez que se llame a una ruta primero pasa por las
  // validaciones de class-validator. Lo hacemos aca porque lo hace para todas las rutas a nivel global. Osea lo que hace es que
  // me retorne los errores en forma de objeto y no se rompa la aplicacion. 
  // Esto se podria hacer en el controlador de las rutas deseadas.

  const configService = app.get(ConfigService) // Obtengo las variables de entorno desde: import { ConfigService } from '@nestjs/config';
  //console.log(configService)
  
  //await app.listen(process.env.PORT ?? 3000);
  const PORT:number = configService.get('port')
  //await app.listen(Number(PORT) ?? 3000);
  await app.listen(Number(PORT)); // El valor por defecto en el caso que no lo este en el .env lo obtiene del envSchema
  
}
bootstrap();