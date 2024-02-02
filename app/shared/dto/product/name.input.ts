import { InputType, ObjectType } from '@nestjs/graphql'

@ObjectType()
@InputType('NameInput')
export class Name {
  name: string
}
