/* eslint-env node, mocha */
import { assert } from 'chai'
import MockDatabase from '../mocks/Database'
import ProductService, { ProductServiceType } from '../../src/services/Product'

describe('Cart service', function () {
  let service: ProductServiceType
  let mockDatabase: MockDatabase

  this.beforeEach(() => {
    mockDatabase = new MockDatabase()

    service = new ProductService(mockDatabase)
  })

  describe('getProducts', function () {
    describe('no additional options', function () {
      it('calls select query plainly', async function () {
        await service.getProducts(undefined, undefined, undefined)
        let expectedQuery =
          'SELECT id, title, description, imageUrl, quantity, price FROM product'

        assert.equal(mockDatabase.queryString, expectedQuery)
      })
    })

    describe('with sortColumn parameter', function () {
      it('calls select query with column sort', async function () {
        await service.getProducts('foo', undefined, undefined)
        let expectedQuery =
          'SELECT id, title, description, imageUrl, quantity, price FROM product ORDER BY foo'

        assert.equal(mockDatabase.queryString, expectedQuery)
      })
    })

    describe('with keyword', function () {
      it('calls select query with keyword query for title and description', async function () {
        await service.getProducts(undefined, undefined, 'bar')
        let expectedQuery =
          "SELECT id, title, description, imageUrl, quantity, price FROM product WHERE title LIKE '%bar%' OR description LIKE '%bar%'"

        assert.equal(mockDatabase.queryString, expectedQuery)
      })
    })
  })
})
