class CartOrder {
  id: number
  amount: number
  paymentStatus: string

  constructor(id: number, amount: number, paymentStatus: string) {
    this.id = id
    this.amount = amount
    this.paymentStatus = paymentStatus
  }
}

export default CartOrder
