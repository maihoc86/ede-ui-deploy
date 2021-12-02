import { Injectable } from '@angular/core';
import {
  HttpHeaders,
  HttpClient,
  HttpErrorResponse,
} from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class LoginServiceService {

  constructor(private httpClient:HttpClient) { }
  private url = `http://localhost:8080/ede-oauth-service/api/auth/signin`;
  public doLogin(username:string,password:string){
    return this.httpClient.post<any>(this.url,{'username':username,'password':password});
  }
}
