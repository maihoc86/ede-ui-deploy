import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ForgotPasswordService } from '../Services/forgot/forgot-password.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  public myform: FormGroup
  public form: any = {}
  public countdown: number = 0
  public token: string = ''

  constructor(
    private forgotPasswordSv: ForgotPasswordService,
    private activedRoute: ActivatedRoute) {
      this.myform = new FormGroup({
        email: new FormControl(this.form.email, [Validators.required, Validators.email]),
        otp: new FormControl(this.form.otp, [Validators.required, Validators.minLength(6), Validators.maxLength(6)]),
        password: new FormControl(this.form.password, [Validators.required, Validators.minLength(8)]),
        repassword: new FormControl(this.form.repassword, [Validators.required, Validators.minLength(8)])
      })
      this.activedRoute.queryParams.subscribe(observer => {
        this.token = observer['token']
        this.myform.get('email')?.setValue(observer['email'])
      })
    }

  ngOnInit(): void {

  }

  btnSendOTPClick(): void {
    this.countdown = 60
    this.coverForm()
    this.forgotPasswordSv.sendOTP(this.form.email)
    .then(
      response => {
        if (response) {
          let count = () => {
            setTimeout(() => {
              if (--this.countdown >= 0) {
                count()
              }
            }, 1000)
          }
          count()
          this.token = '1'
        }
        else {
          this.countdown = 0
        }
      },
      error => {
        this.countdown = 0;
        alert('Có lỗi xảy ra, vui lòng thử lại')
        console.log(error)
      }
    )
  }

  btnResetPasswordClick(): void {
    this.coverForm()
    if ('1' === this.token) {
      this.forgotPasswordSv.resetPasswordOtp(this.form)
      .then (
        response => {
          if (response) {
            alert('Đã quên mật khẩu')
          }
        },
        error => {
          alert('Có lỗi xảy ra, vui lòng thử lại')
          console.log(error)
        }
      )
      return
    }
    if (this.token){
      this.form.otp = this.token
      this.forgotPasswordSv.resetPasswordToken(this.form)
      .then (
        response => {
          if (response) {
            alert('Đã quên mật khẩu')
          }
        },
        error => {
          alert('Có lỗi xảy ra, vui lòng thử lại')
          console.log(error)
        }
      )
      return
    }
    if (!this.token) {
      alert('vui lòng Get OTP và nhập OTP')
    }
  }

  private coverForm() {
    this.form.email = this.myform.get('email')?.value
    this.form.otp = this.myform.get('otp')?.value
    this.form.password = this.myform.get('password')?.value
    this.form.repassword = this.myform.get('repassword')?.value
  }

}
