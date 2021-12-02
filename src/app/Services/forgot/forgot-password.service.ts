import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ForgotPasswordService {

  private url = 'http://localhost:8080/ede-customer/forgot-password'

  constructor(private http: HttpClient) { }

  async sendOTP(email: string) {
    return this.http.post<any>(`${this.url}/get-otp`, {email: email}).toPromise()
  }

  async resetPasswordOtp(user: any) {
    return this.http.patch<any>(`${this.url}/reset-password`, user).toPromise()
  }

  async resetPasswordToken(user: any) {
    return this.http.patch<any>(`${this.url}/reset-password/token`, user).toPromise()
  }

}
