class Product {
  id: number
  title: string
  description: string
  imageUrl: string
  quantity: number
  price: number

  constructor(
    id: number,
    title: string,
    description: string,
    imageUrl: string,
    quantity: number,
    price: number
  ) {
    this.id = id
    this.title = title
    this.description = description ?? undefined
    this.imageUrl = imageUrl ?? undefined
    this.quantity = quantity ?? undefined
    this.price = price ?? undefined
  }
}

export default Product
