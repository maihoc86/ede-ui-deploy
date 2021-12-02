import { UserAddress } from './../../models/user-address.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class AddressUserService {
  constructor(
    private httpClient: HttpClient,
    private cookieService: CookieService
  ) {}

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.cookieService.get('auth'),
    }),
  };

  private REST_API_SERVER = 'http://localhost:8080/ede-customer';

  public getAllAdressByUser() {
    const url = this.REST_API_SERVER + '/user/address/getAll';
    return this.httpClient.get<any>(url, this.httpOptions);
  }

  public addAddress(data: UserAddress) {
    const url = this.REST_API_SERVER + '/user/add-new-address';
    return this.httpClient.post<any>(url, data, this.httpOptions);
  }

  public updateAddress(data: UserAddress) {
    const url = this.REST_API_SERVER + '/user/update-address';
    return this.httpClient.put<any>(url, data, this.httpOptions);
  }

  public updateAddressMain(data: UserAddress) {
    const url = this.REST_API_SERVER + '/user/update-main-address';
    return this.httpClient.put<any>(url, data, this.httpOptions);
  }

  public deleteAddress(id: any) {
    const url = this.REST_API_SERVER + '/user/delete-address/' + id;
    return this.httpClient.delete<any>(url, this.httpOptions);
  }
}
