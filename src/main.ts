import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // app.setGlobalPrefix('api')  // A todas las rutas le agrega este prefijo antes

  app.useGlobalPipes(new ValidationPipe({
    whitelist:true,  // Esta linea lo que hace es que si me mandan datos de mas que no los reciba.
    //forbidNonWhitelisted: true, // Retorna el error si nos envian datos de mas.
    transform:true  // Esta opcion lo que hace es que si me mandan un param como number y yo le indico que es un number lo transforma automaticamente.
  }));     
  // app.useGlobalPipes(new ValidationPipe());  
  // Esta linea hace que cada vez que se llame a una ruta primero pasa por las
  // validaciones de class-validator. Lo hacemos aca porque lo hace para todas las rutas a nivel global. Osea lo que hace es que
  // me retorne los errores en forma de objeto y no se rompa la aplicacion. 
  // Esto se podria hacer en el controllador de las rutas deseadas.
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();