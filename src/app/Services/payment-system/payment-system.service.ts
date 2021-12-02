import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PaymentSystemService {
  private url = 'http://localhost:8080/ede-system/payment/user';
  private url_payment_momo =
    'https://test-payment.momo.vn:443/v2/gateway/api/create';

  constructor(private http: HttpClient) {}

  getPaymentSystemById(id: string) {
    return this.http.get<any>(`${this.url}/getPaymentByName?id=` + id);
  }

  getAllPaymentSystem() {
    return this.http.get<any>(`${this.url}/getAllPayment`);
  }

  getQrCodeMomo(header: any) {
    return this.http.post<any>(`${this.url_payment_momo}`, header);
  }
}
