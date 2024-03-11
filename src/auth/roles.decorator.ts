import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/user/types/userRole.type';

// const Roles : 커스텀 데코레이터 이름, 사용예시 → @Roles
// Roles는 여러 역할을 매개변수로 받음, @Roles(Role.Admin, Role.User)
// SetMetadata('roles', roles) :  roles라는 문자열 키에 역할 정보를 저장하는 것
// => 여기서 만든 데코레이터를 가드에서 사용(Guard)
export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
