import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ActivateUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest(); // ctx.switchToHttp().getRequest();  Este metodo lee el request, por lo tanto con este decorador que estamos haciendo retornamos el usuario que esta en el request.
    return request.user;
  },
);