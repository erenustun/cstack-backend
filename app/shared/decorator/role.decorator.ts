import { SetMetadata } from '@nestjs/common'
import { Role } from '@shared/enum/user/role.enum'

export const ROLES_KEY = 'role'
export const HasRoles = (...args: Role[]) => SetMetadata(ROLES_KEY, args)
