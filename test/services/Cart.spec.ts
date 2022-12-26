/* eslint-env node, mocha */
import { assert } from 'chai'
import MockDatabase from '../mocks/Database'
import CartService, { CartServiceType } from '../../src/services/Cart'
import Order from '../../src/models/Order'
import Product from '../../src/models/Product'

describe('Cart service', function () {
  let service: CartServiceType
  let mockDatabase: MockDatabase
  let insertQuery: string

  this.beforeEach(() => {
    mockDatabase = new MockDatabase()

    service = new CartService(mockDatabase)
    insertQuery = `INSERT INTO cart_order (amount, paymentStatus) VALUES (<totalAmount>, "pending")`
  })

  describe('createCartOrder', function () {
    describe('given single order', function () {
      it('calls insert query with single amount', async function () {
        const orderQuantity = 1
        const product = new Product(1, 'title', 'desc', '', 10, 10)
        const order = new Order(1, orderQuantity)

        await service.createCartOrder([order], [product])

        const queryWithProductAmount = insertQuery.replace(
          '<totalAmount>',
          `${product.price * orderQuantity}`
        )
        assert.equal(mockDatabase.queryString, queryWithProductAmount)
      })
    })

    describe('given ordering 2 items', function () {
      it('calls insert query with double amount', async function () {
        const orderQuantity = 2
        const product = new Product(1, 'title', 'desc', '', 10, 10)
        const order = new Order(1, orderQuantity)

        await service.createCartOrder([order], [product])

        const queryWithProductAmount = insertQuery.replace(
          '<totalAmount>',
          `${product.price * orderQuantity}`
        )
        assert.equal(mockDatabase.queryString, queryWithProductAmount)
      })
    })
  })
})
