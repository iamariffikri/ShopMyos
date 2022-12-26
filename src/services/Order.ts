import Database from '../providers/Database'
import Order from '../models/Order'

export interface OrderServiceType {
  queryOrder(query: string): Promise<void>
  createOrderDetails(orders: Order[], cartOrderId: number, userId: number)
}

class OrderService implements OrderServiceType {
  private database: Database
  private DB_NAME = 'myos-ecommerce'

  constructor(database: Database) {
    this.database = database
  }

  queryOrder(query: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.database.getConnection(this.DB_NAME).query(query, (error) => {
        if (error) {
          console.error(error)
          reject()
        }

        resolve()
      })
    })
  }

  async createOrderDetails(
    orders: Order[],
    cartOrderId: number,
    userId: number
  ) {
    const orderValues = orders
      .map((order) => {
        return `(${order.quantity}, ${userId}, ${cartOrderId}, ${order.id})`
      })
      .join(', ')
    const query = `INSERT INTO order_details (quantity, user_id, cart_id, product_id) VALUES ${orderValues}`
    await this.queryOrder(query)
  }
}

export default OrderService
