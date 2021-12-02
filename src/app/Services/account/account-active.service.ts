import { Injectable } from '@angular/core';
import {
  HttpHeaders,
  HttpClient,
  HttpErrorResponse,
} from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
@Injectable({
  providedIn: 'root'
})
export class AccountActiveService {
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.cookieService.get('auth'),
    }),
  }; constructor(private httpClient: HttpClient,    private cookieService: CookieService) { }

  private REST_API_SERVER = 'http://localhost:8080/ede-customer';
 
  public checkActive(email: string, token: string) {
    var body = 'email='+email+'&token='+token;
    return this.httpClient.post<any>(this.REST_API_SERVER + '/account/verify', body, this.httpOptions);
  }
  public changePassWord(id:any,newpass:any){
    return this.httpClient.put<any>(this.REST_API_SERVER + '/user/changepassword/'+id, newpass, this.httpOptions);
  }
}
