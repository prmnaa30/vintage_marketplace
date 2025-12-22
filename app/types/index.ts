export interface Product {
  id: string
  name: string
  searchKeywords: string[]
  price: number
  shippingFee: number
  stock: number
  brand: string
  category: string
  color: string
  image: string
  size: string
  condition: string
  likesCount: number
  description: string
  createdAt: string | Date
}

export type ProductCardType = Pick<Product,
  | 'id'
  | 'name'
  | 'price'
  | 'image'
  | 'size'
  | 'likesCount'
>

export interface CartItem {
  productId: string
  name: string
  price: number
  image: string
  size: string
  color: string
  stock: number
  shippingFee: number
  quantity: number
}
