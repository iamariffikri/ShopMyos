import { Product } from './Product'

export interface OrderType {
  id: number
  quantity: number
}

export interface Invoice {
  cartId: number
  orders: OrderType[]
  grandTotal: number
}

export interface ProductOrderType {
  id: number
  product: Product
  quantity: number
  amount: number
}

export interface CartOrderType {
  id: number
  amount: number
  paymentStatus: string
}
