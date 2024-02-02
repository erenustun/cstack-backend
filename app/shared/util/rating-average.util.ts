import {
  Product,
  ProductsFetchResponse,
} from '@shared/model/product/product.model'
import { ProductRating } from '@shared/model/product/rating.model'
import { PaginationArgs } from '@shared/dto/product/pagination.args'
import { FilterArgs } from '@shared/dto/product/filter.args'

export const withRating = (product: Product): Product => {
  let ratingTotal = 0
  const ratingCount = Array.isArray(product.rating) && product.rating.length

  product?.rating?.map((rating: ProductRating) => {
    ratingTotal = rating.star + ratingTotal
  })
  product.ratingAverage = ratingTotal / Number(ratingCount)

  return product
}

export const withRatingArray = (
  products: Product[],
  paginationArgs: PaginationArgs,
  count: number,
  filter?: FilterArgs
): ProductsFetchResponse => {
  const { take } = paginationArgs
  products.map((product: Product, i: number) => {
    if (product.rating && product.rating?.length > 0) {
      const ratingCount =
        Array.isArray(products[i].rating) && products[i]?.rating?.length
      let ratingTotal = 0
      products[i]?.rating?.map((rating: ProductRating) => {
        ratingTotal = rating.star + ratingTotal
      })
      products[i].ratingAverage = ratingTotal / Number(ratingCount)
    }
  })
  return {
    data: products,
    take,
    count,
    ...(filter && filter),
  }
}
