class Order {
  id: number
  quantity: number

  constructor(id: number, quantity: number) {
    this.id = id
    this.quantity = quantity ?? 0
  }
}

export default Order
