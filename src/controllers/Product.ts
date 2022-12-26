import ProductService, { ProductServiceType } from '../services/Product'
import Database from '../providers/Database'

export default class Product {
  productService: ProductServiceType

  constructor(productService: ProductServiceType) {
    this.productService = productService
  }

  public static getController() {
    const database = new Database()
    return new ProductService(database)
  }

  public static async perform(req, res): Promise<Product[]> {
    const keyword = req.query.keyword
    const isDescending = (req.query.sort ?? '').toLowerCase() == 'desc'

    const controller = Product.getController()

    const products = await controller.getProducts(
      'price',
      isDescending,
      keyword
    )

    return res.status(200).json(products)
  }
}
