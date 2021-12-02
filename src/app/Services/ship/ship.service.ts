import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ShipService {
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };
  constructor(private httpClient: HttpClient) {}

  private REST_API_SERVER = 'http://localhost:8080/ede-system/transportation/';

  public getShippingCompany() {
    const url = this.REST_API_SERVER + 'get-api-names/';
    return this.httpClient.get<any>(url, this.httpOptions);
  }

  // Lấy ra tất cả tp và tỉnh
  public getApiCity(methodShip: string) {
    const url = this.REST_API_SERVER + methodShip + '/get-provices';
    return this.httpClient.get<any>(url, this.httpOptions);
  }

  // Lấy ra tất cả quận huyện của tỉnh
  public getApiDistricts_byCity(methodShip: string, id: any) {
    const url =
      this.REST_API_SERVER + methodShip + '/get-districts?province_id=' + id;
    return this.httpClient.get<any>(url, this.httpOptions);
  }

  public getApiWardsByDisctrict(methodShip: string, id: any) {
    const url =
      this.REST_API_SERVER + methodShip + '/get-wards?district_id=' + id;

    return this.httpClient.get<any>(url, this.httpOptions);
  }

  public getApiMethodShip(
    methodShip: string,
    from_district: string,
    to_district: string
  ) {
    const url =
      this.REST_API_SERVER +
      methodShip +
      '/get-available-services?from_district=' +
      from_district +
      '&to_district=' +
      to_district;
    return this.httpClient.get<any>(url, this.httpOptions);
  }

  /**
   * Tính phí vận chuyển
   * @param company đơn vị vận chuyển
   * @param from_district_id từ quận huyện
   * @param to_district_id  đến quận huyện
   * @param service_id dịch vụ vận chuyển (đi bộ, xe) // này chưa có làm, để data cứng test []
   * @param weight trọng lượng
   * @returns
   */
  public getFeeShip(
    company: string,
    from_district_id: any,
    to_district_id: any,
    service_id: any,
    weight: any
  ) {
    const url =
      this.REST_API_SERVER +
      company +
      '/get-transport-fee?from_district=' +
      from_district_id +
      '&to_district=' +
      to_district_id +
      '&service_id=' +
      service_id +
      '&weight=' +
      weight;
    return this.httpClient.get<any>(url, this.httpOptions);
  }
}
