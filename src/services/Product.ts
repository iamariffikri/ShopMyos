import { DatabaseType } from '../providers/Database'
import Product from '../models/Product'
import { OrderType } from '../interfaces/Order'
import Locals from '../providers/Locals'

export interface ProductServiceType {
  checkQuantity(productIds: number[]): Promise<Product[]>
  deductQuantity(orders: OrderType[])
  getProducts(
    sortByColumn: string | undefined,
    descending: boolean,
    keyword: string | undefined
  ): Promise<Product[]>
}

class ProductService implements ProductServiceType {
  private database: DatabaseType
  private DB_NAME = Locals.config().dbName

  constructor(database: DatabaseType) {
    this.database = database
  }

  getProductQuery(sortByColumn: string, descending: boolean, keyword: string) {
    let query =
      'SELECT id, title, description, imageUrl, quantity, price FROM product'

    if (keyword && keyword.length > 0) {
      const searchQuery = ` WHERE title LIKE '%${keyword}%' OR description LIKE '%${keyword}%'`
      query = query + searchQuery
    }

    if (sortByColumn) {
      query = query + ` ORDER BY ${sortByColumn}`

      if (descending) {
        query = query + ` DESC`
      }
    }

    return query
  }

  getProducts(
    sortByColumn: string | undefined,
    descending: boolean = false,
    keyword: string | undefined
  ): Promise<Product[]> {
    const query = this.getProductQuery(sortByColumn, descending, keyword)
    return this.queryProduct(query)
  }

  queryProduct(query: string): Promise<Product[]> {
    return new Promise((resolve) => {
      this.database
        .getConnection(this.DB_NAME)
        .query(query, (error, results) => {
          if (error) {
            console.error(error)
            resolve([])
          }

          try {
            const products = results
              .map((result) => {
                return new Product(
                  result.id,
                  result.title,
                  result.description,
                  result.imageUrl,
                  result.quantity,
                  result.price
                )
              })
              .filter((x) => x)
            resolve(products)
          } catch (e) {
            resolve([])
          }
        })
    })
  }

  checkQuantity(productIds: number[]): Promise<Product[]> {
    const idCompareSql = productIds
      .map((id) => {
        return `id = ${id}`
      })
      .join(' OR ')
    const query = `SELECT id, price, quantity FROM product WHERE ${idCompareSql}`
    return this.queryProduct(query)
  }

  async deductQuantity(orders: OrderType[]) {
    const queries = orders
      .map((order) => {
        return `
              UPDATE product
              SET quantity = quantity - ${order.quantity}
              WHERE id = ${order.id} && quantity > 0
            `
      })
      .map((query) => this.queryProduct(query))

    await Promise.all(queries)
  }
}

export default ProductService
