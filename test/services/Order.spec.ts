/* eslint-env node, mocha */
import { assert } from 'chai'
import MockDatabase from '../mocks/Database'
import OrderService, { OrderServiceType } from '../../src/services/Order'
import Order from '../../src/models/Order'
import Product from '../../src/models/Product'

describe('Order service', function () {
  let service: OrderServiceType
  let mockDatabase: MockDatabase
  let insertQuery: string

  this.beforeEach(() => {
    mockDatabase = new MockDatabase()

    service = new OrderService(mockDatabase)
    insertQuery = `INSERT INTO order_details (quantity, user_id, cart_id, product_id) VALUES <orderValues>`
  })

  describe('createCartOrder', function () {
    describe('given single order with values', function () {
      it('calls insert query with correct values', async function () {
        const orderQuantity = 222
        const cartOrderId = 333
        const orderId = 444
        const userId = 555
        const order = new Order(orderId, orderQuantity)

        await service.createOrderDetails([order], cartOrderId, userId)

        const queryWithOrderValues = insertQuery.replace(
          '<orderValues>',
          `(${orderQuantity}, ${userId}, ${cartOrderId}, ${orderId})`
        )
        assert.equal(mockDatabase.queryString, queryWithOrderValues)
      })
    })

    describe('given multilple order with values', function () {
      it('calls insert query with correct values', async function () {
        const orderQuantity1 = 222
        const orderId1 = 444
        const order1 = new Order(orderId1, orderQuantity1)

        const orderQuantity2 = 222
        const orderId2 = 444
        const order2 = new Order(orderId2, orderQuantity2)

        const cartOrderId = 333
        const userId = 555

        await service.createOrderDetails([order1, order2], cartOrderId, userId)

        const queryWithOrderValues = insertQuery.replace(
          '<orderValues>',
          `(${orderQuantity1}, ${userId}, ${cartOrderId}, ${orderId1}), (${orderQuantity2}, ${userId}, ${cartOrderId}, ${orderId2})`
        )
        assert.equal(mockDatabase.queryString, queryWithOrderValues)
      })
    })
  })
})
