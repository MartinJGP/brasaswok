export interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
  subtotal: number;
  category: string;
}
