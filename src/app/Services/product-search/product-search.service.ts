import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductSearchService {

  constructor(
    private httpClient: HttpClient
  ) { }

  private URL_ORIGIN: string = 'http://localhost:8080'

  public getProductByKeySearch(queryParam: any) {
    return (this.httpClient.get<Response>(`${this.URL_ORIGIN}/ede-product/view/get-products`, {params : queryParam}))
  }

  public getProductSearchById(id: string) {
    return this.httpClient.get<any>(`${this.URL_ORIGIN}/ede-product/view/get-product-search/${id}`)
  }

  public loadListProductRelatedShop(id: string,idcate:string) {
    return this.httpClient.get<any>(`${this.URL_ORIGIN}/ede-product/view/get-product-related-shop/${id}?idcate=${idcate}`)
  }
  public loadListProductRelatedProduct(id: string) {
    return this.httpClient.get<any>(`${this.URL_ORIGIN}/ede-product/view/get-product-related-product/${id}`)
  }
  public loadListProductRelatedCategory(id: string) {
    return this.httpClient.get<any>(`${this.URL_ORIGIN}/ede-product/view/get-product-related-category/${id}`)
  }

  public loadListProductAllShop(page: any) {
    return this.httpClient.get<any>(`${this.URL_ORIGIN}/ede-product/view/get-product-all-shop?page=`+page)
  }
}
