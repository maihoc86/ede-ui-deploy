import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RegisterService } from 'src/app/Services/register/register-service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent implements OnInit {
  constructor(private registerService: RegisterService) {}
  public subscribe = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });
  ngOnInit(): void {}

  subscribe_newsletter() {
    this.registerService
      .receiveEmailNews(this.subscribe.controls.email.value)
      .subscribe(
        (data: any) => {
          console.log(data);
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'You have successfully subscribed to our newsletter',
          });
        },
        (error: any) => {
          console.log(error);
          Swal.fire({
            icon: 'error',
            title: error.error.errors[0].defaultMessage,
            text: error.error.message,
          });
        }
      );
  }
}
