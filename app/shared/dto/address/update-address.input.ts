import { InputType, PartialType } from '@nestjs/graphql'
import { CreateAddressInput } from '@shared/dto/address/create-address.input'

@InputType()
export class UpdateAddressInput extends PartialType(CreateAddressInput) {}
