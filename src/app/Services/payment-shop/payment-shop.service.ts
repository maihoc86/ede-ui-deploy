import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class PaymentShopService {
  private url = 'http://localhost:8080/ede-customer/shop';
  constructor(private http: HttpClient, private cookieService: CookieService) {}

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.cookieService.get('auth'),
    }),
  };

  getAllPayment(page: any, size: any, keyword: any) {
    return this.http.get<any>(
      `${this.url}/getAllPayment?page=${page}&size=${size}&keyword=${keyword}`,
      this.httpOptions
    );
  }

  deletePaymentById(id: any) {
    return this.http.delete(
      `${this.url}/deletePayment?id=` + id,
      this.httpOptions
    );
  }

  addPaymentShop(value: any) {
    return this.http.post<any>(
      `${this.url}/addPayment`,
      value,
      this.httpOptions
    );
  }

  updatePaymentShop(value: any) {
    return this.http.put<any>(
      `${this.url}/updatePayment`,
      value,
      this.httpOptions
    );
  }
}
