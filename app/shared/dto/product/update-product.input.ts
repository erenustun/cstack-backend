import { InputType, PartialType } from '@nestjs/graphql'
import { CreateProductInput } from '@shared/dto/product/create-product.input'

@InputType()
export class UpdateProductInput extends PartialType(CreateProductInput) {}
