import { InputType } from '@nestjs/graphql'
import { Address } from '@shared/model/address.model'

@InputType()
export class CreateAddressInput extends Address {}
