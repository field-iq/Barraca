export interface StoreCartItem {
  productId: string;
  quantity: number;
}

export interface StoreOrderCustomer {
  name: string;
  email: string;
  phone?: string;
  notes?: string;
}

export interface StoreOrderRequest {
  items: StoreCartItem[];
  customer: StoreOrderCustomer;
  website?: string;
}

export interface StoreOrderResult {
  ok: true;
  orderId: string;
}
