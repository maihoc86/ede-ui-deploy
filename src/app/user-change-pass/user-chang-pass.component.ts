import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { CookieService } from 'ngx-cookie-service';
import { HeaderService } from 'src/app/Services/header/header.service';
import { AccountActiveService } from '../Services/account/account-active.service';
@Component({
  selector: 'app-user-chang-pass',
  templateUrl: './user-chang-pass.component.html',
  styleUrls: ['./user-chang-pass.component.css']
})
export class UserChangPassComponent implements OnInit {
  public form = new FormGroup({
    pass: new FormControl('',[Validators.required]),
    newpass :  new FormControl('',[Validators.required]),
    confirm :  new FormControl('',[Validators.required]),
  }) 
  constructor(
    private accountService:AccountActiveService,
    private headerService: HeaderService,
    private cookieService: CookieService,) { }
  public userlogin: any;
  public Error:any="";
  ngOnInit(): void {
    this.getUserLogin();
  }
  public getUserLogin() {
    this.headerService
     .getUserByToken(this.cookieService.get('auth'))
     .toPromise()
     .then((data) => {
    
       this.userlogin = data;
       console.log(data);
     })
     .catch((err) => {
       console.log(err);
     });
 }
 public changePassWord(){
   if(!this.form.valid){
     this.Error="Vui lòng nhập đầy đủ thông tin"
   }else if(this.userlogin.password!=this.form.controls['pass'].value){
    this.Error="Mật khẩu hiện tại không đúng"
   }else if(this.form.controls['newpass'].value!=this.form.controls['confirm'].value){
    this.Error="Nhập lại mật khẩu không đúng"
   }else{
    this.Error="...............";
    this.accountService.changePassWord(this.userlogin.id,this.form.controls['newpass'].value).subscribe(
      data=>{
        this.Error="Đổi mật khẩu thành công";
        this.userlogin=data;
        this.form.reset();
      }
    )
   }
 }
}
