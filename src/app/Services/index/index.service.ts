import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class IndexService {
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.cookieService.get('auth'),
    }),
  };

  constructor(
    private httpClient: HttpClient,
    private cookieService: CookieService
  ) {}
  private API_PRODUCT = 'http://localhost:8080/ede-product';

  public getProductSelling() {
    return this.httpClient.get<any>(this.API_PRODUCT + '/view/productSelling');
  }

  public getTopTag(){
    return this.httpClient.get<any>(
      this.API_PRODUCT + '/view/customer/product/top10/tag'
    );
  }
}
