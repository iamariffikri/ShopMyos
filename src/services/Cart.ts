import { DatabaseType } from '../providers/Database'
import Product from '../models/Product'
import { CartOrderType } from '../interfaces/Order'
import CartOrder from '../models/CartOrder'
import Order from '../models/Order'
import Locals from '../providers/Locals'

export interface CartServiceType {
  queryCartOrder(query: string): Promise<number>
  createCartOrder(orders: Order[], products: Product[]): Promise<CartOrderType>
}

class CartService implements CartServiceType {
  private database: DatabaseType
  private DB_NAME = Locals.config().dbName

  constructor(database: DatabaseType) {
    this.database = database
  }

  queryCartOrder(query: string): Promise<number> {
    return new Promise((resolve, reject) => {
      this.database
        .getConnection(this.DB_NAME)
        .query(query, (error, results) => {
          if (error) {
            console.error(error)
            reject()
          }

          resolve(results.insertId)
        })
    })
  }

  async createCartOrder(
    orders: Order[],
    products: Product[]
  ): Promise<CartOrderType> {
    const totalAmount = orders.reduce((acc, current) => {
      const product = products.find((product) => product.id)
      return acc + current.quantity * product.price
    }, 0)

    const query = `INSERT INTO cart_order (amount, paymentStatus) VALUES (${totalAmount}, "pending")`
    const cartOrderId = await this.queryCartOrder(query)
    return new CartOrder(cartOrderId, totalAmount, 'pending')
  }
}

export default CartService
