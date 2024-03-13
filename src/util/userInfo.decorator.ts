import { ExecutionContext, createParamDecorator } from '@nestjs/common';

// UserInfo라는 데코레이터를 만든다.
export const UserInfo = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest(); // 그 데코레이터의 역할은 현재 실행컨택스트 내의 request를 가져온다.
    return request.user ? request.user : null;
  },
);
