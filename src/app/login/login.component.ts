import { ReturnAddressService } from '../Services/return-address/return-address.service';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { LoginServiceService } from '../Services/login/login-service.service';
import { CookieService } from 'ngx-cookie-service';
import { HeaderService } from '../Services/header/header.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public form = new FormGroup({
    username: new FormControl(''),
    password: new FormControl('')
  })
  public cart: Array<any> = [];
  public loading = false;
  constructor(private loginService: LoginServiceService,
    private cookieService: CookieService,
    private router: Router,
    private headerService: HeaderService,
    private returnAddress: ReturnAddressService
  ) { }

  ngOnInit(): void {
    this.checkLogin();
  }
  doLogin() {
    this.loginService.doLogin(this.form.controls['username'].value, this.form.controls['password'].value)
      .toPromise().then(data => {
        this.cookieService.set('auth', data.token);
        this.loading = false;
        console.log(data)
      }).catch(error => {
        this.cookieService.set('auth', '');
        console.log(error)
      })
  }

  public doLogin2() {
    this.loading = true;
    this.loginService.doLogin(this.form.controls['username'].value, this.form.controls['password'].value)
      .subscribe(data => {
        this.cookieService.set('auth', data.token);
        this.loading = false;
        console.log(data)
        var json = localStorage.getItem('cart');
        this.cart = json ? JSON.parse(json) : [];
        if(this.cart.length<1){
          this.headerService.getCart(data.id).subscribe(cartitem=>{
             if(cartitem!=null){
              console.log(cartitem)
              this.cart=cartitem as any;
              localStorage.setItem('cart', JSON.stringify(this.cart));
              this.headerService.myMethod(this.cart);
             }
          })
        }else{
          this.headerService.updateCart(this.cart,data.id).subscribe(data=>{
           })
        }
        // Swal.fire({
        //   icon: 'success',
        //   title: 'Th??ng b??o',
        //   text: '????ng nh???p th??nh c??ng!',
        //   confirmButtonText: `OK`,
        // }).then((result) => {
         
        // })
        this.returnAddress.returnAddress();
      },
        (err) => {
          this.loading = false;
          if (err.status == 503) {
            Swal.fire({
              icon: 'error',
              title: 'L???i',
              text: "M??y ch??? kh??ng ho???t ?????ng",
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'L???i',
              text: "Sai th??ng tin ????ng nh???p",
            });
          }
        })

  }

  public checkLogin(){
    this.headerService.getUserByToken(this.cookieService.get('auth')).subscribe(
      () => {
        this.returnAddress.returnAddress();
      }
    )
  }
}
