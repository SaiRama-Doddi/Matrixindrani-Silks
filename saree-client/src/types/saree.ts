export interface Saree {
  id: string;
  productName: string;
  category: string;
  price: number;
  offerPrice?: number;
  rating?: number;
  image1?: string;
  image2?: string;
  image3?: string;
  createdAt: string;
  createdBy?: string;
}

export interface AdminUser {
  id: string;
  email: string;
  fullName: string;
  createdAt: string;
}
