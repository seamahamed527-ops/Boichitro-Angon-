export interface Product {
  id: string;
  titleBn: string;
  titleEn: string;
  category: 'all' | 'mens' | 'womens' | 'festive' | 'casual';
  categoryLabelBn: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  rating: number;
  reviewsCount: number;
  images: string[];
  descriptionBn: string;
  fabricBn: string;
  sizes: string[];
  colors: { nameBn: string; nameEn: string; hex: string }[];
  inStock: boolean;
  isFeatured?: boolean;
  isNew?: boolean;
  tagBn?: string;
}

export interface CartItem {
  id: string; // unique item id (productId + size + color)
  product: Product;
  selectedSize: string;
  selectedColor: { nameBn: string; nameEn: string; hex: string };
  quantity: number;
}

export interface TrackingEvent {
  titleBn: string;
  descriptionBn: string;
  timestamp: string;
  completed: boolean;
  current?: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: CartItem[];
  customerName: string;
  phone: string;
  address: string;
  city: string;
  note?: string;
  paymentMethod: 'cod' | 'bkash';
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  status: string;
  currentStageIndex: number; // 0: Placed, 1: Packing, 2: Dispatched, 3: Out for Delivery, 4: Delivered
  courierName?: string;
  consignmentId?: string;
  estimatedDelivery?: string;
  riderName?: string;
  riderPhone?: string;
  events?: TrackingEvent[];
  createdAt: string;
}

export interface ProductReview {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase: boolean;
  helpfulCount?: number;
}

export interface PromoCode {
  code: string;
  discountPercent: number;
  description: string;
}
