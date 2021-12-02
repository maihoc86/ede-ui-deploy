import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountActiveService } from '../Services/account/account-active.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-account-active',
  templateUrl: './account-active.component.html',
  styleUrls: ['./account-active.component.css']
})
export class AccountActiveComponent implements OnInit {
  public token: string = ''
  public email: string = ''
  constructor(private activatedRoute: ActivatedRoute, private activeAccount: AccountActiveService, private router: Router) {
    this.activatedRoute.queryParams.subscribe(observer => {
      this.token = observer['token']
      this.email = observer['email']
    })
  }
  ngOnInit(): void {
    this.activeAccount.checkActive(this.email, this.token).subscribe((data) => {
      console.log(data);
    },err => {
      this.router.navigate(['']);
      Swal.fire({
        icon: 'error',
        title: 'Đã có lỗi',
        text: err.error.message,
        confirmButtonText: `OK`,
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['']);
        } else {
          this.router.navigate(['']);
        }
      })
    })
  }
}
