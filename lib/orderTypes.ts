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

export type StoreDeliveryOption = "delivery" | "pickup";
export type StoreDeliveryMethod = "zone" | "distance";

export interface StoreOrderDelivery {
  option: StoreDeliveryOption;
  method?: StoreDeliveryMethod;
  zoneId?: string;
  distanceKm?: number;
}

export interface StoreOrderRequest {
  items: StoreCartItem[];
  customer: StoreOrderCustomer;
  delivery: StoreOrderDelivery;
  website?: string;
}

export interface StoreOrderResult {
  ok: true;
  orderId: string;
}
