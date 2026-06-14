import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthUserContext } from '@leadflow/types';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): AuthUserContext => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
