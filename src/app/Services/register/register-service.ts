import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { User } from '../../models/user.model';
@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  private REST_API_SERVER = 'http://localhost:8080/ede-customer';
  constructor(private httpClient: HttpClient) {}
  public registerAccount(data: User) {
    return this.sendData(data, this.REST_API_SERVER + '/register');
  }

  public createAccountByAdmin(data: User) {
    return this.sendData(
      data,
      this.REST_API_SERVER + '/create-account-by-admin'
    );
  }

  public sendData(data: User, url: string) {
    return this.httpClient.post<any>(url, data, this.httpOptions);
  }

  async sendEmail(email: string) {
    return this.httpClient
      .post<any>(this.REST_API_SERVER + '/send-email-verify', { email: email })
      .toPromise();
  }

  receiveEmailNews(email: string) {
    return this.httpClient.post<any>(
      this.REST_API_SERVER + '/receive-email-news',
      { email: email }
    );
  }
  sendContact(contact: any) {
    return this.httpClient.post<any>(
      this.REST_API_SERVER + '/send-contact',
      contact
    ); // TODO
  }
}
