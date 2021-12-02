import { Shop } from "./shop.model";

export interface User {
  id?: string;
  username: string;
  password: string;
  firstname: string;
  lasname: string;
  email: string;
  phone: string;
  photo?: string;
  gender: string;
  address: string;
  is_deleted: boolean;
  role: boolean;
  otp?: string;
  shop: Shop;
}
