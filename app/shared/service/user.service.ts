import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common'
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm'
import { DataSource, DeleteResult, Repository, UpdateResult } from 'typeorm'
import { genSalt, hash } from 'bcrypt'
import { RECORD_NOT_FOUND } from '@shared/constant/error.constant'
import { userMock } from '@feature/user/user.mock'
import { TOKEN_INVALID } from '@shared/constant/authentication/response.constant'
import { User } from '@shared/model/user.model'
import { CreateUserInput } from '@shared/dto/user/create-user.input'
import { UpdateUserInput } from '@shared/dto/user/update-user.input'
import { EmailChangeInput } from '@shared/dto/authentication/email-change.input'
import { RegisterInput } from '@shared/dto/authentication/register.input'
import { PasswordChangeInput } from '@shared/dto/authentication/password-change.input'

@Injectable()
export class UserService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectDataSource()
    private dataSource: DataSource
  ) {}

  async onModuleInit(): Promise<void> {
    await this.mockUsers()
  }

  /**
   * Fetches all records
   * @param condition used as sql where statement (javascript object syntax)
   */
  async fetch(condition?: object): Promise<User[]> {
    try {
      return await this.userRepo.find({
        ...(condition && { where: condition }),
      })
    } catch (error) {
      Logger.error(error)
      throw new InternalServerErrorException()
    }
  }

  /**
   * Fetch one record by condition
   * @param condition used as sql where statement (javascript object syntax)
   */
  async fetchOne(condition: object) {
    try {
      return await this.userRepo.findOne({
        where: condition,
      })
    } catch (error) {
      Logger.error(error)
      throw new InternalServerErrorException()
    }
  }

  /**
   * Saves a record
   * @param user DTO
   */
  async save(
    user: CreateUserInput | RegisterInput
  ): Promise<User | UpdateResult> {
    try {
      const { email, password } = user

      const userFound = await this.userRepo.findOne({ where: { email } })
      if (userFound)
        return await this.userRepo.update(userFound.id as string, user)

      const salt = await genSalt()
      user.password = await hash(password, salt)

      return await this.userRepo.save(user)
    } catch (error) {
      Logger.error(error)
      throw new InternalServerErrorException()
    }
  }

  /**
   * Updates record by identifier
   * @param id  Record identifier to be updated
   * @param user DTO
   */
  async update(id: string, user: UpdateUserInput): Promise<User> {
    try {
      const record = await this.userRepo.findOne({
        where: { id },
      })
      Object.assign(record as User, user)
      return await this.userRepo.save(record as User)
    } catch (error) {
      Logger.error(error)
      throw new InternalServerErrorException()
    }
  }

  /**
   * Deletes a record by identifier
   * @param id Record id identifier be soft deleted
   */
  async delete(id: string): Promise<DeleteResult> {
    try {
      return await this.userRepo.softDelete(id)
    } catch (error) {
      Logger.error(error)
      throw new InternalServerErrorException()
    }
  }

  /**
   * Restores a record by identifier
   * @param id Record identifier to be restored
   */
  async restore(id: string): Promise<UpdateResult> {
    try {
      const userRestored = await this.userRepo.restore(id)
      if (!userRestored) throw new NotFoundException(RECORD_NOT_FOUND)

      return userRestored
    } catch (error) {
      Logger.error(error)
      throw new InternalServerErrorException()
    }
  }

  /**
   * Changes user password
   * @param passwordChangeArgs UUID4 token + new password
   */
  async changePassword(
    passwordChangeArgs: PasswordChangeInput
  ): Promise<UpdateResult> {
    try {
      const { token, password } = passwordChangeArgs

      const user = await this.userRepo.findOneBy({ passwordToken: token })
      if (!user) throw new NotFoundException(TOKEN_INVALID)

      const salt = await genSalt()
      user.password = await hash(password, salt)
      user.passwordToken = null
      user.passwordTokenCreated = null

      return await this.userRepo.update(user.id as string, user)
    } catch (error) {
      Logger.error(error)
      throw new InternalServerErrorException()
    }
  }

  /**
   * Changes user email
   * @param emailChangeArgs UUID4 token + new email address
   */
  async changeEmail(emailChangeArgs: EmailChangeInput): Promise<UpdateResult> {
    try {
      const { token, email } = emailChangeArgs

      const user = await this.userRepo.findOneBy({ emailToken: token })
      if (!user) throw new NotFoundException(TOKEN_INVALID)

      user.email = email
      user.emailToken = null
      user.emailTokenCreated = null

      return await this.userRepo.update(user.id as string, user)
    } catch (error) {
      Logger.error(error)
      throw new InternalServerErrorException()
    }
  }

  /**
   * Activates user account (sets activated_at column)
   * @param token UUID4 token
   */
  async activateAccount(token: string): Promise<User> {
    try {
      const user = await this.fetchOne({ activationToken: token })
      if (!user) throw new NotFoundException(TOKEN_INVALID)

      user.activated = new Date()
      user.activationToken = null

      return await this.update(user.id as string, user)
    } catch (error) {
      Logger.error(error)
      throw new InternalServerErrorException()
    }
  }

  /**
   * Inserts data into User table from `user.mock.ts`
   * Won't insert if data is found in table
   */
  async mockUsers(): Promise<any> {
    try {
      const users = await this.userRepo.find()
      if (users.length === 0) {
        return await this.dataSource
          .createQueryBuilder()
          .insert()
          .into(User)
          .values(userMock)
          .execute()
      }
    } catch (error) {
      Logger.error(error)
      throw new InternalServerErrorException()
    }
  }
}
