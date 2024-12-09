import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ActivateUser = createParamDecorator(   // createParamDecorator: es un helper de NestJS para crear decoradores de parámetros.
  (data: unknown, ctx: ExecutionContext) => {       // ExecutionContext: Accede al contexto del request.
    const request = ctx.switchToHttp().getRequest(); // ctx.switchToHttp().getRequest();  Este metodo lee el request, por lo tanto con este decorador que estamos haciendo retornamos el usuario que esta en el request.
    //console.log(request.correlationId)
    return request.user;
  },
);