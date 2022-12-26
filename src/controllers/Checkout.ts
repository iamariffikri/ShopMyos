import Order from '../models/Order'
import { Invoice } from '../interfaces/Order'
import { Product } from '../interfaces/Product'
import ProductService, { ProductServiceType } from '../services/Product'
import CartService, { CartServiceType } from '../services/Cart'
import OrderService, { OrderServiceType } from '../services/Order'
import Database from '../providers/Database'

export default class Checkout {
  productService: ProductServiceType
  cartService: CartServiceType
  orderService: OrderServiceType

  constructor(
    productService: ProductServiceType,
    cartService: CartServiceType,
    orderService: OrderServiceType
  ) {
    this.productService = productService
    this.cartService = cartService
    this.orderService = orderService
  }

  public static getController() {
    const database = new Database()
    const product = new ProductService(database)
    const order = new OrderService(database)
    const cart = new CartService(database)
    return new Checkout(product, cart, order)
  }

  public static async perform(req, res): Promise<Invoice> {
    const userId = req.headers['userid']
    const body = req.body

    const orders: Order[] = body.map(
      (order) => new Order(order.id, order.quantity)
    )

    const controller = Checkout.getController()
    const invoice = await controller.checkout(orders, userId)

    const successfulOrder = invoice.orders
    if (successfulOrder.length == 0) {
      return res.status(404).json({
        message:
          'All items you interested has sold-out. Check again next time.',
      })
    }

    return res.status(201).json({
      message:
        'Successfully created order, proceed for payment using Invoice ID',
      invoice,
    })
  }

  async checkout(orders: Order[], userId: number): Promise<Invoice> {
    // check product quantity
    const productIds = orders.map((order) => {
      return order.id
    })

    const productsQuantity = await this.productService.checkQuantity(productIds)

    // deduct product quantity
    const availableForOrder = this.getAvailableOrders(orders, productsQuantity)
    await this.productService.deductQuantity(availableForOrder)

    // create one cart_order with total amount
    const cartOrder = await this.cartService.createCartOrder(
      availableForOrder,
      productsQuantity
    )

    // create record in order_details with card_order id
    await this.orderService.createOrderDetails(
      availableForOrder,
      cartOrder.id,
      userId
    )

    return {
      cartId: cartOrder.id,
      orders: availableForOrder,
      grandTotal: cartOrder.amount,
    }
  }

  getAvailableOrders(orders: Order[], products: Product[]): Order[] {
    return orders
      .map((order) => {
        const productAvailability = products.find(
          (product) => product.id == order.id
        )
        if (
          productAvailability == undefined ||
          productAvailability.quantity == 0
        ) {
          // product is not available for order
          return undefined
        }
        const orderQuantity =
          productAvailability.quantity > order.quantity
            ? order.quantity
            : productAvailability.quantity

        const orderItem = new Order(order.id, orderQuantity)
        return orderItem
      })
      .filter((x) => x)
  }
}
