import { Component, OnInit } from '@angular/core';
import { HeaderService } from 'src/app/Services/header/header.service';
import { CookieService } from 'ngx-cookie-service';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
} from '@angular/forms';
@Component({
  selector: 'app-aside-shop',
  templateUrl: './aside-shop.component.html',
  styleUrls: ['./aside-shop.component.css']
})
export class AsideShopComponent implements OnInit {

  constructor(private headerService:HeaderService,private cookieService:CookieService,  private router: Router,) { }
 
  ngOnInit(): void {
  }


}
