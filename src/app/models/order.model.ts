export interface Order {
  id: string;
  phone: string;
  status: string;
  create_date: Date;
  discount_code: string;
  total_amount: number;
  note: string;
  user: string;
}
