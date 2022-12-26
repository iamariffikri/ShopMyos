/* eslint-env node, mocha */
import { assert } from 'chai'
import CheckoutController from '../../src/controllers/Checkout'
import ProductService from '../../src/services/Product'
import Database from '../../src/providers/Database'
import CartService from '../../src/services/Cart'
import OrderService from '../../src/services/Order'
import Order from '../../src/models/Order'
import Product from '../../src/models/Product'

describe('Checkout controller', function () {
  let controller: CheckoutController

  this.beforeEach(() => {
    const database = new Database()
    const productService = new ProductService(database)
    const cartService = new CartService(database)
    const orderService = new OrderService(database)
    controller = new CheckoutController(
      productService,
      cartService,
      orderService
    )
  })

  describe('getAvailableOrders', function () {
    describe('given product quantity > order', function () {
      it('return product as ordered', function () {
        const orderQuantity = 1
        const productQuantity = 2
        const product = new Product(1, 'title', 'desc', '', productQuantity, 10)
        const order = new Order(1, orderQuantity)

        const finalizedOrders = controller.getAvailableOrders(
          [order],
          [product]
        )

        assert.equal(finalizedOrders.length, 1)
        assert.equal(finalizedOrders[0].quantity, orderQuantity)
      })
    })

    describe('given product quantity < order', function () {
      it('return product as stock left for sale', function () {
        const orderQuantity = 2
        const productQuantity = 1
        const product = new Product(1, 'title', 'desc', '', productQuantity, 10)
        const order = new Order(1, orderQuantity)

        const finalizedOrders = controller.getAvailableOrders(
          [order],
          [product]
        )

        assert.equal(finalizedOrders.length, 1)
        assert.equal(finalizedOrders[0].quantity, productQuantity)
      })
    })
  })
})
