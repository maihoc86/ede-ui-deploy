import { User } from 'src/app/models/user.model';
import { CookieService } from 'ngx-cookie-service';
import { HeaderService } from 'src/app/Services/header/header.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-account',
  templateUrl: './user-account.component.html',
  styleUrls: ['./user-account.component.css'],
})
export class UserAccountComponent implements OnInit {
  constructor(
    private headerService: HeaderService,
    private cookieService: CookieService
  ) {}

  ngOnInit(): void {
    this.getUserLogin();
    this.getShop();
  }
  public login: boolean = false;
  public userAcc: any;
  public shop: any;
  mask = (cc: any, num = 4, mask = '*') =>
    `${cc}`.slice(-num).padStart(`${cc}`.length, mask);

  public getUserLogin() {
    this.headerService
      .getUserByToken(this.cookieService.get('auth'))
      .toPromise()
      .then((data) => {
        this.login = true;
        this.userAcc = data;
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
        this.login = false;
      });
  }

  getShop() {
    this.headerService
      .getShopByToken(this.cookieService.get('auth'))
      .subscribe((data) => {
        console.log(data);
        this.shop = data;
      });
    //
  }
}
