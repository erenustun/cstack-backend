import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { AuthenticationService } from '@shared/service/authentication.service'
import { UserService } from '@shared/service/user.service'
import { UseGuards } from '@nestjs/common'
import { LocalAuthGuard } from '@feature/authentication/guard/local-auth.guard'
import { RoleGuard } from '@feature/authentication/guard/role.guard'
import { JwtAuthGuard } from '@feature/authentication/guard/jwt-auth.guard'
import { Role } from '@shared/enum/user/role.enum'
import { HasRoles } from '@shared/decorator/role.decorator'
import { CurrentUser } from '@shared/decorator/current-user.decorator'
import { IUpdateResponse } from '@shared/dto/typeorm-result.dto'
import { AuthRegisterResponse } from '@shared/model/authentication/auth-register-response.model'
import { RegisterInput } from '@shared/dto/authentication/register.input'
import { AuthLoginResponse } from '@shared/model/authentication/auth-login-response.model'
import { LoginInput } from '@shared/dto/authentication/login.input'
import { AuthEmailResponse } from '@shared/model/authentication/auth-email-response.model'
import { User } from '@shared/model/user.model'
import { TokenVerificationResponse } from '@shared/model/authentication/auth-token-response.model'
import { TokenVerifyInput } from '@shared/dto/authentication/token-verify.input'
import { PasswordChangeInput } from '@shared/dto/authentication/password-change.input'
import { EmailChangeInput } from '@shared/dto/authentication/email-change.input'

@Resolver()
export class AuthenticationResolver {
  constructor(
    private readonly authService: AuthenticationService,
    private userService: UserService
  ) {}

  @Mutation(() => AuthRegisterResponse)
  async signUp(
    @Args('input') registerArgs: RegisterInput
  ): Promise<AuthRegisterResponse> {
    const { firstName, lastName, email, avatar, password, phone } = registerArgs

    return await this.authService.register({
      ...(avatar && { avatar }),
      firstName,
      lastName,
      email,
      password,
      ...(phone && { phone }),
    })
  }

  @UseGuards(LocalAuthGuard)
  @Mutation(() => AuthLoginResponse, { nullable: true })
  async signIn(
    @Args('input') loginArgs: LoginInput
  ): Promise<AuthLoginResponse> {
    return this.authService.login(loginArgs.email)
  }

  @Query(() => AuthEmailResponse)
  async requestPasswordChange(@Args('email') email: string) {
    return await this.authService.sendPasswordChangeMail(email)
  }

  @Query(() => AuthEmailResponse)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @HasRoles(Role.CUSTOMER)
  async requestEmailChange(
    @Args('email') email: string,
    @CurrentUser() user: User
  ) {
    return await this.authService.sendEmailChangeMail(email, user.email)
  }

  @Query(() => TokenVerificationResponse)
  async verifyToken(@Args('input') tokenVerifyArgs: TokenVerifyInput) {
    const response = await this.authService.verifyToken(tokenVerifyArgs)
    if (response) return { valid: true }
    else return { valid: false }
  }

  @Mutation(() => IUpdateResponse)
  async changePassword(@Args('input') passwordChangeArgs: PasswordChangeInput) {
    return await this.userService.changePassword(passwordChangeArgs)
  }

  @Mutation(() => IUpdateResponse)
  async changeEmail(@Args('input') emailChangeArgs: EmailChangeInput) {
    return await this.userService.changeEmail(emailChangeArgs)
  }
}
