import { Injectable } from '@angular/core';
import {
  HttpHeaders,
  HttpClient,
  HttpErrorResponse,
} from '@angular/common/http';
import country from '../../../app/country.json';
import { User } from '../../models/user.model';
@Injectable({
  providedIn: 'root',
})
export class ApiAddressService {
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };
  constructor(private httpClient: HttpClient) {}

  private REST_API_SERVER = 'https://api-location-vn.herokuapp.com/';

  public getCountry() {
    return JSON.parse(JSON.stringify(country));
  }

  public getApiCity() {
    const url = `${this.REST_API_SERVER}provinces/`;
    return this.httpClient.get<any>(url, this.httpOptions);
  }

  public getApiDistricts(id: any) {
    const url = `${this.REST_API_SERVER}districts/province/` + id;
    return this.httpClient.get<any>(url, this.httpOptions);
  }

  public getApiWards(id: any) {
    const url = `${this.REST_API_SERVER}wards/district/` + id;
    return this.httpClient.get<any>(url, this.httpOptions);
  }
}
