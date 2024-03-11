import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { Role } from 'src/user/types/userRole.type';

// extends AuthGuard('jwt') : JWT 인증 전략을 기본으로 가져가면서 부가적으로 인가 기능까지 수행
/* 작동순서
    1. @Roles(Role.Admin)이라는 데코레이터를 발견
    2. @Roles(Role.Admin) 데코레이터는 roles라는 키로 메타데이터를 설정하고 이 메타데이터는 Role.Admin이라는 값을 가짐
    3. @Roles(Role.Admin) 데코레이터가 붙은 API를 호출하면 Nest.js는 RolesGuard의 canActivate 메소드를 호출
    4. requiredRoles메소드에서 Reflector를 사용하여 roles 키를 가진 메타데이터를 읽음. 
    5. 데코레이터에서 Role.Admin만 인자로 넘기고 있기 때문에 메타데이터의 값= Role.Admin
    6. 현재 인증된 사용자의 역할(user.role)과 비교 true, false반환

*/
@Injectable()
export class RolesGuard extends AuthGuard('jwt') implements CanActivate {
  // Reflector : 리플렉션을 사용하여 메타데이터에 액세스할 수 있는 도구
  constructor(private readonly reflector: Reflector) {
    super();
  }
  // context: ExecutionContext:  NestJS에서 사용되는 실행 컨텍스트 객체
  async canActivate(context: ExecutionContext) {
    //super.canActivate(context) : JWT 인증이 성공적으로 수행되었는지 확인
    const authenticated = await super.canActivate(context);
    if (!authenticated) {
      return false;
    }

    // getAllAndOverride : 여러 위치에서 메타데이터를 가져와서 결합하고 재정의하는 역할
    //                     메타 데이터가 여러 곳에 설정되어 있을 때, 이를 결합하고 우선순위를 부여하여 최종적인 값을 얻음.
    // 두번째 매개변수는 메타데이터를 찾을 위치를 나타냄.
    // NestJS는 주로 메타데이터가 컨트롤러클래스와 핸들러메서드에 설정됨.
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(), // 현재 요청을 처리하는 핸들러(메서드)에 설정된 메타데이터를 가져옴
      context.getClass(), // 현재 요청을 처리하는 컨트롤러 클래스에 설정된 메타데이터를 가져옴
    ]);

    // getAllAndOverride 메서드는 메타데이터가 없는 경우 undefined를 반환
    // undefined인 경우에는 요청에 대한 역할(Role) 제한이 없다는 것을 의미
    // 이 경우에는 모든 사용자에게 요청이 허용되어야 하므로 true를 반환하여 요청을 허용
    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => +user.isAdmin === role);
  }
}
