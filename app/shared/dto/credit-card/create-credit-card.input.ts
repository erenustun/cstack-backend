import { Field, InputType, Int } from '@nestjs/graphql'

@InputType()
export class CreateCreditCardInput {
  creditCardNumber: string
  expirationDate: Date
  @Field(() => Int)
  main?: boolean
}
